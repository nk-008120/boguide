-- Comments & discussion section — public feedback/discussion threads.
-- Read is open to everyone (including logged-out visitors); creating a
-- thread or posting a comment requires being logged in, same as every
-- other write path on this site (attempt submissions, BiOClash opt-in) —
-- there's no anonymous-write precedent anywhere else here, so this doesn't
-- introduce one. There is deliberately NO update/delete policy for
-- authenticated users on either table: closing a thread (or removing a
-- bad one) is an owner-only action done by hand in the Supabase SQL
-- editor — see SETUP.md — not something exposed in the app itself.
-- Run this once, after 006, in the Supabase SQL editor. Safe to re-run.

create table if not exists public.discussion_threads (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null check (char_length(title) between 3 and 140),
  body       text not null check (char_length(body) between 1 and 5000),
  is_closed  boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.discussion_comments (
  id         uuid primary key default gen_random_uuid(),
  thread_id  uuid not null references public.discussion_threads(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 3000),
  created_at timestamptz not null default now()
);

create index if not exists idx_discussion_threads_created
  on public.discussion_threads (created_at desc);
create index if not exists idx_discussion_comments_thread
  on public.discussion_comments (thread_id, created_at asc);

alter table public.discussion_threads enable row level security;
alter table public.discussion_comments enable row level security;

drop policy if exists discussion_threads_select_all on public.discussion_threads;
create policy discussion_threads_select_all on public.discussion_threads
  for select using (true);

drop policy if exists discussion_threads_insert_own on public.discussion_threads;
create policy discussion_threads_insert_own on public.discussion_threads
  for insert
  with check (auth.uid() = user_id);

drop policy if exists discussion_comments_select_all on public.discussion_comments;
create policy discussion_comments_select_all on public.discussion_comments
  for select using (true);

-- Blocks new comments on a closed thread at the DB level, not just in the
-- UI — a logged-in visitor can never insert a comment row referencing a
-- thread whose is_closed is true, even from devtools.
drop policy if exists discussion_comments_insert_open_thread on public.discussion_comments;
create policy discussion_comments_insert_open_thread on public.discussion_comments
  for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.discussion_threads t
      where t.id = thread_id and t.is_closed = false
    )
  );

grant select on public.discussion_threads to anon, authenticated;
grant insert (title, body) on public.discussion_threads to authenticated;
grant select on public.discussion_comments to anon, authenticated;
grant insert (thread_id, body) on public.discussion_comments to authenticated;

-- ============================================================
-- Feed views — join profiles for display, filtered by the existing
-- moderation flag (profiles.is_hidden, migration 004), same as every
-- other leaderboard/feed view on this site. comment_count is a simple
-- correlated subquery rather than a join+group by, since threads.* needs
-- to pass through untouched.
-- ============================================================
create or replace view public.discussion_threads_feed as
select
  th.id,
  th.title,
  th.body,
  th.is_closed,
  th.created_at,
  p.id as user_id,
  p.display_name,
  p.avatar_url,
  p.country,
  (select count(*) from public.discussion_comments c where c.thread_id = th.id) as comment_count
from public.discussion_threads th
join public.profiles p on p.id = th.user_id
where p.is_hidden = false
order by th.created_at desc;

create or replace view public.discussion_comments_feed as
select
  c.id,
  c.thread_id,
  c.body,
  c.created_at,
  p.id as user_id,
  p.display_name,
  p.avatar_url,
  p.country
from public.discussion_comments c
join public.profiles p on p.id = c.user_id
where p.is_hidden = false
order by c.created_at asc;

grant select on public.discussion_threads_feed to anon, authenticated;
grant select on public.discussion_comments_feed to anon, authenticated;
