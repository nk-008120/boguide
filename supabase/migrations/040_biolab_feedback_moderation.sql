alter table public.biolab_protocol_feedback
  add column if not exists is_removed boolean not null default false;

drop policy if exists biolab_protocol_feedback_select_all on public.biolab_protocol_feedback;
create policy biolab_protocol_feedback_select_all on public.biolab_protocol_feedback
  for select using (is_removed = false or user_id = auth.uid());

create table if not exists public.biolab_feedback_reports (
  id            uuid primary key default gen_random_uuid(),
  feedback_id   uuid not null references public.biolab_protocol_feedback(id) on delete cascade,
  reporter_id   uuid not null references auth.users(id) on delete cascade default auth.uid(),
  reason        text not null check (char_length(reason) between 1 and 1000),
  status        text not null default 'open'
                   check (status in ('open', 'actioned', 'dismissed')),
  resolved_by   uuid references auth.users(id) on delete set null,
  resolved_at   timestamptz,
  created_at    timestamptz not null default now(),
  unique (feedback_id, reporter_id)
);

create index if not exists idx_biolab_feedback_reports_feedback
  on public.biolab_feedback_reports (feedback_id);

alter table public.biolab_feedback_reports enable row level security;

drop policy if exists biolab_feedback_reports_select_own on public.biolab_feedback_reports;
create policy biolab_feedback_reports_select_own on public.biolab_feedback_reports
  for select using (auth.uid() = reporter_id);

drop policy if exists biolab_feedback_reports_select_staff on public.biolab_feedback_reports;
create policy biolab_feedback_reports_select_staff on public.biolab_feedback_reports
  for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true));

drop policy if exists biolab_feedback_reports_insert_own on public.biolab_feedback_reports;
create policy biolab_feedback_reports_insert_own on public.biolab_feedback_reports
  for insert
  with check (auth.uid() = reporter_id);

drop policy if exists biolab_feedback_reports_update_staff on public.biolab_feedback_reports;
create policy biolab_feedback_reports_update_staff on public.biolab_feedback_reports
  for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true));

grant select on public.biolab_feedback_reports to authenticated;
grant insert (feedback_id, reason) on public.biolab_feedback_reports to authenticated;
grant update (status, resolved_by, resolved_at) on public.biolab_feedback_reports to authenticated;

create or replace view public.biolab_protocol_feedback_feed as
select
  f.id,
  f.protocol_id,
  f.comment,
  f.created_at,
  p.id as user_id,
  p.display_name,
  p.avatar_url,
  p.country
from public.biolab_protocol_feedback f
join public.profiles p on p.id = f.user_id
where p.is_hidden = false and f.is_removed = false
order by f.created_at asc;

alter view public.biolab_protocol_feedback_feed set (security_invoker = true);
