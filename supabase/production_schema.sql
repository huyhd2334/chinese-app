-- =====================================================================
-- HSK LEARNING PRODUCTION SCHEMA & ROW LEVEL SECURITY (SUPABASE)
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

-- 2. Bảng lưu các bộ thẻ người dùng tạo
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

-- 3. Bảng lưu các thẻ từ vựng người dùng thêm
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

-- 4. Bật Row Level Security (RLS) bắt buộc cho mọi bảng
alter table public.user_subscriptions enable row level security;
alter table public.bonus_collections enable row level security;
alter table public.bonus_cards enable row level security;

-- 5. Chính sách bảo mật (Policies) chặt chẽ: Chỉ chủ tài khoản mới được xem & thao tác
drop policy if exists "Users can manage own subscriptions" on public.user_subscriptions;
create policy "Users can manage own subscriptions" on public.user_subscriptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

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
