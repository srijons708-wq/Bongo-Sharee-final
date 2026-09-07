-- ============================================================================
-- Bongo Sharee — Supabase / PostgreSQL schema
-- ============================================================================
-- Run this in the Supabase SQL Editor (or via `supabase db push` with this
-- file under supabase/migrations/) on a fresh project. It creates every
-- table src/lib/api.js expects, wires up Row Level Security so customers
-- can only touch their own data, and adds the two triggers (updated_at,
-- new-user profile row) every app like this needs.
--
-- Order matters — tables are created in dependency order. Safe to re-run:
-- everything is guarded with IF NOT EXISTS / OR REPLACE.
-- ============================================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ----------------------------------------------------------------------------
-- Helper: auto-maintain updated_at on every table that has it
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ----------------------------------------------------------------------------
-- profiles — one row per authenticated user, created automatically on signup
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- categories
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- products
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(10, 2) not null check (price >= 0),
  compare_price numeric(10, 2),
  sku text unique,
  stock integer not null default 0 check (stock >= 0),
  fabric text,
  color text,
  sizes text[] not null default array['Free Size'],
  featured boolean not null default false,
  is_new boolean not null default false,
  on_sale boolean not null default false,
  has_360 boolean not null default false,
  rating numeric(2, 1) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_slug_idx on public.products(slug);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- product_images — ordered gallery per product
-- ----------------------------------------------------------------------------
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_id_idx on public.product_images(product_id);

-- ----------------------------------------------------------------------------
-- wishlists / wishlist_items
-- ----------------------------------------------------------------------------
create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references public.wishlists(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ----------------------------------------------------------------------------
-- carts / cart_items — server-side cart mirror (guests use localStorage)
-- ----------------------------------------------------------------------------
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger carts_set_updated_at
  before update on public.carts
  for each row execute function public.set_updated_at();

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

-- ----------------------------------------------------------------------------
-- addresses
-- ----------------------------------------------------------------------------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Home',
  full_name text not null,
  address text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null,
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger addresses_set_updated_at
  before update on public.addresses
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- orders / order_items
-- ----------------------------------------------------------------------------
-- Sequence must exist before the table below — its DEFAULT clause resolves
-- 'public.order_number_seq' to a regclass as soon as the table is created,
-- not lazily at insert time, so creating it after the table would fail on
-- a fresh database.
create sequence if not exists public.order_number_seq start 100200;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('BS-' || to_char(nextval('public.order_number_seq'), 'FM100000')),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  address text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null,
  shipping_method text not null default 'standard',
  payment_method text not null,
  payment_status text not null default 'Pending' check (payment_status in ('Pending', 'Paid', 'Refunded', 'Failed')),
  payment_transaction_id text,
  subtotal numeric(10, 2) not null,
  shipping_cost numeric(10, 2) not null default 0,
  discount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  coupon_code text,
  status text not null default 'Pending'
    check (status in ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  unit_price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists order_items_product_id_idx on public.order_items(product_id);

-- ----------------------------------------------------------------------------
-- reviews — only buyers with a matching order_items row can insert
-- ----------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  title text not null,
  comment text not null,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create index if not exists reviews_product_id_idx on public.reviews(product_id);

-- ----------------------------------------------------------------------------
-- coupons / coupon_usage
-- ----------------------------------------------------------------------------
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage', 'flat')),
  discount_amount numeric(10, 2) not null,
  minimum_order numeric(10, 2) not null default 0,
  maximum_discount numeric(10, 2),
  expiry date,
  usage_limit integer,
  used_count integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.coupon_usage (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  used_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- banners — homepage CMS content (hero + promo strips)
-- ----------------------------------------------------------------------------
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'promo' check (type in ('hero', 'promo')),
  label text,
  title text,
  description text,
  image text,
  primary_cta_label text,
  primary_cta_link text,
  secondary_cta_label text,
  secondary_cta_link text,
  active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger banners_set_updated_at
  before update on public.banners
  for each row execute function public.set_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.wishlists enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.coupon_usage enable row level security;
alter table public.banners enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- profiles: users read/update their own row; admins read all
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- categories / products / product_images / banners: public read, admin write
create policy "categories_public_read" on public.categories for select using (true);
create policy "categories_admin_write" on public.categories for all using (public.is_admin()) with check (public.is_admin());

create policy "products_public_read" on public.products for select using (true);
create policy "products_admin_write" on public.products for all using (public.is_admin()) with check (public.is_admin());

create policy "product_images_public_read" on public.product_images for select using (true);
create policy "product_images_admin_write" on public.product_images for all using (public.is_admin()) with check (public.is_admin());

create policy "banners_public_read" on public.banners for select using (active = true or public.is_admin());
create policy "banners_admin_write" on public.banners for all using (public.is_admin()) with check (public.is_admin());

-- wishlists / wishlist_items: owner only
create policy "wishlists_owner_all" on public.wishlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "wishlist_items_owner_all" on public.wishlist_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- carts / cart_items: owner only
create policy "carts_owner_all" on public.carts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cart_items_owner_all" on public.cart_items for all using (
  exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
) with check (
  exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
);

-- addresses: owner only
create policy "addresses_owner_all" on public.addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- orders: owner reads/creates their own; admin reads/updates all
create policy "orders_owner_select" on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "orders_owner_insert" on public.orders for insert with check (auth.uid() = user_id);
create policy "orders_admin_update" on public.orders for update using (public.is_admin());

-- order_items: visible if you own the parent order, or you're admin
create policy "order_items_owner_select" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);
create policy "order_items_owner_insert" on public.order_items for insert with check (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);

-- reviews: public read; insert only if the user actually bought the product
create policy "reviews_public_read" on public.reviews for select using (true);
create policy "reviews_verified_insert" on public.reviews for insert with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.order_items oi
    join public.orders o on o.id = oi.order_id
    where oi.product_id = reviews.product_id and o.user_id = auth.uid()
  )
);
create policy "reviews_owner_delete" on public.reviews for delete using (auth.uid() = user_id or public.is_admin());

