-- Adds the opt-in flag behind BiOClash's "get notified" mechanism (the
-- landing page at /bioclash/, not the competition itself). Login is the
-- preferred notify path: visiting /bioclash/ while logged in auto-sets this
-- to true (static/js/papers-bioclash.js), no separate signup form needed.
-- Run this once, after 004, in the Supabase SQL editor. Safe to re-run.

alter table public.profiles
  add column if not exists notify_bioclash boolean not null default false;

-- Column-level grants are additive in Postgres (same note as migration 002) —
-- this adds to the existing (display_name, avatar_url, country, about,
-- education_level) grant, doesn't replace it. No RLS policy change needed:
-- profiles_update_own/profiles_select_all (schema.sql) already cover any
-- column on a user's own row.
grant update (notify_bioclash) on public.profiles to authenticated;
