alter table public.bioclash_results
  add column if not exists season_year text,
  add column if not exists round_id text,
  add column if not exists raw_score numeric,
  add column if not exists z_score numeric,
  add column if not exists time_normalized_z numeric,
  add column if not exists season_weight numeric;

create or replace view public.bioclash_season_standings as
select
  r.season_year,
  p.id as user_id,
  p.display_name,
  p.avatar_url,
  p.country,
  sum(r.time_normalized_z * r.season_weight) as season_index
from public.bioclash_results r
join public.profiles p on p.id = r.user_id
where p.is_hidden = false and r.season_year is not null
group by r.season_year, p.id, p.display_name, p.avatar_url, p.country
order by season_index desc;

grant select on public.bioclash_season_standings to anon, authenticated;