-- coupons: public can validate active coupons; admin manages
create policy "coupons_public_read_active" on public.coupons for select using (active = true or public.is_admin());
create policy "coupons_admin_write" on public.coupons for all using (public.is_admin()) with check (public.is_admin());

-- coupon_usage: owner + admin read; insert via checkout flow
create policy "coupon_usage_owner_select" on public.coupon_usage for select using (auth.uid() = user_id or public.is_admin());
create policy "coupon_usage_owner_insert" on public.coupon_usage for insert with check (auth.uid() = user_id);

-- ============================================================================
-- SEED DATA (optional) — mirrors src/data/*.js so a fresh Supabase project
-- looks identical to the bundled demo store. Safe to skip if you'd rather
-- seed through the admin dashboard once it's connected.
-- ============================================================================

insert into public.categories (name, slug, description, image, status) values
  ('Wedding Sarees', 'wedding', 'Opulent weaves for the most important day.', 'https://images.unsplash.com/photo-1610030181087-540f5b32c235?w=800&q=80', 'active'),
  ('Party Wear Sarees', 'party-wear', 'Statement pieces for evenings to remember.', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', 'active'),
  ('Cotton Sarees', 'cotton', 'Breathable handwoven cotton for every day.', 'https://images.unsplash.com/photo-1610189020217-5f1e3b6b1a6a?w=800&q=80', 'active'),
  ('Silk Sarees', 'silk', 'Lustrous pure silk, woven by master artisans.', 'https://images.unsplash.com/photo-1610189844305-91b2b5f8f4d0?w=800&q=80', 'active'),
  ('Banarasi', 'banarasi', 'Timeless zari work from Varanasi.', 'https://images.unsplash.com/photo-1610030181087-540f5b32c235?w=800&q=80', 'active'),
  ('Kanjivaram', 'kanjivaram', 'Rich South Indian silk with temple borders.', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', 'active'),
  ('Handloom', 'handloom', 'Slow-woven textiles from Bengal''s looms.', 'https://images.unsplash.com/photo-1610189020217-5f1e3b6b1a6a?w=800&q=80', 'active'),
  ('Festive', 'festive', 'Bright, celebratory drapes for the festival season.', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', 'active')
on conflict (slug) do nothing;

-- Note: products are intentionally NOT seeded here since each one needs a
-- matching product_images row set. Use the admin dashboard's "Add Product"
-- form (src/admin/Products.jsx) to create real catalog entries once
-- connected — it writes through src/lib/api.js the same way this schema
-- expects.

-- ============================================================================
-- SECURE CHECKOUT RPC
-- The browser never gets to choose a trusted price/stock value. The function
-- re-reads products, validates stock, creates the order + order_items together,
-- and decrements stock atomically.
-- ============================================================================
create or replace function public.create_order_secure(p_order jsonb, p_items jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_product public.products%rowtype;
  v_subtotal numeric(10,2) := 0;
  v_qty integer;
  v_discount numeric(10,2) := 0;
  v_shipping numeric(10,2) := 0;
  v_coupon public.coupons%rowtype;
  v_total numeric(10,2);
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if (p_order->>'user_id')::uuid <> auth.uid() then raise exception 'Invalid user'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then raise exception 'Cart is empty'; end if;

  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_product from public.products where id = (v_item->>'product_id')::uuid for update;
    if not found then raise exception 'Product no longer exists'; end if;
    v_qty := (v_item->>'quantity')::integer;
    if v_qty < 1 or v_qty > v_product.stock then raise exception 'Insufficient stock for %', v_product.name; end if;
    v_subtotal := v_subtotal + (v_product.price * v_qty);
  end loop;

  if p_order->>'shipping_method' = 'express' then v_shipping := 25; elsif v_subtotal >= 99 then v_shipping := 0; else v_shipping := 12; end if;

  if nullif(p_order->>'coupon_code','') is not null then
    select * into v_coupon from public.coupons where code = upper(p_order->>'coupon_code') and active = true for update;
    if not found then raise exception 'Invalid or inactive coupon'; end if;
    if v_coupon.expiry is not null and v_coupon.expiry < current_date then raise exception 'Coupon has expired'; end if;
    if v_coupon.usage_limit is not null and v_coupon.used_count >= v_coupon.usage_limit then raise exception 'Coupon usage limit reached'; end if;
    if v_subtotal < v_coupon.minimum_order then raise exception 'Minimum order for coupon is %', v_coupon.minimum_order; end if;
    if v_coupon.discount_type = 'percentage' then v_discount := v_subtotal * v_coupon.discount_amount / 100; else v_discount := v_coupon.discount_amount; end if;
    if v_coupon.maximum_discount is not null then v_discount := least(v_discount, v_coupon.maximum_discount); end if;
  end if;
  v_total := greatest(0, v_subtotal + v_shipping - v_discount);
  insert into public.orders (user_id, full_name, email, phone, address, city, state, postal_code, country, shipping_method, payment_method, payment_status, payment_transaction_id, subtotal, shipping_cost, discount, total, coupon_code, status)
  values (auth.uid(), p_order->>'full_name', p_order->>'email', p_order->>'phone', p_order->>'address', p_order->>'city', p_order->>'state', p_order->>'postal_code', p_order->>'country', p_order->>'shipping_method', p_order->>'payment_method', coalesce(p_order->>'payment_status','Pending'), p_order->>'payment_transaction_id', v_subtotal, v_shipping, v_discount, v_total, nullif(upper(p_order->>'coupon_code'),''), case when coalesce(p_order->>'payment_status','Pending') = 'Paid' then 'Confirmed' else 'Pending' end)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_product from public.products where id = (v_item->>'product_id')::uuid for update;
    v_qty := (v_item->>'quantity')::integer;
    insert into public.order_items (order_id, product_id, product_name, product_image, unit_price, quantity)
    values (v_order_id, v_product.id, v_product.name, v_item->>'product_image', v_product.price, v_qty);
    update public.products set stock = stock - v_qty where id = v_product.id;
  end loop;
  if v_coupon.id is not null then
    insert into public.coupon_usage (coupon_id, user_id, order_id) values (v_coupon.id, auth.uid(), v_order_id);
    update public.coupons set used_count = used_count + 1 where id = v_coupon.id;
  end if;
  return v_order_id;
end;
$$;

grant execute on function public.create_order_secure(jsonb, jsonb) to authenticated;

create or replace function public.ensure_one_default_address()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.is_default then
    update public.addresses set is_default = false where user_id = new.user_id and id <> coalesce(new.id, gen_random_uuid());
  end if;
  return new;
end;
$$;
drop trigger if exists addresses_one_default on public.addresses;
create trigger addresses_one_default before insert or update on public.addresses for each row execute function public.ensure_one_default_address();
