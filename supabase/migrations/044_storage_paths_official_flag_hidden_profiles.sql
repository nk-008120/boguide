drop policy if exists biolab_submission_images_insert_own on public.biolab_submission_images;
create policy biolab_submission_images_insert_own on public.biolab_submission_images
  for insert
  with check (
    split_part(image_path, '/', 1) = auth.uid()::text
    and exists (
      select 1 from public.biolab_submissions s
      where s.id = submission_id and s.user_id = auth.uid()
    )
  );

drop policy if exists biolab_protocol_attachments_insert_own on public.biolab_protocol_attachments;
create policy biolab_protocol_attachments_insert_own on public.biolab_protocol_attachments
  for insert
  with check (
    split_part(file_path, '/', 1) = protocol_id::text
    and exists (
      select 1 from public.biolab_practicals pr
      where pr.id = protocol_id and pr.created_by = auth.uid()
    )
  );

alter table public.biolab_practicals
  add column if not exists is_official boolean not null default false;

update public.biolab_practicals
set is_official = true
where created_by is null;

create or replace view public.biolab_public_protocols as
select
  pr.id,
  pr.slug,
  pr.title,
  pr.description,
  pr.body,
  pr.source_attribution,
  pr.category,
  pr.is_official,
  pr.created_by as author_user_id,
  p.display_name as author_display_name,
  p.avatar_url as author_avatar_url,
  p.country as author_country,
  pr.created_at
from public.biolab_practicals pr
left join public.profiles p on p.id = pr.created_by
where pr.is_removed = false
  and (pr.created_by is null or p.is_hidden = false)
order by pr.created_at desc;

alter view public.biolab_public_protocols set (security_invoker = true);

drop policy if exists profiles_select_all on public.profiles;
create policy profiles_select_all on public.profiles
  for select using (is_hidden = false or id = auth.uid());
