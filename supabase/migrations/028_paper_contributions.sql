create table if not exists public.paper_contributions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade default auth.uid(),
  olympiad         text not null check (char_length(olympiad) between 1 and 100),
  year             text not null check (char_length(year) between 1 and 20),
  round_label      text not null check (char_length(round_label) between 1 and 200),
  source_url       text check (source_url is null or char_length(source_url) <= 2000),
  license_note     text not null check (char_length(license_note) between 1 and 2000),
  exam_file_path   text check (exam_file_path is null or char_length(exam_file_path) <= 512),
  answer_file_path text check (answer_file_path is null or char_length(answer_file_path) <= 512),
  status           text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  staff_notes      text,
  reviewed_by      uuid references auth.users(id) on delete set null,
  reviewed_at      timestamptz,
  created_at       timestamptz not null default now(),
  check (status = 'pending' or reviewed_by is not null)
);

create table if not exists public.content_corrections (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade default auth.uid(),
  olympiad        text not null check (char_length(olympiad) between 1 and 100),
  year            text not null check (char_length(year) between 1 and 20),
  round_id        text not null check (char_length(round_id) between 1 and 100),
  problem_id      text not null check (char_length(problem_id) between 1 and 50),
  field           text not null check (char_length(field) between 1 and 100),
  current_value   text,
  proposed_value  text not null check (char_length(proposed_value) between 1 and 5000),
  reason          text not null check (char_length(reason) between 1 and 1000),
  status          text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  staff_notes     text,
  reviewed_by     uuid references auth.users(id) on delete set null,
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now(),
  check (status = 'pending' or reviewed_by is not null)
);

create table if not exists public.community_solutions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade default auth.uid(),
  olympiad    text not null check (char_length(olympiad) between 1 and 100),
  year        text not null check (char_length(year) between 1 and 20),
  round_id    text not null check (char_length(round_id) between 1 and 100),
  problem_id  text not null check (char_length(problem_id) between 1 and 50),
  body        text not null check (char_length(body) between 1 and 5000),
  status      text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  staff_notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at  timestamptz not null default now(),
  check (status = 'pending' or reviewed_by is not null)
);

create index if not exists idx_paper_contributions_user on public.paper_contributions (user_id, created_at desc);
create index if not exists idx_paper_contributions_status on public.paper_contributions (status, created_at) where status = 'pending';
create index if not exists idx_content_corrections_user on public.content_corrections (user_id, created_at desc);
create index if not exists idx_content_corrections_status on public.content_corrections (status, created_at) where status = 'pending';
create index if not exists idx_community_solutions_user on public.community_solutions (user_id, created_at desc);
create index if not exists idx_community_solutions_status on public.community_solutions (status, created_at) where status = 'pending';

alter table public.paper_contributions enable row level security;
alter table public.content_corrections enable row level security;
alter table public.community_solutions enable row level security;

drop policy if exists paper_contributions_select_own_or_staff on public.paper_contributions;
create policy paper_contributions_select_own_or_staff on public.paper_contributions
  for select using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true)
  );

drop policy if exists content_corrections_select_own_or_staff on public.content_corrections;
create policy content_corrections_select_own_or_staff on public.content_corrections
  for select using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true)
  );

drop policy if exists community_solutions_select_own_or_staff on public.community_solutions;
create policy community_solutions_select_own_or_staff on public.community_solutions
  for select using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true)
  );

drop policy if exists paper_contributions_insert_own on public.paper_contributions;
create policy paper_contributions_insert_own on public.paper_contributions
  for insert
  with check (
    auth.uid() = user_id
    and (select count(*) from public.paper_contributions where user_id = auth.uid() and status = 'pending') < 5
  );

drop policy if exists content_corrections_insert_own on public.content_corrections;
create policy content_corrections_insert_own on public.content_corrections
  for insert
  with check (
    auth.uid() = user_id
    and (select count(*) from public.content_corrections where user_id = auth.uid() and status = 'pending') < 5
  );

drop policy if exists community_solutions_insert_own on public.community_solutions;
create policy community_solutions_insert_own on public.community_solutions
  for insert
  with check (
    auth.uid() = user_id
    and (select count(*) from public.community_solutions where user_id = auth.uid() and status = 'pending') < 5
  );

drop policy if exists paper_contributions_update_staff on public.paper_contributions;
create policy paper_contributions_update_staff on public.paper_contributions
  for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true));

drop policy if exists content_corrections_update_staff on public.content_corrections;
create policy content_corrections_update_staff on public.content_corrections
  for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true));

drop policy if exists community_solutions_update_staff on public.community_solutions;
create policy community_solutions_update_staff on public.community_solutions
  for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true));

grant select, insert on public.paper_contributions to authenticated;
grant update (status, staff_notes, reviewed_by, reviewed_at) on public.paper_contributions to authenticated;
grant select, insert on public.content_corrections to authenticated;
grant update (status, staff_notes, reviewed_by, reviewed_at) on public.content_corrections to authenticated;
grant select, insert on public.community_solutions to authenticated;
grant update (status, staff_notes, reviewed_by, reviewed_at) on public.community_solutions to authenticated;

insert into storage.buckets (id, name, public)
values ('paper-contributions', 'paper-contributions', false)
on conflict (id) do nothing;

drop policy if exists paper_contributions_files_select_own on storage.objects;
create policy paper_contributions_files_select_own on storage.objects
  for select
  using (bucket_id = 'paper-contributions' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists paper_contributions_files_select_staff on storage.objects;
create policy paper_contributions_files_select_staff on storage.objects
  for select
  using (
    bucket_id = 'paper-contributions'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true)
  );

drop policy if exists paper_contributions_files_insert_own on storage.objects;
create policy paper_contributions_files_insert_own on storage.objects
  for insert
  with check (bucket_id = 'paper-contributions' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists paper_contributions_files_delete_staff on storage.objects;
create policy paper_contributions_files_delete_staff on storage.objects
  for delete
  using (
    bucket_id = 'paper-contributions'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true)
  );
