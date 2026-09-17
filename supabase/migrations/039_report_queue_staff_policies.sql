drop policy if exists doubt_reports_select_staff on public.doubt_reports;
create policy doubt_reports_select_staff on public.doubt_reports
  for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true));

drop policy if exists doubt_reports_update_staff on public.doubt_reports;
create policy doubt_reports_update_staff on public.doubt_reports
  for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true));

grant update (status, resolved_by, resolved_at) on public.doubt_reports to authenticated;

drop policy if exists biolab_protocol_reports_select_staff on public.biolab_protocol_reports;
create policy biolab_protocol_reports_select_staff on public.biolab_protocol_reports
  for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true));

drop policy if exists biolab_protocol_reports_update_staff on public.biolab_protocol_reports;
create policy biolab_protocol_reports_update_staff on public.biolab_protocol_reports
  for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true));

grant update (status, resolved_by, resolved_at) on public.biolab_protocol_reports to authenticated;

drop policy if exists biolab_submission_reports_select_staff on public.biolab_submission_reports;
create policy biolab_submission_reports_select_staff on public.biolab_submission_reports
  for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true));

drop policy if exists biolab_submission_reports_update_staff on public.biolab_submission_reports;
create policy biolab_submission_reports_update_staff on public.biolab_submission_reports
  for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true));

grant update (status, resolved_by, resolved_at) on public.biolab_submission_reports to authenticated;
