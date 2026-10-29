-- =====================================================================
-- PRODUCTION HARDENING MIGRATION
-- Chạy SAU supabase/production_schema.sql (idempotent - chạy lại nhiều lần an toàn)
--
-- Nội dung:
--   1. orders + payment_transactions : thanh toán tự động qua webhook (idempotent)
--   2. process_payment_webhook()      : chỉ service_role được gọi, cộng dồn hạn Pro
--   3. redeem_activation_code()       : chống brute-force + mỗi user chỉ dùng 1 mã 1 lần + cộng dồn hạn
--   4. is_pro()                       : kiểm tra Pro phía server
--   5. srs_items                      : đồng bộ ôn tập SRS đa thiết bị (chỉ ghi được khi là Pro)
--   6. Realtime cho orders / user_subscriptions
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Helper: kiểm tra Pro ở phía server (dùng được trong RLS policy)
-- ---------------------------------------------------------------------
create or replace function public.is_pro(p_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_subscriptions s
    where s.user_id = p_user
      and s.status = 'active'
      and s.plan in ('pro_monthly', 'pro_yearly')
      and (s.expires_at is null or s.expires_at > now())
  );
$$;

-- ---------------------------------------------------------------------
-- 1. Đơn hàng + nhật ký giao dịch ngân hàng
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_code text unique not null,                       -- ví dụ HSKA1B2C3D4 (nội dung chuyển khoản)
  user_id uuid references auth.users(id) on delete cascade not null,
  plan text not null check (plan in ('pro_monthly', 'pro_yearly')),
  amount integer not null check (amount > 0),
  paid_amount integer not null default 0,
  status text not null default 'pending' check (status in ('pending', 'completed', 'expired', 'failed')),
  payment_method text not null default 'vietqr',
  transaction_ref text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

create index if not exists idx_orders_user on public.orders(user_id, created_at desc);
create index if not exists idx_orders_status on public.orders(status);

create table if not exists public.payment_transactions (
  id bigint generated always as identity primary key,
  provider text not null,
  provider_tx_id text not null,
  order_code text,
  amount integer not null,
  result text not null,                                  -- completed | partial | unmatched | duplicate_order
  raw jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (provider, provider_tx_id)                      -- Idempotency: webhook gửi lặp không bao giờ cộng 2 lần
);

alter table public.orders enable row level security;
alter table public.payment_transactions enable row level security;

-- User chỉ ĐƯỢC XEM đơn của mình. Tạo / sửa đơn chỉ qua API server (service_role).
drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);

-- payment_transactions: không policy nào => chỉ service_role truy cập được.

-- Thay thế luồng payment_requests cũ (client tự insert) bằng luồng orders do server kiểm soát
drop policy if exists "Users can insert pending payment requests" on public.payment_requests;

