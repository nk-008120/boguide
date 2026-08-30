
create table if not exists public.biolab_practicals (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title       text not null,
  description text,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);
create table if not exists public.biolab_submissions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade default auth.uid(),
  practical_id      uuid not null references public.biolab_practicals(id) on delete restrict,
  image_path        text not null check (char_length(image_path) between 1 and 512),
  result_value      numeric,
  result_unit       text,
  calibration_inputs jsonb not null default '{}'::jsonb,
  is_published      boolean not null default false,
  is_verified       boolean not null default false,
  verified_by       uuid references auth.users(id) on delete set null,
  verified_at       timestamptz,
  captured_at       timestamptz not null default now(),
  check (is_verified = false or verified_by is not null)
);

create index if not exists idx_biolab_submissions_user
  on public.biolab_submissions (user_id, captured_at desc);
create index if not exists idx_biolab_submissions_practical
  on public.biolab_submissions (practical_id);
create index if not exists idx_biolab_submissions_published
  on public.biolab_submissions (practical_id, captured_at desc)
  where is_published = true;
create table if not exists public.biolab_reference_results (
  id                 uuid primary key default gen_random_uuid(),
  practical_id       uuid not null references public.biolab_practicals(id) on delete restrict,
  image_path         text,
  result_value       numeric not null,
  result_unit        text,
  calibration_inputs jsonb not null default '{}'::jsonb,
  notes              text,
  created_by         uuid references auth.users(id) on delete set null,
  created_at         timestamptz not null default now()
);

create index if not exists idx_biolab_reference_results_practical
  on public.biolab_reference_results (practical_id);
create table if not exists public.biolab_submission_reports (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.biolab_submissions(id) on delete cascade,
  reporter_id   uuid not null references auth.users(id) on delete cascade default auth.uid(),
  reason        text not null check (char_length(reason) between 1 and 1000),
  status        text not null default 'open'
                   check (status in ('open', 'actioned', 'dismissed')),
  resolved_by   uuid references auth.users(id) on delete set null,
  resolved_at   timestamptz,
  created_at    timestamptz not null default now(),
  unique (submission_id, reporter_id)
);

create index if not exists idx_biolab_submission_reports_submission
  on public.biolab_submission_reports (submission_id);

alter table public.biolab_practicals enable row level security;
alter table public.biolab_submissions enable row level security;
alter table public.biolab_reference_results enable row level security;
alter table public.biolab_submission_reports enable row level security;

drop policy if exists biolab_practicals_select_all on public.biolab_practicals;
create policy biolab_practicals_select_all on public.biolab_practicals
  for select using (true);

grant select on public.biolab_practicals to anon, authenticated;

drop policy if exists biolab_submissions_select_own_or_published on public.biolab_submissions;
create policy biolab_submissions_select_own_or_published on public.biolab_submissions
  for select using (auth.uid() = user_id or is_published = true);

drop policy if exists biolab_submissions_insert_own on public.biolab_submissions;
create policy biolab_submissions_insert_own on public.biolab_submissions
  for insert
  with check (auth.uid() = user_id);

drop policy if exists biolab_submissions_update_own on public.biolab_submissions;
create policy biolab_submissions_update_own on public.biolab_submissions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select on public.biolab_submissions to anon, authenticated;
grant insert (practical_id, image_path, result_value, result_unit, calibration_inputs)
  on public.biolab_submissions to authenticated;
grant update (is_published) on public.biolab_submissions to authenticated;

drop policy if exists biolab_reference_results_select_all on public.biolab_reference_results;
create policy biolab_reference_results_select_all on public.biolab_reference_results
  for select using (true);

grant select on public.biolab_reference_results to anon, authenticated;

drop policy if exists biolab_submission_reports_select_own on public.biolab_submission_reports;
create policy biolab_submission_reports_select_own on public.biolab_submission_reports
  for select using (auth.uid() = reporter_id);

drop policy if exists biolab_submission_reports_insert_own on public.biolab_submission_reports;
create policy biolab_submission_reports_insert_own on public.biolab_submission_reports
  for insert
  with check (
    auth.uid() = reporter_id
    and exists (
      select 1 from public.biolab_submissions s
      where s.id = submission_id and s.is_published = true
    )
  );

grant select on public.biolab_submission_reports to authenticated;
grant insert (submission_id, reason) on public.biolab_submission_reports to authenticated;

create or replace view public.biolab_public_submissions as
select
  sub.id,
  sub.practical_id,
  pr.slug as practical_slug,
  pr.title as practical_title,
  sub.result_value,
  sub.result_unit,
  sub.is_verified,
  sub.captured_at,
  p.id as user_id,
  p.display_name,
  p.avatar_url,
  p.country
from public.biolab_submissions sub
join public.biolab_practicals pr on pr.id = sub.practical_id
join public.profiles p on p.id = sub.user_id
where sub.is_published = true and p.is_hidden = false
order by sub.captured_at desc;

grant select on public.biolab_public_submissions to anon, authenticated;


insert into storage.buckets (id, name, public)
values ('biolab-captures', 'biolab-captures', false)
on conflict (id) do nothing;

drop policy if exists biolab_captures_select_own on storage.objects;
create policy biolab_captures_select_own on storage.objects
  for select
  using (bucket_id = 'biolab-captures' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists biolab_captures_insert_own on storage.objects;
create policy biolab_captures_insert_own on storage.objects
  for insert
  with check (bucket_id = 'biolab-captures' and auth.uid()::text = (storage.foldername(name))[1]);


insert into public.biolab_practicals (slug, title, description, created_by)
select
  'aspirin-trinder',
  'Aspirin Pharmacokinetics (Trinder Method)',
  'Tracks salicylate concentration in a sample over time via the intensity of the purple iron-salicylate complex formed by the Trinder (iron-salicylate) colorimetric method, read from a phone photo instead of a lab colorimeter. Modeled on the IBO 2026 Animal Physiology practical exam.',
  id
from auth.users where email = 'nishitkalani@gmail.com'
on conflict (slug) do nothing;

insert into public.biolab_reference_results
  (practical_id, result_value, result_unit, calibration_inputs, notes, created_by)
select
  pr.id,
  3.25,
  'mmol/L',
  jsonb_build_object(
    'delta_r', -42,
    'delta_g', -18,
    'delta_b', 6,
    'reference_white_rgb', jsonb_build_array(246, 244, 240),
    'capture_conditions', 'Indirect daylight, white card background, phone camera flash off'
  ),
  'BiOGuide-controlled capture of the IBO 2026 Animal Physiology reference standard, used as the single v1 comparison point for student captures. Placeholder calibration values pending staff re-verification against the physical reference set before Session 2 builds against it.',
  u.id
from public.biolab_practicals pr
cross join (select id from auth.users where email = 'nishitkalani@gmail.com') u
where pr.slug = 'aspirin-trinder'
  and not exists (
    select 1 from public.biolab_reference_results r where r.practical_id = pr.id
  );
