alter table public.profiles
  add column if not exists notify_bioclash boolean not null default false;

grant update (notify_bioclash) on public.profiles to authenticated;
