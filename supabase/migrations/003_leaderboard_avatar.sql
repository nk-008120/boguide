create or replace view public.leaderboard_per_round as
select
  b.*,
  p.display_name,
  rank() over (
    partition by b.olympiad, b.year, b.round_id
    order by b.score_pct desc, b.duration_sec asc
  ) as rank,
  p.country,
  p.avatar_url
from public.best_attempt_per_round b
join public.profiles p on p.id = b.user_id;

create or replace view public.leaderboard_overall as
select
  b.user_id,
  p.display_name,
  count(*) as rounds_completed,
  sum(b.total_correct) as total_correct,
  sum(b.total_statements) as total_statements,
  round(sum(b.total_correct)::numeric / nullif(sum(b.total_statements), 0) * 100, 1) as overall_pct,
  sum(b.duration_sec) as total_time_sec,
  rank() over (
    order by round(sum(b.total_correct)::numeric / nullif(sum(b.total_statements), 0) * 100, 1) desc,
             sum(b.total_statements) desc,
             sum(b.duration_sec) asc
  ) as rank,
  p.country,
  p.avatar_url
from public.best_attempt_per_round b
join public.profiles p on p.id = b.user_id
group by b.user_id, p.display_name, p.country, p.avatar_url;
