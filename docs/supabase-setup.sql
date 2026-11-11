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
