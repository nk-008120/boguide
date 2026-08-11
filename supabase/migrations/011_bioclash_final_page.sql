-- BiOClash MB-01 — server-side "must reach the final page before manually
-- submitting" gate (2026-08-11 debugging pass). Purely additive.
--
-- bioclash_attempts gains reached_final_page, flipped to true the first
-- time a client's render actually lands on the paper's true last page
-- (bioclash-attempt.js, via a one-off api/bioclash-heartbeat.js call with
-- { reachedFinalPage: true } the instant that page is reached, not just on
-- the next periodic heartbeat). api/bioclash-submit-attempt.js refuses a
-- manual submit (no { force: true } in the body) until this is true — the
-- timer-expiry auto-submit path always sends force:true and is never
-- blocked by this, since a hard time cutoff must always be honored
-- regardless of how far the student got.
--
-- Reminder (every migration in this repo, per
-- context/bioclash-mb01-exam-mechanism.md): the file existing here is not
-- the same fact as the column existing in production — run this in the
-- Supabase SQL editor, then reload the schema cache (Settings -> API ->
-- "Reload schema cache", or NOTIFY pgrst, 'reload schema';) before trusting
-- it's live.

alter table public.bioclash_attempts
  add column if not exists reached_final_page boolean not null default false;
