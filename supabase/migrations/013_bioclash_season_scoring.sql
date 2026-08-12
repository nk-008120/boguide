-- BiOClash season system, phase 2 (2026-08-11 planning session). Reworks
-- bioclash_results (migration 006) from a single-round, placement-only
-- table into one that can also drive a cross-round, cumulative season
-- standing — full design rationale in
-- context/bioclash-season-points-plan.md. Still hand-entered
-- after offline grading (no automated scoring pipeline exists or
-- is planned — see scripts/bioclash-score-round.js, a hand-run helper,
-- not a live endpoint), same posture as every row in this table today.
--
-- Column notes:
--   season_year   — the ANNUAL cycle, e.g. '2026-27'. Distinct from the
--                    existing `season` column, which in practice already
--                    means "round label" (e.g. 'MB-01') — kept as-is
--                    rather than renamed, to avoid a breaking change to
--                    any row that may already exist.
--   round_id      — the paper id this result is for (e.g. 'mb-01'),
--                    machine-readable counterpart to the free-text
--                    `season` column.
--   raw_score     — final graded marks for this round (auto-gradable +
--                    manually graded free-text combined).
--   z_score       — (raw_score - round mean) / round stdev, computed
--                    across every participant who completed that round.
--   time_normalized_z — z_score adjusted for the live extension mechanic
--                    (cost per block used, small bonus for using none —
--                    see the season-points doc's formula). THIS is what
--                    bioclash_season_standings sums, weighted per round.
--   season_weight — that round's fixed weight toward the season total
--                    (e.g. 0.20, 1.00 for the Full Syllabus Test), stored
--                    per-row (not looked up from a table) so a future
--                    season's weights can change without rewriting
--                    history.
--
-- Run this once, after 012, in the Supabase SQL editor. Safe to re-run.

alter table public.bioclash_results
  add column if not exists season_year text,
  add column if not exists round_id text,
  add column if not exists raw_score numeric,
  add column if not exists z_score numeric,
  add column if not exists time_normalized_z numeric,
  add column if not exists season_weight numeric;

-- ============================================================
-- bioclash_season_standings — cumulative season leaderboard. Sums
-- time_normalized_z * season_weight per user within a season_year, same
-- profiles join / is_hidden filter as bioclash_leaderboard (migration
-- 006). Rows with no season_year (e.g. legacy single-round-only entries
-- predating this migration) are excluded rather than silently grouped
-- under a null bucket.
-- ============================================================
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
