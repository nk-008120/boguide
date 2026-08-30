
create table if not exists public.biolab_submission_images (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.biolab_submissions(id) on delete cascade,
  image_path    text not null check (char_length(image_path) between 1 and 512),
  position      int not null default 0 check (position >= 0),
  created_at    timestamptz not null default now()
);

create index if not exists idx_biolab_submission_images_submission
  on public.biolab_submission_images (submission_id, position);

insert into public.biolab_submission_images (submission_id, image_path, position, created_at)
select id, image_path, 0, captured_at
from public.biolab_submissions
where image_path is not null;

alter table public.biolab_submission_images enable row level security;

drop policy if exists biolab_submission_images_select_via_submission on public.biolab_submission_images;
create policy biolab_submission_images_select_via_submission on public.biolab_submission_images
  for select using (
    exists (
      select 1 from public.biolab_submissions s
      where s.id = submission_id
        and (s.user_id = auth.uid() or (s.is_published = true and s.is_removed = false))
    )
  );

drop policy if exists biolab_submission_images_insert_own on public.biolab_submission_images;
create policy biolab_submission_images_insert_own on public.biolab_submission_images
  for insert
  with check (
    exists (
      select 1 from public.biolab_submissions s
      where s.id = submission_id and s.user_id = auth.uid()
    )
  );

grant select on public.biolab_submission_images to anon, authenticated;
grant insert (submission_id, image_path, position) on public.biolab_submission_images to authenticated;

revoke insert (image_path) on public.biolab_submissions from authenticated;

drop view if exists public.biolab_public_submissions;
create view public.biolab_public_submissions as
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
  p.country,
  coalesce(imgs.images, '[]'::jsonb) as images
from public.biolab_submissions sub
join public.biolab_practicals pr on pr.id = sub.practical_id
join public.profiles p on p.id = sub.user_id
left join lateral (
  select jsonb_agg(
           jsonb_build_object('image_path', si.image_path, 'position', si.position)
           order by si.position
         ) as images
  from public.biolab_submission_images si
  where si.submission_id = sub.id
) imgs on true
where sub.is_published = true and sub.is_removed = false and p.is_hidden = false
order by sub.captured_at desc;

grant select on public.biolab_public_submissions to anon, authenticated;

drop policy if exists biolab_captures_select_published on storage.objects;
create policy biolab_captures_select_published on storage.objects
  for select
  using (
    bucket_id = 'biolab-captures'
    and exists (
      select 1
      from public.biolab_submission_images si
      join public.biolab_submissions s on s.id = si.submission_id
      where si.image_path = storage.objects.name
        and s.is_published = true
        and s.is_removed = false
    )
  );

alter table public.biolab_submissions drop column if exists image_path;

create table if not exists public.biolab_protocol_attachments (
  id          uuid primary key default gen_random_uuid(),
  protocol_id uuid not null references public.biolab_practicals(id) on delete cascade,
  file_path   text not null check (char_length(file_path) between 1 and 512),
  file_name   text not null check (char_length(file_name) between 1 and 255 and file_name ~* '\.pdf$'),
  uploaded_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at  timestamptz not null default now()
);

create index if not exists idx_biolab_protocol_attachments_protocol
  on public.biolab_protocol_attachments (protocol_id, created_at asc);

alter table public.biolab_protocol_attachments enable row level security;

drop policy if exists biolab_protocol_attachments_select_public on public.biolab_protocol_attachments;
create policy biolab_protocol_attachments_select_public on public.biolab_protocol_attachments
  for select using (
    exists (
      select 1 from public.biolab_practicals pr
      where pr.id = protocol_id
        and (pr.is_removed = false or pr.created_by = auth.uid())
    )
  );

drop policy if exists biolab_protocol_attachments_insert_own on public.biolab_protocol_attachments;
create policy biolab_protocol_attachments_insert_own on public.biolab_protocol_attachments
  for insert
  with check (
    exists (
      select 1 from public.biolab_practicals pr
      where pr.id = protocol_id and pr.created_by = auth.uid()
    )
  );

grant select on public.biolab_protocol_attachments to anon, authenticated;

grant insert (protocol_id, file_path, file_name) on public.biolab_protocol_attachments to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('biolab-protocol-attachments', 'biolab-protocol-attachments', false, 10485760, array['application/pdf'])
on conflict (id) do nothing;

drop policy if exists biolab_protocol_attachments_storage_select_public on storage.objects;
create policy biolab_protocol_attachments_storage_select_public on storage.objects
  for select
  using (
    bucket_id = 'biolab-protocol-attachments'
    and exists (
      select 1
      from public.biolab_protocol_attachments pa
      join public.biolab_practicals pr on pr.id = pa.protocol_id
      where pa.file_path = storage.objects.name
        and pr.is_removed = false
    )
  );

drop policy if exists biolab_protocol_attachments_storage_insert_own on storage.objects;
create policy biolab_protocol_attachments_storage_insert_own on storage.objects
  for insert
  with check (
    bucket_id = 'biolab-protocol-attachments'
    and exists (
      select 1 from public.biolab_practicals pr
      where pr.id::text = (storage.foldername(name))[1]
        and pr.created_by = auth.uid()
    )
  );
