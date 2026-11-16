create or replace function public.my_page_ratings_last_day()
returns integer
language sql
security definer
set search_path = public
volatile
as $$
  select count(*)::integer from public.page_ratings
  where user_id = auth.uid() and created_at > now() - interval '24 hours';
$$;

create or replace function public.my_subject_review_rows()
returns integer
language sql
security definer
set search_path = public
volatile
as $$
  select count(*)::integer from public.subject_review_state
  where user_id = auth.uid();
$$;

create or replace function public.my_biolab_submissions_last_day()
returns integer
language sql
security definer
set search_path = public
volatile
as $$
  select count(*)::integer from public.biolab_submissions
  where user_id = auth.uid() and captured_at > now() - interval '24 hours';
$$;

revoke all on function public.my_page_ratings_last_day() from public;
revoke all on function public.my_subject_review_rows() from public;
revoke all on function public.my_biolab_submissions_last_day() from public;
grant execute on function public.my_page_ratings_last_day() to authenticated;
grant execute on function public.my_subject_review_rows() to authenticated;
grant execute on function public.my_biolab_submissions_last_day() to authenticated;

drop policy if exists page_ratings_insert_own on public.page_ratings;
create policy page_ratings_insert_own on public.page_ratings
  for insert
  with check (
    auth.uid() = user_id
    and public.my_page_ratings_last_day() < 200
  );

drop policy if exists subject_review_state_insert_own on public.subject_review_state;
create policy subject_review_state_insert_own on public.subject_review_state
  for insert
  with check (
    auth.uid() = user_id
    and public.my_subject_review_rows() < 1000
  );

drop policy if exists biolab_submissions_insert_own on public.biolab_submissions;
create policy biolab_submissions_insert_own on public.biolab_submissions
  for insert
  with check (
    auth.uid() = user_id
    and public.my_biolab_submissions_last_day() < 20
  );

alter table public.biolab_submissions drop constraint if exists biolab_submissions_calibration_inputs_size_check;
alter table public.biolab_submissions
  add constraint biolab_submissions_calibration_inputs_size_check
  check (octet_length(calibration_inputs::text) < 20000) not valid;

alter table public.content_corrections drop constraint if exists content_corrections_current_value_length_check;
alter table public.content_corrections
  add constraint content_corrections_current_value_length_check
  check (current_value is null or char_length(current_value) <= 5000) not valid;

update storage.buckets
  set file_size_limit = 10485760,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
  where id = 'biolab-captures';

update storage.buckets
  set file_size_limit = 52428800,
      allowed_mime_types = array['application/pdf']
  where id = 'paper-contributions';

revoke select on public.best_attempt_per_round from anon, authenticated;

create or replace function public.count_pending_paper_contributions()
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer from public.paper_contributions where user_id = auth.uid() and status = 'pending';
$$;

create or replace function public.count_pending_content_corrections()
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer from public.content_corrections where user_id = auth.uid() and status = 'pending';
$$;

create or replace function public.count_pending_community_solutions()
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::integer from public.community_solutions where user_id = auth.uid() and status = 'pending';
$$;

revoke all on function public.count_pending_paper_contributions() from public;
revoke all on function public.count_pending_content_corrections() from public;
revoke all on function public.count_pending_community_solutions() from public;
grant execute on function public.count_pending_paper_contributions() to authenticated;
grant execute on function public.count_pending_content_corrections() to authenticated;
grant execute on function public.count_pending_community_solutions() to authenticated;

drop policy if exists paper_contributions_insert_own on public.paper_contributions;
create policy paper_contributions_insert_own on public.paper_contributions
  for insert
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and public.count_pending_paper_contributions() < 5
  );

drop policy if exists content_corrections_insert_own on public.content_corrections;
create policy content_corrections_insert_own on public.content_corrections
  for insert
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and public.count_pending_content_corrections() < 5
  );

drop policy if exists community_solutions_insert_own on public.community_solutions;
create policy community_solutions_insert_own on public.community_solutions
  for insert
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and public.count_pending_community_solutions() < 5
  );

drop function if exists public.count_pending_paper_contributions(uuid);
drop function if exists public.count_pending_content_corrections(uuid);
drop function if exists public.count_pending_community_solutions(uuid);
