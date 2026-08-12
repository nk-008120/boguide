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

insert into public.bioclash_paper_access (paper_id, user_id)
select 'mb-01', id from auth.users where email = 'nishitkalani@gmail.com'
on conflict (paper_id, user_id) do nothing;

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
