
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
where p.is_hidden = false
order by f.created_at asc;

grant select on public.biolab_protocol_feedback_feed to anon, authenticated;
