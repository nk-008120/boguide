alter table public.profiles
  add column if not exists site_tutorial_seen boolean not null default false;

grant update (site_tutorial_seen) on public.profiles to authenticated;
