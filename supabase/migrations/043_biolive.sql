create table if not exists public.live_sessions (
  id           uuid primary key default gen_random_uuid(),
  starts_at    timestamptz not null,
  duration_min integer not null check (duration_min between 15 and 480),
  topic        text not null check (char_length(topic) between 3 and 200),
  paper_url    text check (paper_url is null or (char_length(paper_url) <= 500 and paper_url ~ '^(/|https://)')),
  host_name    text not null check (char_length(host_name) between 1 and 80),
  note         text check (note is null or char_length(note) <= 1000),
  status       text not null default 'scheduled' check (status in ('scheduled', 'cancelled')),
  created_by   uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists live_sessions_starts_at_idx on public.live_sessions (starts_at);

alter table public.live_sessions enable row level security;
revoke all on public.live_sessions from anon, authenticated;
grant select on public.live_sessions to anon, authenticated;

drop policy if exists live_sessions_read on public.live_sessions;
create policy live_sessions_read on public.live_sessions
  for select to anon, authenticated using (true);

create table if not exists public.live_registrations (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references public.live_sessions(id) on delete cascade,
  user_id         uuid not null default auth.uid() references auth.users(id) on delete cascade,
  real_name       text not null check (char_length(btrim(real_name)) between 2 and 80),
  question        text check (question is null or char_length(question) <= 1000),
  target_olympiad text check (target_olympiad is null or target_olympiad in ('ibo', 'usabo', 'inbo', 'other')),
  attended        boolean,
  created_at      timestamptz not null default now(),
  unique (session_id, user_id)
);

create index if not exists live_registrations_user_idx on public.live_registrations (user_id);

alter table public.live_registrations enable row level security;
revoke all on public.live_registrations from anon, authenticated;
grant select, delete on public.live_registrations to authenticated;
grant insert (session_id, real_name, question, target_olympiad)
  on public.live_registrations to authenticated;

drop policy if exists live_registrations_read_own on public.live_registrations;
create policy live_registrations_read_own on public.live_registrations
  for select to authenticated using (user_id = auth.uid());

drop policy if exists live_registrations_insert_own on public.live_registrations;
create policy live_registrations_insert_own on public.live_registrations
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.live_sessions s
      where s.id = session_id
        and s.status = 'scheduled'
        and s.starts_at - interval '24 hours' > now()
    )
  );

drop policy if exists live_registrations_delete_own on public.live_registrations;
create policy live_registrations_delete_own on public.live_registrations
  for delete to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1 from public.live_sessions s
      where s.id = session_id and s.starts_at > now()
    )
  );

create table if not exists public.live_staff_keys (
  id         uuid primary key default gen_random_uuid(),
  key_hash   text not null unique,
  label      text,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

alter table public.live_staff_keys enable row level security;
revoke all on public.live_staff_keys from anon, authenticated;

create or replace function public.live_session_counts()
returns table (session_id uuid, registered bigint)
language sql
security definer
set search_path = public
stable
as $$
  select r.session_id, count(*) from public.live_registrations r group by r.session_id;
$$;

revoke all on function public.live_session_counts() from public;
grant execute on function public.live_session_counts() to anon, authenticated;

create or replace function public.live_staff_gate(p_key text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_fail_key text;
  v_fails integer;
begin
  if v_uid is null then
    return 'not_authenticated';
  end if;
  if not exists (select 1 from public.profiles p where p.id = v_uid and p.is_staff = true) then
    return 'not_staff';
  end if;

  v_fail_key := 'live_staff_key:' || v_uid::text;
  select rl.count into v_fails
  from public.rate_limits rl
  where rl.key = v_fail_key and now() - rl.window_start <= interval '15 minutes';
  if coalesce(v_fails, 0) >= 10 then
    return 'locked';
  end if;

  if p_key is null or not exists (
    select 1 from public.live_staff_keys k
    where k.revoked_at is null
      and k.key_hash = encode(sha256(convert_to(p_key, 'UTF8')), 'hex')
  ) then
    perform public.rate_limit_hit(v_fail_key, 900000);
    return 'bad_key';
  end if;

  return null;
end;
$$;

revoke all on function public.live_staff_gate(text) from public, anon, authenticated;

create or replace function public.live_staff_overview(p_key text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_err text := public.live_staff_gate(p_key);
  v_sessions jsonb;
begin
  if v_err is not null then
    return jsonb_build_object('ok', false, 'error', v_err);
  end if;

  select coalesce(jsonb_agg(t.row_data order by t.starts_at), '[]'::jsonb)
  into v_sessions
  from (
    select s.starts_at, jsonb_build_object(
      'id', s.id,
      'starts_at', s.starts_at,
      'duration_min', s.duration_min,
      'topic', s.topic,
      'paper_url', s.paper_url,
      'host_name', s.host_name,
      'note', s.note,
      'status', s.status,
      'registrations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', r.id,
          'real_name', r.real_name,
          'email', u.email,
          'display_name', p.display_name,
          'target_olympiad', r.target_olympiad,
          'question', r.question,
          'attended', r.attended,
          'created_at', r.created_at
        ) order by r.created_at)
        from public.live_registrations r
        join auth.users u on u.id = r.user_id
        left join public.profiles p on p.id = r.user_id
        where r.session_id = s.id
      ), '[]'::jsonb)
    ) as row_data
    from public.live_sessions s
  ) t;

  return jsonb_build_object('ok', true, 'sessions', v_sessions);
