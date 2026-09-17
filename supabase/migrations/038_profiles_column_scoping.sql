revoke select on public.profiles from anon, authenticated;
grant select (id, display_name, avatar_url, country, is_staff, is_hidden)
  on public.profiles to anon, authenticated;

create or replace function public.get_my_profile()
returns table (
  display_name text,
  avatar_url text,
  country text,
  about text,
  education_level text,
  notify_bioclash boolean,
  target_olympiad text,
  site_tutorial_seen boolean,
  is_staff boolean
)
language sql
security definer
set search_path = public
stable
as $$
  select
    display_name, avatar_url, country, about, education_level,
    notify_bioclash, target_olympiad, site_tutorial_seen, is_staff
  from public.profiles
  where id = auth.uid();
$$;

revoke all on function public.get_my_profile() from public;
grant execute on function public.get_my_profile() to authenticated;
