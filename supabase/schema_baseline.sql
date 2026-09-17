create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Anonymous',
  avatar_url   text,
  created_at   timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists public.attempt_reports (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  report_type      text not null default 'papers_timed_attempt',
  olympiad         text not null,
  year             text not null,
  round_id         text not null,
  round_name       text not null,
  total_correct    int not null,
  total_statements int not null,
  score_pct        numeric generated always as (
                      case when total_statements > 0
                           then round(total_correct::numeric / total_statements * 100, 1)
                           else 0 end
                    ) stored,
  duration_sec     int not null default 0,
  avg_time_sec     numeric,
  fullscreen_exits int not null default 0,
  subject_stats    jsonb not null default '{}'::jsonb,
  per_question     jsonb not null default '[]'::jsonb,
  submitted_at     timestamptz not null default now()
);

create index if not exists idx_reports_round_leaderboard
  on public.attempt_reports (olympiad, year, round_id, score_pct desc, duration_sec asc);
create index if not exists idx_reports_user_history
  on public.attempt_reports (user_id, submitted_at desc);

alter table public.profiles enable row level security;
alter table public.attempt_reports enable row level security;

drop policy if exists profiles_select_all on public.profiles;
create policy profiles_select_all on public.profiles
  for select using (true);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id);

drop policy if exists reports_select_own on public.attempt_reports;
create policy reports_select_own on public.attempt_reports
  for select using (auth.uid() = user_id);

grant select on public.profiles to anon, authenticated;
grant update (display_name, avatar_url) on public.profiles to authenticated;
grant select on public.attempt_reports to authenticated;

create or replace view public.best_attempt_per_round as
select distinct on (user_id, olympiad, year, round_id)
  user_id, olympiad, year, round_id, round_name,
  total_correct, total_statements, score_pct, duration_sec, submitted_at
from public.attempt_reports
order by user_id, olympiad, year, round_id, score_pct desc, duration_sec asc, submitted_at asc;

create or replace view public.leaderboard_per_round as
select
  b.*,
  p.display_name,
  rank() over (
    partition by b.olympiad, b.year, b.round_id
    order by b.score_pct desc, b.duration_sec asc
  ) as rank
from public.best_attempt_per_round b
join public.profiles p on p.id = b.user_id;

create or replace view public.leaderboard_overall as
select
  b.user_id,
  p.display_name,
  count(*) as rounds_completed,
  sum(b.total_correct) as total_correct,
  sum(b.total_statements) as total_statements,
  round(sum(b.total_correct)::numeric / nullif(sum(b.total_statements), 0) * 100, 1) as overall_pct,
  sum(b.duration_sec) as total_time_sec,
  rank() over (
    order by round(sum(b.total_correct)::numeric / nullif(sum(b.total_statements), 0) * 100, 1) desc,
             sum(b.total_statements) desc,
             sum(b.duration_sec) asc
  ) as rank
from public.best_attempt_per_round b
join public.profiles p on p.id = b.user_id
group by b.user_id, p.display_name;

grant select on public.best_attempt_per_round to anon, authenticated;
grant select on public.leaderboard_per_round to anon, authenticated;
grant select on public.leaderboard_overall to anon, authenticated;