end;
$$;

create or replace function public.live_staff_save_session(
  p_key text,
  p_id uuid,
  p_starts_at timestamptz,
  p_duration_min integer,
  p_topic text,
  p_paper_url text,
  p_host_name text,
  p_note text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_err text := public.live_staff_gate(p_key);
  v_id uuid;
begin
  if v_err is not null then
    return jsonb_build_object('ok', false, 'error', v_err);
  end if;

  if p_id is null then
    insert into public.live_sessions
      (starts_at, duration_min, topic, paper_url, host_name, note, created_by)
    values
      (p_starts_at, p_duration_min, btrim(p_topic), nullif(btrim(p_paper_url), ''),
       btrim(p_host_name), nullif(btrim(p_note), ''), auth.uid())
    returning id into v_id;
  else
    update public.live_sessions set
      starts_at = p_starts_at,
      duration_min = p_duration_min,
      topic = btrim(p_topic),
      paper_url = nullif(btrim(p_paper_url), ''),
      host_name = btrim(p_host_name),
      note = nullif(btrim(p_note), ''),
      updated_at = now()
    where id = p_id
    returning id into v_id;
    if v_id is null then
      return jsonb_build_object('ok', false, 'error', 'not_found');
    end if;
  end if;

  return jsonb_build_object('ok', true, 'id', v_id);
end;
$$;

create or replace function public.live_staff_set_status(p_key text, p_id uuid, p_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_err text := public.live_staff_gate(p_key);
  v_id uuid;
begin
  if v_err is not null then
    return jsonb_build_object('ok', false, 'error', v_err);
  end if;

  update public.live_sessions set status = p_status, updated_at = now()
  where id = p_id
  returning id into v_id;
  if v_id is null then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  return jsonb_build_object('ok', true, 'id', v_id);
end;
$$;

create or replace function public.live_staff_set_attendance(p_key text, p_registration_id uuid, p_attended boolean)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_err text := public.live_staff_gate(p_key);
  v_id uuid;
begin
  if v_err is not null then
    return jsonb_build_object('ok', false, 'error', v_err);
  end if;

  update public.live_registrations set attended = p_attended
  where id = p_registration_id
  returning id into v_id;
  if v_id is null then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  return jsonb_build_object('ok', true, 'id', v_id);
end;
$$;

revoke all on function public.live_staff_overview(text) from public, anon;
revoke all on function public.live_staff_save_session(text, uuid, timestamptz, integer, text, text, text, text) from public, anon;
revoke all on function public.live_staff_set_status(text, uuid, text) from public, anon;
revoke all on function public.live_staff_set_attendance(text, uuid, boolean) from public, anon;

grant execute on function public.live_staff_overview(text) to authenticated;
grant execute on function public.live_staff_save_session(text, uuid, timestamptz, integer, text, text, text, text) to authenticated;
grant execute on function public.live_staff_set_status(text, uuid, text) to authenticated;
grant execute on function public.live_staff_set_attendance(text, uuid, boolean) to authenticated;
