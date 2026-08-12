create table if not exists public.bioclash_results (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  season      text not null,
  placement   int not null check (placement > 0),
  score_label text,
  awarded_at  timestamptz not null default now()
);

create unique index if not exists idx_bioclash_results_season_placement
  on public.bioclash_results (season, placement);
create index if not exists idx_bioclash_results_user
  on public.bioclash_results (user_id);

alter table public.bioclash_results enable row level security;

drop policy if exists bioclash_results_select_all on public.bioclash_results;
create policy bioclash_results_select_all on public.bioclash_results
  for select using (true);

grant select on public.bioclash_results to anon, authenticated;

create or replace view public.bioclash_leaderboard as
select
  r.season,
  r.placement,
  r.score_label,
  r.awarded_at,
  p.id as user_id,
  p.display_name,
  p.avatar_url,
  p.country
from public.bioclash_results r
join public.profiles p on p.id = r.user_id
where p.is_hidden = false
order by r.awarded_at desc, r.placement asc;

grant select on public.bioclash_leaderboard to anon, authenticated;
