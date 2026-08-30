
alter table public.biolab_practicals
  add column if not exists body text,
  add column if not exists source_attribution text,
  add column if not exists category text,
  add column if not exists acknowledged_disclaimer boolean not null default false;

update public.biolab_practicals
set created_by = null,
    source_attribution = 'IBO 2026 Animal Physiology practical exam',
    category = 'physiology'
where slug = 'aspirin-trinder' and created_by is not null;

alter table public.biolab_practicals drop constraint if exists biolab_practicals_category_check;
alter table public.biolab_practicals
  add constraint biolab_practicals_category_check
  check (category is null or category in (
    'physiology', 'biochemistry', 'molecular-biology', 'microbiology',
    'ecology', 'genetics', 'anatomy', 'other'
  ));

alter table public.biolab_practicals drop constraint if exists biolab_practicals_disclaimer_check;
alter table public.biolab_practicals
  add constraint biolab_practicals_disclaimer_check
  check (created_by is null or acknowledged_disclaimer);

alter table public.biolab_practicals alter column created_by set default auth.uid();

drop policy if exists biolab_practicals_insert_own on public.biolab_practicals;
create policy biolab_practicals_insert_own on public.biolab_practicals
  for insert
  with check (created_by = auth.uid());

drop policy if exists biolab_practicals_update_own on public.biolab_practicals;
create policy biolab_practicals_update_own on public.biolab_practicals
  for update using (created_by = auth.uid()) with check (created_by = auth.uid());

grant insert (slug, title, description, body, source_attribution, category, acknowledged_disclaimer)
  on public.biolab_practicals to authenticated;
grant update (title, description, body, source_attribution, category)
  on public.biolab_practicals to authenticated;

create table if not exists public.biolab_protocol_feedback (
  id          uuid primary key default gen_random_uuid(),
  protocol_id uuid not null references public.biolab_practicals(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade default auth.uid(),
  comment     text not null check (char_length(comment) between 1 and 2000),
  created_at  timestamptz not null default now()
);

create index if not exists idx_biolab_protocol_feedback_protocol
  on public.biolab_protocol_feedback (protocol_id, created_at asc);

alter table public.biolab_protocol_feedback enable row level security;

drop policy if exists biolab_protocol_feedback_select_all on public.biolab_protocol_feedback;
create policy biolab_protocol_feedback_select_all on public.biolab_protocol_feedback
  for select using (true);

drop policy if exists biolab_protocol_feedback_insert_own on public.biolab_protocol_feedback;
create policy biolab_protocol_feedback_insert_own on public.biolab_protocol_feedback
  for insert
  with check (auth.uid() = user_id);

grant select on public.biolab_protocol_feedback to anon, authenticated;
grant insert (protocol_id, comment) on public.biolab_protocol_feedback to authenticated;

create table if not exists public.biolab_protocol_reports (
  id            uuid primary key default gen_random_uuid(),
  protocol_id   uuid not null references public.biolab_practicals(id) on delete cascade,
  reporter_id   uuid not null references auth.users(id) on delete cascade default auth.uid(),
  reason        text not null check (char_length(reason) between 1 and 1000),
  status        text not null default 'open'
                   check (status in ('open', 'actioned', 'dismissed')),
  resolved_by   uuid references auth.users(id) on delete set null,
  resolved_at   timestamptz,
  created_at    timestamptz not null default now(),
  unique (protocol_id, reporter_id)
);

create index if not exists idx_biolab_protocol_reports_protocol
  on public.biolab_protocol_reports (protocol_id);

alter table public.biolab_protocol_reports enable row level security;

drop policy if exists biolab_protocol_reports_select_own on public.biolab_protocol_reports;
create policy biolab_protocol_reports_select_own on public.biolab_protocol_reports
  for select using (auth.uid() = reporter_id);

drop policy if exists biolab_protocol_reports_insert_own on public.biolab_protocol_reports;
create policy biolab_protocol_reports_insert_own on public.biolab_protocol_reports
  for insert
  with check (auth.uid() = reporter_id);

grant select on public.biolab_protocol_reports to authenticated;
grant insert (protocol_id, reason) on public.biolab_protocol_reports to authenticated;

create or replace view public.biolab_public_protocols as
select
  pr.id,
  pr.slug,
  pr.title,
  pr.description,
  pr.body,
  pr.source_attribution,
  pr.category,
  (pr.created_by is null) as is_official,
  pr.created_by as author_user_id,
  p.display_name as author_display_name,
  p.avatar_url as author_avatar_url,
  p.country as author_country,
  pr.created_at
from public.biolab_practicals pr
left join public.profiles p on p.id = pr.created_by
where pr.created_by is null or p.is_hidden = false
order by pr.created_at desc;

grant select on public.biolab_public_protocols to anon, authenticated;
