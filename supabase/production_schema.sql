-- =====================================================================
-- HSK LEARNING PRODUCTION SCHEMA & STRICT SECURITY (SUPABASE)
-- =====================================================================

-- 1. Bảng quản lý Gói Đăng Ký (Free vs. Pro Monthly / Yearly)
create table if not exists public.user_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro_monthly', 'pro_yearly')),
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Bảng Mã Kích Hoạt (Chỉ Admin quản lý trên Supabase Dashboard)
create table if not exists public.activation_codes (
  code text primary key,
  plan text not null default 'pro_monthly' check (plan in ('pro_monthly', 'pro_yearly')),
  max_uses integer not null default 1,
  used_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Bảng Yêu Cầu Đối Soát Chuyển Khoản Ngân Hàng
create table if not exists public.payment_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  plan text not null check (plan in ('pro_monthly', 'pro_yearly')),
  amount integer not null,
  transfer_ref text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Bảng lưu các bộ thẻ người dùng tạo
create table if not exists public.bonus_collections (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  slug text not null,
  title text not null check (char_length(title) <= 150),
  subtitle text default '',
  language text default 'zh' check (language in ('zh', 'en')),
  badge text default 'Tự Tạo',
  description text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Bảng lưu các thẻ từ vựng người dùng thêm
create table if not exists public.bonus_cards (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  collection_slug text not null,
  word text not null check (char_length(word) <= 150),
  hanzi text,
  pinyin text,
  phonetic text,
  han_viet text,
  part_of_speech text default 'Từ vựng',
  meaning text not null check (char_length(meaning) <= 1000),
  example text,
  example_pinyin text,
  topic text default 'Từ vựng tự thêm',
  language text default 'zh' check (language in ('zh', 'en')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Bật Row Level Security (RLS) bắt buộc cho mọi bảng
alter table public.user_subscriptions enable row level security;
alter table public.activation_codes enable row level security;
alter table public.payment_requests enable row level security;
alter table public.bonus_collections enable row level security;
alter table public.bonus_cards enable row level security;

-- 7. Chính sách bảo mật (RLS Policies):
-- QUAN TRỌNG: Người dùng CHỈ ĐƯỢC XEM (SELECT) gói cước của mình, KHÔNG ĐƯỢC tự ý INSERT/UPDATE lên Pro từ phía Client!
drop policy if exists "Users can manage own subscriptions" on public.user_subscriptions;
drop policy if exists "Users can view own subscription" on public.user_subscriptions;
create policy "Users can view own subscription" on public.user_subscriptions
  for select
  using (auth.uid() = user_id);

-- Người dùng chỉ được tạo và xem yêu cầu xác nhận chuyển khoản của chính mình (trạng thái luôn là pending)
drop policy if exists "Users can view own payment requests" on public.payment_requests;
create policy "Users can view own payment requests" on public.payment_requests
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert pending payment requests" on public.payment_requests;
create policy "Users can insert pending payment requests" on public.payment_requests
  for insert
  with check (auth.uid() = user_id and status = 'pending');

-- Chính sách cho bộ từ vựng Bonus
drop policy if exists "Users can manage own collections" on public.bonus_collections;
create policy "Users can manage own collections" on public.bonus_collections
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can manage own cards" on public.bonus_cards;
create policy "Users can manage own cards" on public.bonus_cards
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 8. Hàm RPC Bảo mật (Security Definer) để kích hoạt bằng Mã Kích Hoạt hợp lệ
create or replace function public.redeem_activation_code(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_code_row public.activation_codes%rowtype;
  v_duration interval;
  v_expires_at timestamp with time zone;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return jsonb_build_object('success', false, 'message', 'Vui lòng đăng nhập tài khoản trước khi kích hoạt.');
  end if;

  select * into v_code_row
  from public.activation_codes
  where upper(code) = upper(trim(p_code))
    and is_active = true
  for update;

  if not found then
    return jsonb_build_object('success', false, 'message', 'Mã kích hoạt không tồn tại hoặc đã bị khóa.');
  end if;

  if v_code_row.used_count >= v_code_row.max_uses then
    return jsonb_build_object('success', false, 'message', 'Mã kích hoạt này đã hết lượt sử dụng.');
  end if;

  -- Tăng số lượt đã dùng
  update public.activation_codes
  set used_count = used_count + 1
  where code = v_code_row.code;

  -- Tính ngày hết hạn
  if v_code_row.plan = 'pro_yearly' then
    v_duration := interval '365 days';
  else
    v_duration := interval '30 days';
  end if;
  v_expires_at := now() + v_duration;

  -- Cập nhật gói Pro cho user
  insert into public.user_subscriptions (user_id, plan, status, started_at, expires_at, updated_at)
  values (v_user_id, v_code_row.plan, 'active', now(), v_expires_at, now())
  on conflict (user_id) do update
  set plan = excluded.plan,
      status = 'active',
      started_at = now(),
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

-- 9. Hàm RPC để người dùng tự hủy / đưa về gói Free (dùng khi muốn hủy gia hạn hoặc test)
create or replace function public.cancel_my_subscription()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return jsonb_build_object('success', false, 'message', 'Chưa đăng nhập.');
  end if;

  update public.user_subscriptions
  set plan = 'free',
      status = 'cancelled',
      expires_at = null,
      updated_at = now()
  where user_id = v_user_id;

  return jsonb_build_object('success', true);
end;
$$;