-- ---------------------------------------------------------------------
-- 2. Xử lý webhook ngân hàng (atomic + idempotent)
-- ---------------------------------------------------------------------
create or replace function public.process_payment_webhook(
  p_provider text,
  p_tx_id text,
  p_content text,
  p_amount integer,
  p_raw jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
  v_order public.orders%rowtype;
  v_inserted bigint;
  v_paid integer;
  v_current_exp timestamp with time zone;
  v_base timestamp with time zone;
  v_new_exp timestamp with time zone;
  v_days integer;
begin
  -- 1) Ghi nhận giao dịch; trùng (provider, tx_id) => đã xử lý, trả về ngay
  insert into public.payment_transactions (provider, provider_tx_id, amount, result, raw)
  values (p_provider, p_tx_id, p_amount, 'unmatched', p_raw)
  on conflict (provider, provider_tx_id) do nothing
  returning id into v_inserted;

  if v_inserted is null then
    return jsonb_build_object('success', true, 'result', 'duplicate_transaction');
  end if;

  -- 2) Tìm mã đơn trong nội dung chuyển khoản (ngân hàng có thể bỏ khoảng trắng / dấu)
  v_code := substring(upper(coalesce(p_content, '')) from 'HSK[A-Z0-9]{8}');
  if v_code is null then
    return jsonb_build_object('success', true, 'result', 'unmatched');
  end if;

  select * into v_order from public.orders where order_code = v_code for update;
  if not found then
    update public.payment_transactions set order_code = v_code where id = v_inserted;
    return jsonb_build_object('success', true, 'result', 'unmatched');
  end if;

  update public.payment_transactions set order_code = v_code where id = v_inserted;

  if v_order.status = 'completed' then
    update public.payment_transactions set result = 'duplicate_order' where id = v_inserted;
    return jsonb_build_object('success', true, 'result', 'duplicate_order');
  end if;

  -- 3) Cộng dồn số tiền đã nhận (cho phép chuyển thiếu rồi chuyển bù)
  v_paid := v_order.paid_amount + p_amount;
  if v_paid < v_order.amount then
    update public.orders
      set paid_amount = v_paid, transaction_ref = p_tx_id, updated_at = now()
      where id = v_order.id;
    update public.payment_transactions set result = 'partial' where id = v_inserted;
    return jsonb_build_object(
      'success', true, 'result', 'partial',
      'order_code', v_code, 'user_id', v_order.user_id,
      'missing', v_order.amount - v_paid
    );
  end if;

  -- 4) Đủ tiền: kích hoạt Pro, cộng dồn vào hạn hiện tại nếu còn hiệu lực
  v_days := case when v_order.plan = 'pro_yearly' then 365 else 30 end;

  select expires_at into v_current_exp
  from public.user_subscriptions
  where user_id = v_order.user_id
    and status = 'active'
    and plan in ('pro_monthly', 'pro_yearly');

  v_base := greatest(now(), coalesce(v_current_exp, now()));
  v_new_exp := v_base + make_interval(days => v_days);

  insert into public.user_subscriptions (user_id, plan, status, started_at, expires_at, updated_at)
  values (v_order.user_id, v_order.plan, 'active', now(), v_new_exp, now())
  on conflict (user_id) do update
    set plan = excluded.plan,
        status = 'active',
        expires_at = excluded.expires_at,
        updated_at = now();

  update public.orders
    set status = 'completed', paid_amount = v_paid, transaction_ref = p_tx_id,
        completed_at = now(), updated_at = now()
    where id = v_order.id;

  update public.payment_transactions set result = 'completed' where id = v_inserted;

  return jsonb_build_object(
    'success', true, 'result', 'completed',
    'order_code', v_code, 'user_id', v_order.user_id,
    'plan', v_order.plan, 'amount', v_order.amount, 'expires_at', v_new_exp
  );
end;
$$;

-- Chỉ backend (service_role) mới được kích hoạt Pro từ thanh toán
revoke all on function public.process_payment_webhook(text, text, text, integer, jsonb) from public, anon, authenticated;
grant execute on function public.process_payment_webhook(text, text, text, integer, jsonb) to service_role;

-- ---------------------------------------------------------------------
-- 3. Mã kích hoạt: chống brute-force, 1 user chỉ dùng 1 mã 1 lần, cộng dồn hạn
-- ---------------------------------------------------------------------
create table if not exists public.redeem_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  attempted_at timestamp with time zone default now() not null
);
create index if not exists idx_redeem_attempts_user on public.redeem_attempts(user_id, attempted_at desc);
alter table public.redeem_attempts enable row level security;

create table if not exists public.activation_code_redemptions (
  code text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  redeemed_at timestamp with time zone default now() not null,
  primary key (code, user_id)
);
alter table public.activation_code_redemptions enable row level security;

