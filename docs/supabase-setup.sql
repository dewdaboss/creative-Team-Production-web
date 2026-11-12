-- =====================================================================
-- Creative Team Production — Supabase setup
-- Run once in Supabase → SQL Editor (or via the Supabase connector).
-- Safe to re-run: every statement is idempotent.
-- =====================================================================

-- 1. Gallery table -----------------------------------------------------
-- One row per photo/video. `row_key` is where it appears on the home page:
--   hero    → fanned posters beside the hero headline (3 slots)
--   wall-a  → poster wall, top row
--   wall-b  → poster wall, bottom row
--   gallery → main portfolio grid (with lightbox)
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'photo' check (type in ('photo', 'reel')),
  title text not null,
  category text not null default 'Uncategorised',
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  src text not null,
  embed_url text,
  views text,
  duration text,
  row_key text not null default 'gallery' check (row_key in ('hero', 'wall-a', 'wall-b', 'gallery')),
  visible boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_items_row_idx on public.gallery_items (row_key, sort_order);

-- 2. Row level security ------------------------------------------------
-- Visitors may read visible rows only; all writes happen server-side with
-- the service-role key (which bypasses RLS) from the owner-only admin panel.
alter table public.gallery_items enable row level security;

drop policy if exists "gallery public read" on public.gallery_items;
create policy "gallery public read" on public.gallery_items
  for select using (visible = true);

grant select on public.gallery_items to anon, authenticated;
grant all on public.gallery_items to service_role;

-- 3. updated_at trigger -------------------------------------------------
create or replace function public.touch_gallery_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists gallery_touch on public.gallery_items;
create trigger gallery_touch
  before update on public.gallery_items
  for each row execute function public.touch_gallery_updated_at();

-- 4. Public media bucket ------------------------------------------------
-- Public read = the site can display the files; uploads/deletes still go
-- through the server with the service-role key.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,
  52428800, -- 50 MB
  array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']
)
on conflict (id) do update
  set public = true,
      file_size_limit = 52428800,
      allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'];

-- 5. Optional starter content ------------------------------------------
-- The live project is already seeded with the original portfolio images.
-- To seed a fresh project, insert only when the table is empty:
--
-- insert into public.gallery_items (type, title, category, media_type, src, row_key, sort_order)
-- select 'photo', 'Sharma × Kapoor Wedding', 'Weddings & Events', 'image',
--        '/images/gallery/wedding.jpg', 'gallery', 1
-- where not exists (select 1 from public.gallery_items);

-- 6. Booking leads ------------------------------------------------------
-- The full enquiry is kept in `payload` (jsonb) so the booking form can grow
-- without a migration; `created_at` is indexed for the admin inbox.
create table if not exists public.leads (
  id text primary key,
  created_at timestamptz not null default now(),
  payload jsonb not null
);
create index if not exists leads_created_idx on public.leads (created_at desc);
alter table public.leads enable row level security;
grant all on public.leads to service_role;

-- 7. Reviews ------------------------------------------------------------
create table if not exists public.reviews (
  id text primary key,
  name text not null,
  rating integer not null check (rating between 1 and 5),
  text text not null,
  service text,
  date timestamptz not null default now(),
  visible boolean not null default true
);
alter table public.reviews enable row level security;
grant all on public.reviews to service_role;

-- 8. Animated site counters (single row) --------------------------------
create table if not exists public.site_stats (
  id integer primary key default 1,
  instagram_followers integer not null default 0,
  followers_today integer not null default 0,
  projects_delivered integer not null default 0,
  happy_clients integer not null default 0,
  reels_produced integer not null default 0,
  updated_at timestamptz not null default now(),
  constraint site_stats_single_row check (id = 1)
);
alter table public.site_stats enable row level security;
grant all on public.site_stats to service_role;

-- 9. Visitor counter (single row) ---------------------------------------
create table if not exists public.visitor_counters (
  id integer primary key default 1,
  total bigint not null default 0,
  today integer not null default 0,
  day text not null default '',
  constraint visitor_counters_single_row check (id = 1)
);
alter table public.visitor_counters enable row level security;
grant all on public.visitor_counters to service_role;

-- Atomic +1 so concurrent visitors never overwrite each other's counts
create or replace function public.increment_visitor(p_day text)
returns public.visitor_counters
language plpgsql
security definer
set search_path = public
as $$
declare r public.visitor_counters;
begin
  insert into public.visitor_counters (id, total, today, day)
  values (1, 1, 1, p_day)
  on conflict (id) do update set
    total = public.visitor_counters.total + 1,
    today = case when public.visitor_counters.day = p_day then public.visitor_counters.today + 1 else 1 end,
    day = p_day
  returning * into r;
  return r;
end;
$$;

revoke all on function public.increment_visitor(text) from public, anon, authenticated;
grant execute on function public.increment_visitor(text) to service_role;
