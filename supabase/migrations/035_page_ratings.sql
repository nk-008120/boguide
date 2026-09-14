create table if not exists public.page_ratings (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  page_path  text not null,
  rating     numeric(3,1) not null check (rating >= 0.5 and rating <= 10 and mod(rating * 2, 1) = 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, page_path)
);

create index if not exists idx_page_ratings_page_path on public.page_ratings (page_path);

alter table public.page_ratings enable row level security;

drop policy if exists page_ratings_select_own on public.page_ratings;
create policy page_ratings_select_own on public.page_ratings
  for select using (auth.uid() = user_id);

drop policy if exists page_ratings_insert_own on public.page_ratings;
create policy page_ratings_insert_own on public.page_ratings
  for insert
  with check (auth.uid() = user_id);

drop policy if exists page_ratings_update_own on public.page_ratings;
create policy page_ratings_update_own on public.page_ratings
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select on public.page_ratings to authenticated;
grant insert (user_id, page_path, rating, updated_at) on public.page_ratings to authenticated;
grant update (rating, updated_at) on public.page_ratings to authenticated;

create or replace view public.page_ratings_agg as
select
  page_path,
  round(avg(rating)::numeric, 1) as avg_rating,
  count(*) as rating_count
from public.page_ratings
group by page_path;

grant select on public.page_ratings_agg to anon, authenticated;
