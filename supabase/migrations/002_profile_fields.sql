-- Adds Part 2's extended profile fields (country / about / education level)
-- on top of the schema.sql that's already been run in production. Run this
-- once, after schema.sql, in the Supabase SQL editor. Safe to re-run.
--
-- Written as a separate migration rather than editing schema.sql directly
-- per LOGIN_ROADMAP.md's guidance — schema.sql has already been run against
-- production, so it stays a historical snapshot and new changes land here.

alter table public.profiles
  add column if not exists country text,
  add column if not exists about text,
  add column if not exists education_level text;

-- Constraints can't use "add ... if not exists", so drop-then-add for
-- idempotency (matches the drop-policy-then-create pattern in schema.sql).
alter table public.profiles drop constraint if exists profiles_education_level_check;
alter table public.profiles
  add constraint profiles_education_level_check
  check (education_level is null or education_level in (
    'grade-8', 'grade-9', 'grade-10', 'grade-11', 'grade-12',
    'undergraduate', 'graduate', 'other'
  ));

-- country is stored as an ISO 3166-1 alpha-2 code (e.g. "IN", "US") so the
-- leaderboard can derive a flag emoji client-side with no image assets.
alter table public.profiles drop constraint if exists profiles_country_check;
alter table public.profiles
  add constraint profiles_country_check
  check (country is null or country ~ '^[A-Z]{2}$');

-- about: not security-sensitive, just a defensive backstop against abuse
-- (the real "max 50 words" limit is enforced client-side).
alter table public.profiles drop constraint if exists profiles_about_check;
alter table public.profiles
  add constraint profiles_about_check
  check (about is null or char_length(about) <= 400);

-- Light validation on avatar_url (existing column, Part 1) — nothing
-- previously stopped a client from writing an arbitrary URL here, even
-- though it only ever gets used as an <img src>. Restrict to the curated
-- static/avatars/ set.
alter table public.profiles drop constraint if exists profiles_avatar_url_check;
alter table public.profiles
  add constraint profiles_avatar_url_check
  check (avatar_url is null or avatar_url ~ '^/avatars/[A-Za-z0-9_-]+\.(png|jpg|jpeg|webp|svg)$');

-- Column-level grants are additive in Postgres — this adds to the existing
-- (display_name, avatar_url) grant from schema.sql, doesn't replace it.
grant update (country, about, education_level) on public.profiles to authenticated;

-- ============================================================
-- Leaderboard views — add country so the leaderboard can render a flag.
-- create or replace view preserves the existing grants on these views, but
-- Postgres only allows CREATE OR REPLACE VIEW to *append* new columns at
-- the end of the select list — inserting one in the middle shifts every
-- column after it, which Postgres reads as renaming that column (hence
-- "cannot change name of view column ... to ..."). country goes last here
-- for exactly that reason, even though it'd read more naturally next to
-- display_name.
-- ============================================================
create or replace view public.leaderboard_per_round as
select
  b.*,
  p.display_name,
  rank() over (
    partition by b.olympiad, b.year, b.round_id
    order by b.score_pct desc, b.duration_sec asc
  ) as rank,
  p.country
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
  p.country
from public.best_attempt_per_round b
join public.profiles p on p.id = b.user_id
group by b.user_id, p.display_name, p.country;
