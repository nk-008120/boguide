alter table public.profiles
  add column if not exists target_olympiad text;

alter table public.profiles drop constraint if exists profiles_target_olympiad_check;
alter table public.profiles
  add constraint profiles_target_olympiad_check
  check (target_olympiad is null or target_olympiad in ('ibo', 'usabo', 'inbo'));

grant update (target_olympiad) on public.profiles to authenticated;
