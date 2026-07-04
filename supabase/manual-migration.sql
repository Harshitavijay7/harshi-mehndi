-- ============================================================================
-- HARSHI'S Mehndi Art — Full schema migration for a NEW Supabase project
-- Run this ENTIRE file in your new project's SQL Editor (one shot).
-- It is idempotent-ish: safe to re-run on a fresh project.
-- ============================================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ---------- Roles enum ----------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'moderator', 'customer');
  end if;
end$$;

-- ---------- Shared updated_at trigger fn ----------
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke execute on function public.update_updated_at_column() from public, anon, authenticated;

-- ============================================================================
-- user_roles  (roles live in their OWN table — never on profiles)
-- ============================================================================
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

-- security-definer role check (avoids RLS recursion)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;

drop policy if exists "Users can read own roles" on public.user_roles;
create policy "Users can read own roles" on public.user_roles
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Admins manage all roles" on public.user_roles;
create policy "Admins manage all roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- profiles
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

drop policy if exists "Users manage own profile" on public.profiles;
create policy "Users manage own profile" on public.profiles
  for all to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Admins view all profiles" on public.profiles;
create policy "Admins view all profiles" on public.profiles
  for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- auto-create profile + default role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email)
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role)
  values (new.id, 'customer')
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- products  (public read; admin write)
-- ============================================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  price numeric not null,
  discount_price numeric,
  size text,
  rating numeric not null default 0,
  reviews integer not null default 0,
  in_stock boolean not null default true,
  stock integer not null default 0,
  description text not null default '',
  includes jsonb,
  ingredients text,
  image_key text,
  badge text,
  best_seller boolean not null default false,
  featured boolean not null default false,
  customer_reviews jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;

alter table public.products enable row level security;

drop policy if exists "Anyone can view products" on public.products;
create policy "Anyone can view products" on public.products
  for select using (true);

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products
  for each row execute function public.update_updated_at_column();

-- ============================================================================
-- gallery  (public read; admin write)
-- ============================================================================
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  category text,
  image_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.gallery to anon, authenticated;
grant insert, update, delete on public.gallery to authenticated;
grant all on public.gallery to service_role;

alter table public.gallery enable row level security;

drop policy if exists "Anyone can view gallery" on public.gallery;
create policy "Anyone can view gallery" on public.gallery
  for select using (true);

drop policy if exists "Admins manage gallery" on public.gallery;
create policy "Admins manage gallery" on public.gallery
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop trigger if exists trg_gallery_updated on public.gallery;
create trigger trg_gallery_updated before update on public.gallery
  for each row execute function public.update_updated_at_column();

-- ============================================================================
-- bookings  (authenticated users create/see own; admins see all)
-- ============================================================================
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  service text not null,
  event_date date,
  time_slot text,
  location text,
  special_requirements text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.bookings to authenticated;
grant all on public.bookings to service_role;

alter table public.bookings enable row level security;

drop policy if exists "Users manage own bookings" on public.bookings;
create policy "Users manage own bookings" on public.bookings
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Admins manage all bookings" on public.bookings;
create policy "Admins manage all bookings" on public.bookings
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop trigger if exists trg_bookings_updated on public.bookings;
create trigger trg_bookings_updated before update on public.bookings
  for each row execute function public.update_updated_at_column();

-- ============================================================================
-- orders  (authenticated users create/see own; admins see/manage all)
-- ============================================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text,
  pincode text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  shipping numeric not null default 0,
  total numeric not null default 0,
  payment_method text not null default 'cod',
  payment_status text not null default 'pending',
  transaction_id text,
  payment_screenshot_path text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.orders to authenticated;
grant all on public.orders to service_role;

alter table public.orders enable row level security;

drop policy if exists "Users create own orders" on public.orders;
create policy "Users create own orders" on public.orders
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users view own orders" on public.orders;
create policy "Users view own orders" on public.orders
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Admins manage all orders" on public.orders;
create policy "Admins manage all orders" on public.orders
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated before update on public.orders
  for each row execute function public.update_updated_at_column();

-- ============================================================================
-- cart  (per-user persistent cart)
-- ============================================================================
create table if not exists public.cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);

grant select, insert, update, delete on public.cart to authenticated;
grant all on public.cart to service_role;

alter table public.cart enable row level security;

drop policy if exists "Users manage own cart" on public.cart;
create policy "Users manage own cart" on public.cart
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists trg_cart_updated on public.cart;
create trigger trg_cart_updated before update on public.cart
  for each row execute function public.update_updated_at_column();

-- ============================================================================
-- wishlist  (per-user saved products)
-- ============================================================================
create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

grant select, insert, update, delete on public.wishlist to authenticated;
grant all on public.wishlist to service_role;

alter table public.wishlist enable row level security;

drop policy if exists "Users manage own wishlist" on public.wishlist;
create policy "Users manage own wishlist" on public.wishlist
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================================
-- admin_users  (allow-list of emails that should be granted admin)
-- Managed by admins only. Roles are still enforced via user_roles/has_role.
-- ============================================================================
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

grant select on public.admin_users to authenticated;
grant all on public.admin_users to service_role;

alter table public.admin_users enable row level security;

drop policy if exists "Admins manage admin_users" on public.admin_users;
create policy "Admins manage admin_users" on public.admin_users
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Seed the primary admin email (adjust as needed)
insert into public.admin_users (email)
values ('harshitalalwani678@gmail.com')
on conflict (email) do nothing;

-- ============================================================================
-- STORAGE BUCKETS (private) + policies
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('products', 'products', false),
       ('gallery', 'gallery', false),
       ('payments', 'payments', false)
on conflict (id) do nothing;

-- products bucket: public read via signed URLs from app; admin write
drop policy if exists "Admins write products bucket" on storage.objects;
create policy "Admins write products bucket" on storage.objects
  for all to authenticated
  using (bucket_id = 'products' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'products' and public.has_role(auth.uid(), 'admin'));

drop policy if exists "Auth read products bucket" on storage.objects;
create policy "Auth read products bucket" on storage.objects
  for select to authenticated
  using (bucket_id = 'products');

-- gallery bucket: admin write, authenticated read
drop policy if exists "Admins write gallery bucket" on storage.objects;
create policy "Admins write gallery bucket" on storage.objects
  for all to authenticated
  using (bucket_id = 'gallery' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'gallery' and public.has_role(auth.uid(), 'admin'));

drop policy if exists "Auth read gallery bucket" on storage.objects;
create policy "Auth read gallery bucket" on storage.objects
  for select to authenticated
  using (bucket_id = 'gallery');

-- payments bucket: users upload ONLY into their own {uid}/ folder; admins read all
drop policy if exists "Users upload own payment proof" on storage.objects;
create policy "Users upload own payment proof" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'payments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users read own payment proof" on storage.objects;
create policy "Users read own payment proof" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'payments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users update own payment proof" on storage.objects;
create policy "Users update own payment proof" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'payments'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'payments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users delete own payment proof" on storage.objects;
create policy "Users delete own payment proof" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'payments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Admins read all payment proof" on storage.objects;
create policy "Admins read all payment proof" on storage.objects
  for select to authenticated
  using (bucket_id = 'payments' and public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- DONE. After running:
-- 1) Sign up your admin account in the app.
-- 2) Grant it admin (run once, replacing the email if different):
--    insert into public.user_roles (user_id, role)
--    select id, 'admin' from auth.users
--    where email = 'harshitalalwani678@gmail.com'
--    on conflict do nothing;
-- ============================================================================
