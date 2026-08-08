-- Adds a minimal moderation lever (profiles.is_hidden, filtered out of the
-- leaderboard views) and the backing log table for the self-serve account
-- deletion flow (api/delete-account.js). Run this once, after 003, in the
-- Supabase SQL editor. Safe to re-run.

-- ============================================================
-- Moderation: profiles.is_hidden. Deliberately NOT in the
-- `grant update (...)` list below — a user can never hide/unhide their own
-- row, only the project owner via the Supabase Table Editor (or the SQL
-- editor: `update public.profiles set is_hidden = true where id = '<uuid>';`),
-- both of which run as the table owner and bypass RLS entirely.
-- ============================================================
alter table public.profiles
  add column if not exists is_hidden boolean not null default false;

-- Same append-only column-order rule as migrations 002/003 (CREATE OR
-- REPLACE VIEW can't reorder/insert columns, only append) — this change
-- only adds a WHERE filter, no new columns, so it's not affected.
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
join public.profiles p on p.id = b.user_id
where p.is_hidden = false;

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
where p.is_hidden = false
group by b.user_id, p.display_name, p.country, p.avatar_url;

-- ============================================================
-- account_deletions — durable record that a deletion happened, written by
-- api/delete-account.js (service_role) just before it calls
-- auth.admin.deleteUser(). Deliberately NOT foreign-keyed to auth.users
-- (a cascade would delete this row along with everything else it exists
-- to outlive) and stores nothing but the id + timestamp per the "log the
-- deletion, not more" requirement. No RLS policies are defined, so with
-- RLS enabled only the service_role key (which bypasses RLS) can read or
-- write it — not anon, not authenticated, not even the deleted user
-- themselves.
-- ============================================================
create table if not exists public.account_deletions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null,
  deleted_at timestamptz not null default now()
);
alter table public.account_deletions enable row level security;
