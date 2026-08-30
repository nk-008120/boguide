
drop policy if exists biolab_captures_select_published on storage.objects;
create policy biolab_captures_select_published on storage.objects
  for select
  using (
    bucket_id = 'biolab-captures'
    and exists (
      select 1 from public.biolab_submissions s
      where s.image_path = storage.objects.name
        and s.is_published = true
    )
  );

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
where sub.is_published = true and p.is_hidden = false
order by sub.captured_at desc;
