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
    coalesce(
      nullif(left(btrim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), 40), ''),
      nullif(left(btrim(split_part(coalesce(new.email, ''), '@', 1)), 40), ''),
      'Anonymous'
    )
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from anon, authenticated;

alter table public.profiles drop constraint if exists profiles_display_name_length_check;
alter table public.profiles
  add constraint profiles_display_name_length_check
  check (char_length(btrim(display_name)) between 1 and 40) not valid;

alter table public.biolab_practicals drop constraint if exists biolab_practicals_text_length_check;
alter table public.biolab_practicals
  add constraint biolab_practicals_text_length_check
  check (
    char_length(title) between 1 and 200
    and (description is null or char_length(description) <= 500)
    and (body is null or char_length(body) <= 50000)
    and (source_attribution is null or char_length(source_attribution) <= 500)
  ) not valid;

alter table public.biolab_submissions drop constraint if exists biolab_submissions_result_unit_length_check;
alter table public.biolab_submissions
  add constraint biolab_submissions_result_unit_length_check
  check (result_unit is null or char_length(result_unit) <= 50) not valid;

alter table public.page_ratings drop constraint if exists page_ratings_page_path_check;
alter table public.page_ratings
  add constraint page_ratings_page_path_check
  check (char_length(page_path) between 1 and 300 and page_path like '/%') not valid;

alter table public.paper_contributions drop constraint if exists paper_contributions_source_url_scheme_check;
alter table public.paper_contributions
  add constraint paper_contributions_source_url_scheme_check
  check (source_url is null or source_url ~* '^https?://') not valid;

create or replace function public.my_doubts_last_day()
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer from public.doubts
  where user_id = auth.uid() and created_at > now() - interval '24 hours';
$$;

create or replace function public.my_protocols_last_day()
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer from public.biolab_practicals
  where created_by = auth.uid() and created_at > now() - interval '24 hours';
$$;

create or replace function public.my_protocol_feedback_last_day()
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer from public.biolab_protocol_feedback
  where user_id = auth.uid() and created_at > now() - interval '24 hours';
$$;

create or replace function public.my_reports_last_day()
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select (
    (select count(*) from public.doubt_reports
      where reporter_id = auth.uid() and created_at > now() - interval '24 hours')
    + (select count(*) from public.biolab_protocol_reports
      where reporter_id = auth.uid() and created_at > now() - interval '24 hours')
    + (select count(*) from public.biolab_submission_reports
      where reporter_id = auth.uid() and created_at > now() - interval '24 hours')
    + (select count(*) from public.biolab_feedback_reports
      where reporter_id = auth.uid() and created_at > now() - interval '24 hours')
  )::integer;
$$;

revoke all on function public.my_doubts_last_day() from public;
revoke all on function public.my_protocols_last_day() from public;
revoke all on function public.my_protocol_feedback_last_day() from public;
revoke all on function public.my_reports_last_day() from public;
grant execute on function public.my_doubts_last_day() to authenticated;
grant execute on function public.my_protocols_last_day() to authenticated;
grant execute on function public.my_protocol_feedback_last_day() to authenticated;
grant execute on function public.my_reports_last_day() to authenticated;

drop policy if exists doubts_insert_own on public.doubts;
create policy doubts_insert_own on public.doubts
  for insert
  with check (
    auth.uid() = user_id
    and public.my_doubts_last_day() < 10
  );

drop policy if exists biolab_practicals_insert_own on public.biolab_practicals;
create policy biolab_practicals_insert_own on public.biolab_practicals
  for insert
  with check (
    created_by = auth.uid()
    and public.my_protocols_last_day() < 5
  );

drop policy if exists biolab_protocol_feedback_insert_own on public.biolab_protocol_feedback;
create policy biolab_protocol_feedback_insert_own on public.biolab_protocol_feedback
  for insert
  with check (
    auth.uid() = user_id
    and public.my_protocol_feedback_last_day() < 30
  );

drop policy if exists doubt_reports_insert_own on public.doubt_reports;
create policy doubt_reports_insert_own on public.doubt_reports
  for insert
  with check (
    auth.uid() = reporter_id
    and public.my_reports_last_day() < 20
  );

drop policy if exists biolab_protocol_reports_insert_own on public.biolab_protocol_reports;
create policy biolab_protocol_reports_insert_own on public.biolab_protocol_reports
  for insert
  with check (
    auth.uid() = reporter_id
    and public.my_reports_last_day() < 20
  );

drop policy if exists biolab_submission_reports_insert_own on public.biolab_submission_reports;
create policy biolab_submission_reports_insert_own on public.biolab_submission_reports
  for insert
  with check (
    auth.uid() = reporter_id
    and public.my_reports_last_day() < 20
    and exists (
      select 1 from public.biolab_submissions s
      where s.id = submission_id and s.is_published = true
    )
  );

drop policy if exists biolab_feedback_reports_insert_own on public.biolab_feedback_reports;
create policy biolab_feedback_reports_insert_own on public.biolab_feedback_reports
  for insert
  with check (
    auth.uid() = reporter_id
    and public.my_reports_last_day() < 20
  );
