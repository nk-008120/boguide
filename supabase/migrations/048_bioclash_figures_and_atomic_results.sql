insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('bioclash-figures', 'bioclash-figures', false, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

create or replace function public.bioclash_replace_round_results(p_season text, p_rows jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted integer;
begin
  if p_season is null or p_season = '' then
    raise exception 'season is required';
  end if;
  if jsonb_typeof(p_rows) is distinct from 'array' then
    raise exception 'rows must be a JSON array';
  end if;

  delete from public.bioclash_results where season = p_season;

  insert into public.bioclash_results
    (user_id, season, placement, score_label, season_year, round_id, raw_score, z_score, time_normalized_z, season_weight)
  select r.user_id, p_season, r.placement, r.score_label, r.season_year, r.round_id, r.raw_score, r.z_score, r.time_normalized_z, r.season_weight
  from jsonb_to_recordset(p_rows) as r(
    user_id uuid,
    placement int,
    score_label text,
    season_year text,
    round_id text,
    raw_score numeric,
    z_score numeric,
    time_normalized_z numeric,
    season_weight numeric
  );

  get diagnostics inserted = row_count;
  return inserted;
end;
$$;

revoke all on function public.bioclash_replace_round_results(text, jsonb) from public, anon, authenticated;
