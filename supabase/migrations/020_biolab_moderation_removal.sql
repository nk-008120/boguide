
alter table public.biolab_practicals
  add column if not exists is_removed boolean not null default false;

alter table public.biolab_submissions
  add column if not exists is_removed boolean not null default false;

drop policy if exists biolab_practicals_select_all on public.biolab_practicals;
create policy biolab_practicals_select_all on public.biolab_practicals
  for select using (is_removed = false or created_by = auth.uid());

drop policy if exists biolab_submissions_select_own_or_published on public.biolab_submissions;
create policy biolab_submissions_select_own_or_published on public.biolab_submissions
  for select using (auth.uid() = user_id or (is_published = true and is_removed = false));

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
where pr.is_removed = false
  and (pr.created_by is null or p.is_hidden = false)
order by pr.created_at desc;

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
  p.country,
  sub.image_path
from public.biolab_submissions sub
join public.biolab_practicals pr on pr.id = sub.practical_id
join public.profiles p on p.id = sub.user_id
where sub.is_published = true and sub.is_removed = false and p.is_hidden = false
order by sub.captured_at desc;

drop policy if exists biolab_captures_select_published on storage.objects;
create policy biolab_captures_select_published on storage.objects
  for select
  using (
    bucket_id = 'biolab-captures'
    and exists (
      select 1 from public.biolab_submissions s
      where s.image_path = storage.objects.name
        and s.is_published = true
        and s.is_removed = false
    )
  );
