
alter table public.attempt_reports
  add column if not exists show_on_leaderboard boolean not null default true,
  add column if not exists show_on_dashboard boolean not null default true;

create or replace view public.best_attempt_per_round as
select distinct on (user_id, olympiad, year, round_id)
  user_id, olympiad, year, round_id, round_name,
  total_correct, total_statements, score_pct, duration_sec, submitted_at
from public.attempt_reports
where show_on_leaderboard
order by user_id, olympiad, year, round_id, score_pct desc, duration_sec asc, submitted_at asc;
