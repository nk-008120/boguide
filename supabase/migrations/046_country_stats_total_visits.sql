alter table public.country_stats_cache
  add column if not exists total_visits integer not null default 0;
