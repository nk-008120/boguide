create table if not exists public.rate_limits (
  key          text primary key,
  window_start timestamptz not null default now(),
  count        integer not null default 0
);

alter table public.rate_limits enable row level security;

create or replace function public.rate_limit_hit(p_key text, p_window_ms integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
  v_expired boolean;
begin
  insert into public.rate_limits (key, window_start, count)
  values (p_key, now(), 1)
  on conflict (key) do update
    set count = 1,
        window_start = now()
    where now() - rate_limits.window_start > (p_window_ms || ' milliseconds')::interval
  returning count into v_count;

  if v_count is null then
    update public.rate_limits
      set count = count + 1
      where key = p_key
      returning count into v_count;
  end if;

  return v_count;
end;
$$;

revoke all on function public.rate_limit_hit(text, integer) from public, anon, authenticated;
