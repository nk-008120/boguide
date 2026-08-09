-- Fixes a production bug: posting a new thread or comment failed with
-- "new row violates row-level security policy for table discussion_threads".
-- Root cause: discussions.js never sends user_id in the insert payload (it
-- only sends title/body, or thread_id/body) — and the column-level grants
-- in 007_discussions.sql deliberately only permit inserting (title, body)
-- / (thread_id, body), not user_id, so the client couldn't send it even if
-- it tried. With no default, user_id landed NULL, and auth.uid() = NULL is
-- never true, so the discussion_threads_insert_own / discussion_comments_
-- insert_open_thread WITH CHECK policies rejected every insert.
--
-- Fix: default user_id to auth.uid() so it's populated server-side from the
-- caller's JWT before the RLS check runs, with no client-side change and no
-- grant change needed (user_id stays off the client-writable column list,
-- so a user still can never post as someone else).
-- Run this once in the Supabase SQL editor. Safe to re-run.

alter table public.discussion_threads
  alter column user_id set default auth.uid();

alter table public.discussion_comments
  alter column user_id set default auth.uid();
