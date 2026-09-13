create table if not exists public.country_stats_cache (
  id               text primary key default 'latest',
  total_countries  integer not null default 0,
  countries        jsonb not null default '[]'::jsonb,
  last_updated     timestamptz not null default now()
);

alter table public.country_stats_cache enable row level security;

drop policy if exists country_stats_cache_select_public on public.country_stats_cache;
create policy country_stats_cache_select_public on public.country_stats_cache
  for select using (true);

grant select on public.country_stats_cache to anon, authenticated;
