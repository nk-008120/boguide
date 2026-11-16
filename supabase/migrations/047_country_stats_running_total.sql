alter table public.country_stats_cache
  add column if not exists last_synced_day date;

alter table public.country_stats_cache
  alter column total_visits type bigint;
