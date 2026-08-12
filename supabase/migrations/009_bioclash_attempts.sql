-- BiOClash MB-01 delivery mechanism: attempt state + a debug-phase access
-- allowlist. Question CONTENT lives in data/bioclash/<paper-id>.yaml (built
-- with the static site, same split as data/papers/*.yaml) — nothing about
-- question text or correct answers lives in this schema. This migration
-- only adds the tables needed to track a live attempt's progress.
--
-- House style followed throughout (confirmed by direct audit of every
-- existing migration before writing this one): RLS is used here only for
-- read-scoping (a user sees their own rows, never anyone else's) and never
-- for write-count/immutability enforcement — no insert/update/delete grant
-- is given to anon/authenticated on any table below. Every write goes
-- through a service-role Vercel function (api/bioclash-*.js), which is
-- where "is this already locked / already submitted / already attempted"
-- gets decided, in application code, on the server's own clock. This
-- matches attempt_reports, account_deletions, and bioclash_results exactly.

-- ============================================================
-- bioclash_paper_access — debug/invitational allowlist.
-- Empty by default: nobody has access to a paper unless a row exists here.
-- Manually populated via the SQL editor (same lever as the
-- is_hidden moderation flag and bioclash_results placements) — this also
-- doubles as the future mechanism for "invitational" seasons, not just
-- today's single-tester debug phase.
-- ============================================================
create table if not exists public.bioclash_paper_access (
  id         uuid primary key default gen_random_uuid(),
  paper_id   text not null,
  user_id    uuid not null references auth.users(id) on delete cascade,
  added_at   timestamptz not null default now(),
  unique (paper_id, user_id)
);

alter table public.bioclash_paper_access enable row level security;

drop policy if exists bioclash_access_select_own on public.bioclash_paper_access;
create policy bioclash_access_select_own on public.bioclash_paper_access
  for select using (auth.uid() = user_id);

grant select on public.bioclash_paper_access to authenticated;

-- Seed access for the debug-phase test account. Requires the account
-- to already exist (real signup) — if the select finds no matching user,
-- this simply inserts nothing; re-run after signing up. Safe to re-run
-- regardless (on conflict do nothing).
insert into public.bioclash_paper_access (paper_id, user_id)
select 'mb-01', id from auth.users where email = 'nishitkalani@gmail.com'
on conflict (paper_id, user_id) do nothing;

-- ============================================================
-- bioclash_attempts — one row per (user, paper). The master attempt
-- record. The unique constraint below is a defense-in-depth backstop, not
-- the primary enforcement mechanism — api/bioclash-start-attempt.js is
-- what actually decides "have they already attempted this," in code, on
-- the server's own clock, before ever reaching this table.
-- ============================================================
create table if not exists public.bioclash_attempts (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  paper_id            text not null,
  started_at          timestamptz not null default now(),
  end_at              timestamptz not null,
  submitted_at        timestamptz,
  status              text not null default 'in_progress'
                         check (status in ('in_progress', 'submitted', 'expired')),
  fullscreen_exits    int not null default 0,
  visibility_losses   int not null default 0,
  auto_score_correct  int,
  auto_score_total    int,
  unique (user_id, paper_id)
);

create index if not exists idx_bioclash_attempts_user on public.bioclash_attempts (user_id);

alter table public.bioclash_attempts enable row level security;

drop policy if exists bioclash_attempts_select_own on public.bioclash_attempts;
create policy bioclash_attempts_select_own on public.bioclash_attempts
  for select using (auth.uid() = user_id);

grant select on public.bioclash_attempts to authenticated;

-- ============================================================
-- bioclash_attempt_blocks — one row per (attempt, block). Granular lock
-- state + the stored raw answer for that block. A row only exists once an
-- attempt has actually reached that block (created by start-attempt for
-- the paper's first part, and by lock-block when a lock reveals the next
-- one) — "not yet reached" means no row exists, not merely a hidden one.
-- ============================================================
create table if not exists public.bioclash_attempt_blocks (
  id              uuid primary key default gen_random_uuid(),
  attempt_id      uuid not null references public.bioclash_attempts(id) on delete cascade,
  block_id        text not null,
  status          text not null default 'active'
                     check (status in ('active', 'locked')),
  answer          jsonb not null default '{}'::jsonb,
  time_spent_sec  int not null default 0,
  locked_at       timestamptz,
  unique (attempt_id, block_id)
);

create index if not exists idx_bioclash_blocks_attempt on public.bioclash_attempt_blocks (attempt_id);

alter table public.bioclash_attempt_blocks enable row level security;

drop policy if exists bioclash_blocks_select_own on public.bioclash_attempt_blocks;
create policy bioclash_blocks_select_own on public.bioclash_attempt_blocks
  for select using (
    exists (
      select 1 from public.bioclash_attempts a
      where a.id = attempt_id and a.user_id = auth.uid()
    )
  );

grant select on public.bioclash_attempt_blocks to authenticated;
