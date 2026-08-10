-- BiOClash MB-01 anti-cheating additions (2026-08-11 session). Two
-- independent features, both purely additive (no destructive changes to
-- 009's tables):
--
-- 1. Single-active-session enforcement. bioclash_attempts gains a
--    per-attempt "claim ticket": active_session_token is rewritten to a
--    fresh random value every time api/bioclash-start-attempt.js or
--    api/bioclash-attempt-state.js is called (i.e. on boot/resume — the
--    only two points a fresh page load re-establishes "this tab is now
--    the one working on this attempt"). api/bioclash-heartbeat.js (new)
--    is polled periodically by the frontend and only ever VERIFIES the
--    token it was handed still matches — it never reclaims. If a second
--    tab/device opens the same attempt, its own boot call mints a new
--    token and the first tab's heartbeats start failing with 409, at
--    which point the frontend locks its own UI. The real enforcement
--    isn't the heartbeat (that's just UX signaling) — it's that
--    api/bioclash-save-draft.js and api/bioclash-lock-block.js both now
--    require and check this same token before writing an answer, so a
--    superseded tab literally cannot record an answer even if a request
--    somehow still fires.
--
-- 2. Block-timing analytics. bioclash_attempt_blocks gains created_at
--    (set once, at row insertion — i.e. the moment a block becomes
--    reachable) and updated_at (bumped explicitly by both save-draft and
--    lock-block on every write, no trigger — matches this schema's
--    existing plain-explicit-update style, e.g. locked_at). Combined with
--    the already-existing but previously-unused locked_at, this lets a
--    reviewer compute real dwell time on any non-recoverable block
--    (created_at -> locked_at) after the fact — see
--    context/anti-cheating-measures.md for the actual review query.
--    time_spent_sec (009) is left alone; nothing writes to it and nothing
--    here depends on it.

alter table public.bioclash_attempts
  add column if not exists active_session_token       text,
  add column if not exists active_session_claimed_at   timestamptz;

alter table public.bioclash_attempt_blocks
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();
