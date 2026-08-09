-- BiOClash competition results — one row per placement, per season.
-- Deliberately a NEW, separate table rather than reusing attempt_reports
-- via its report_type discriminator: attempt_reports' shape (total_correct/
-- total_statements/subject_stats/per_question) presumes the BiOrchive
-- Timed Attempt quiz format. BiOClash has no question bank or scoring
-- engine yet (see context/bioclash-planner.md — the landing page is
-- deliberately not the competition system itself), so this only captures
-- the one thing a "winners" leaderboard actually needs: who placed, in
-- which season, once a season has actually concluded.
--
-- No automated scoring exists for BiOClash, so — same as the is_hidden
-- moderation flag (migration 004) — rows here are entered by hand by the
-- project owner via the Supabase Table Editor or SQL editor after a season
-- wraps. See SETUP.md for the exact insert pattern. Run this once, after
-- 005, in the Supabase SQL editor. Safe to re-run.

create table if not exists public.bioclash_results (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  season      text not null,               -- e.g. 'Season 1 — Fall 2026'
  placement   int not null check (placement > 0),
  score_label text,                        -- optional free text, e.g. '87/100'
  awarded_at  timestamptz not null default now()
);

create unique index if not exists idx_bioclash_results_season_placement
  on public.bioclash_results (season, placement);
create index if not exists idx_bioclash_results_user
  on public.bioclash_results (user_id);

alter table public.bioclash_results enable row level security;

-- Public read, same as every other leaderboard-backing table/view. No
-- insert/update/delete policy for anon/authenticated — see comment above.
drop policy if exists bioclash_results_select_all on public.bioclash_results;
create policy bioclash_results_select_all on public.bioclash_results
  for select using (true);

grant select on public.bioclash_results to anon, authenticated;

-- ============================================================
-- bioclash_leaderboard — joins to profiles for display, filtered by the
-- existing moderation flag (profiles.is_hidden, migration 004) same as
-- leaderboard_overall/leaderboard_per_round. Ordered newest season first,
-- placement ascending within a season — the JS client takes the top row's
-- `season` value as "the current season" and renders just that group as a
-- podium, so a future season's results naturally take over once entered,
-- with no code change needed.
-- ============================================================
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
