-- BiOClash season system, phase 2 (2026-08-11 planning session). Two
-- independent soft-tracking additions to bioclash_attempts, both purely
-- additive:
--
-- 1. extension_blocks_used — how many live +30-minute extension blocks a
--    student has requested this attempt (api/bioclash-request-extension.js).
--    Capped per-round by the paper YAML's maxExtensionBlocks (not enforced
--    at the DB level — the endpoint checks it against the round's config
--    before incrementing). Used post-round, once raw scores are graded, to
--    compute each student's time-normalized Z-score — see
--    context/bioclash-season-points-plan.md and scripts/bioclash-score-round.js.
--    Never affects raw score or auto-grading; purely an input to the
--    later, separate standardization pass.
--
-- 2. tab_close_events — soft anti-cheat signal, same posture as the
--    existing fullscreen_exits/visibility_losses (migration 009): a
--    beforeunload listener in bioclash-attempt.js fires
--    navigator.sendBeacon to api/bioclash-log-tab-close.js, which
--    increments this. Never auto-penalizing, surfaced only for
--    post-hoc review — there is no technical way to prevent a tab from
--    closing, so this is detection/logging, not enforcement (see the
--    honor-code rule added alongside this in content/bioclash/mb-01/
--    attempt/index.md).
--
-- Run this once, after 011, in the Supabase SQL editor. Safe to re-run.

alter table public.bioclash_attempts
  add column if not exists extension_blocks_used int not null default 0,
  add column if not exists tab_close_events int not null default 0;
