create table if not exists public.subject_review_state (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade default auth.uid(),
  subject_link      text not null check (char_length(subject_link) between 1 and 300),
  subject_name      text not null check (char_length(subject_name) between 1 and 200),
  ease_factor       numeric not null default 2.5 check (ease_factor >= 1.3),
  interval_days     integer not null default 1 check (interval_days >= 1),
  repetitions       integer not null default 0 check (repetitions >= 0),
  due_at            timestamptz not null default now(),
  last_reviewed_at  timestamptz,
  last_attempt_at   timestamptz,
  created_at        timestamptz not null default now(),
  unique (user_id, subject_link)
);

create index if not exists idx_subject_review_state_user on public.subject_review_state (user_id);
create index if not exists idx_subject_review_state_due on public.subject_review_state (user_id, due_at);

alter table public.subject_review_state enable row level security;

drop policy if exists subject_review_state_select_own on public.subject_review_state;
create policy subject_review_state_select_own on public.subject_review_state
  for select using (auth.uid() = user_id);

drop policy if exists subject_review_state_insert_own on public.subject_review_state;
create policy subject_review_state_insert_own on public.subject_review_state
  for insert
  with check (auth.uid() = user_id);

drop policy if exists subject_review_state_update_own on public.subject_review_state;
create policy subject_review_state_update_own on public.subject_review_state
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert on public.subject_review_state to authenticated;
grant update (ease_factor, interval_days, repetitions, due_at, last_reviewed_at, last_attempt_at) on public.subject_review_state to authenticated;
