revoke insert on public.paper_contributions from authenticated;
grant insert (olympiad, year, round_label, source_url, license_note, exam_file_path, answer_file_path)
  on public.paper_contributions to authenticated;

revoke insert on public.content_corrections from authenticated;
grant insert (olympiad, year, round_id, problem_id, field, current_value, proposed_value, reason)
  on public.content_corrections to authenticated;

revoke insert on public.community_solutions from authenticated;
grant insert (olympiad, year, round_id, problem_id, body)
  on public.community_solutions to authenticated;

create or replace function public.count_pending_paper_contributions(uid uuid)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer from public.paper_contributions where user_id = uid and status = 'pending';
$$;

create or replace function public.count_pending_content_corrections(uid uuid)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer from public.content_corrections where user_id = uid and status = 'pending';
$$;

create or replace function public.count_pending_community_solutions(uid uuid)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer from public.community_solutions where user_id = uid and status = 'pending';
$$;

revoke all on function public.count_pending_paper_contributions(uuid) from public;
revoke all on function public.count_pending_content_corrections(uuid) from public;
revoke all on function public.count_pending_community_solutions(uuid) from public;
grant execute on function public.count_pending_paper_contributions(uuid) to authenticated;
grant execute on function public.count_pending_content_corrections(uuid) to authenticated;
grant execute on function public.count_pending_community_solutions(uuid) to authenticated;

drop policy if exists paper_contributions_insert_own on public.paper_contributions;
create policy paper_contributions_insert_own on public.paper_contributions
  for insert
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and public.count_pending_paper_contributions(auth.uid()) < 5
  );

drop policy if exists content_corrections_insert_own on public.content_corrections;
create policy content_corrections_insert_own on public.content_corrections
  for insert
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and public.count_pending_content_corrections(auth.uid()) < 5
  );

drop policy if exists community_solutions_insert_own on public.community_solutions;
create policy community_solutions_insert_own on public.community_solutions
  for insert
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and public.count_pending_community_solutions(auth.uid()) < 5
  );