create or replace function public.redeem_activation_code(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_code_row public.activation_codes%rowtype;
  v_days integer;
  v_current_exp timestamp with time zone;
  v_expires_at timestamp with time zone;
  v_recent_fails integer;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return jsonb_build_object('success', false, 'message', 'Vui lòng đăng nhập tài khoản trước khi kích hoạt.');
  end if;

  -- Khóa tạm 10 phút nếu nhập sai >= 5 lần (chống dò mã)
  select count(*) into v_recent_fails
  from public.redeem_attempts
  where user_id = v_user_id and attempted_at > now() - interval '10 minutes';

  if v_recent_fails >= 5 then
    return jsonb_build_object('success', false, 'message', 'Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 10 phút.');
  end if;

  select * into v_code_row
  from public.activation_codes
  where upper(code) = upper(trim(p_code))
    and is_active = true
  for update;

  if not found then
    insert into public.redeem_attempts (user_id) values (v_user_id);
    return jsonb_build_object('success', false, 'message', 'Mã kích hoạt không tồn tại hoặc đã bị khóa.');
  end if;

  if v_code_row.used_count >= v_code_row.max_uses then
    insert into public.redeem_attempts (user_id) values (v_user_id);
    return jsonb_build_object('success', false, 'message', 'Mã kích hoạt này đã hết lượt sử dụng.');
  end if;

  if exists (select 1 from public.activation_code_redemptions where code = v_code_row.code and user_id = v_user_id) then
    return jsonb_build_object('success', false, 'message', 'Bạn đã sử dụng mã này rồi.');
  end if;

  insert into public.activation_code_redemptions (code, user_id) values (v_code_row.code, v_user_id);

  update public.activation_codes
  set used_count = used_count + 1
  where code = v_code_row.code;

  v_days := case when v_code_row.plan = 'pro_yearly' then 365 else 30 end;

  select expires_at into v_current_exp
  from public.user_subscriptions
  where user_id = v_user_id
    and status = 'active'
    and plan in ('pro_monthly', 'pro_yearly');

  v_expires_at := greatest(now(), coalesce(v_current_exp, now())) + make_interval(days => v_days);

  insert into public.user_subscriptions (user_id, plan, status, started_at, expires_at, updated_at)
  values (v_user_id, v_code_row.plan, 'active', now(), v_expires_at, now())
  on conflict (user_id) do update
  set plan = excluded.plan,
      status = 'active',
      expires_at = excluded.expires_at,
      updated_at = now();

  return jsonb_build_object(
    'success', true,
    'plan', v_code_row.plan,
    'expires_at', v_expires_at,
    'message', 'Kích hoạt Gói Pro thành công!'
  );
end;
$$;

revoke all on function public.redeem_activation_code(text) from public, anon;
grant execute on function public.redeem_activation_code(text) to authenticated;

-- ---------------------------------------------------------------------
-- 4. Đồng bộ ôn tập SRS đa thiết bị (Pro): ghi được CHỈ KHI còn hạn Pro (kiểm tra bằng RLS)
-- ---------------------------------------------------------------------
create table if not exists public.srs_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id text not null,
  status text not null check (status in ('new', 'learning', 'review', 'mastered')),
  due_at bigint not null,
  interval_days integer not null default 0,
  ease_factor real not null default 2.5,
  repetitions integer not null default 0,
  correct_count integer not null default 0,
  wrong_count integer not null default 0,
  created_at_ms bigint not null,
  updated_at_ms bigint not null,
  primary key (user_id, word_id)
);
create index if not exists idx_srs_items_sync on public.srs_items(user_id, updated_at_ms);

alter table public.srs_items enable row level security;

drop policy if exists "srs select own" on public.srs_items;
create policy "srs select own" on public.srs_items
  for select using (auth.uid() = user_id);

drop policy if exists "srs insert own pro" on public.srs_items;
create policy "srs insert own pro" on public.srs_items
  for insert with check (auth.uid() = user_id and public.is_pro());

drop policy if exists "srs update own pro" on public.srs_items;
create policy "srs update own pro" on public.srs_items
  for update using (auth.uid() = user_id and public.is_pro())
  with check (auth.uid() = user_id and public.is_pro());

drop policy if exists "srs delete own" on public.srs_items;
create policy "srs delete own" on public.srs_items
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- 5. Realtime: modal thanh toán tự mở khóa Pro không cần F5
-- ---------------------------------------------------------------------
do $$
begin
  begin
    alter publication supabase_realtime add table public.orders;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.user_subscriptions;
  exception when duplicate_object then null;
  end;
end $$;
