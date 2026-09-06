-- Security fix: doubts/doubt_replies/doubt_images/doubt_reply_images base-table
-- select policies were still `using (true)` from 024_doubts_conversion.sql --
-- is_removed filtering only happened in the doubts_feed/doubt_replies_feed
-- views, not the underlying tables, so a direct `.from('doubts').select('*')`
-- with the (public) anon key could read staff-removed content the views
-- correctly hide. Mirrors the pattern biolab_practicals/biolab_submissions/
-- biolab_submission_images already use (020_biolab_moderation_removal.sql,
-- 021_biolab_multi_image_and_attachments.sql): public sees non-removed rows,
-- an owner can always see their own regardless of removal state, and the
-- curated feed views (unchanged here, already correct) stay stricter with no
-- owner exception.

drop policy if exists doubts_select_all on public.doubts;
create policy doubts_select_all on public.doubts
  for select using (is_removed = false or user_id = auth.uid());

drop policy if exists doubt_replies_select_all on public.doubt_replies;
create policy doubt_replies_select_all on public.doubt_replies
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from public.doubts d
      where d.id = thread_id and (d.user_id = auth.uid() or d.is_removed = false)
    )
  );

drop policy if exists doubt_images_select_all on public.doubt_images;
create policy doubt_images_select_all on public.doubt_images
  for select using (
    exists (
      select 1 from public.doubts d
      where d.id = doubt_id and (d.user_id = auth.uid() or d.is_removed = false)
    )
  );

drop policy if exists doubt_reply_images_select_all on public.doubt_reply_images;
create policy doubt_reply_images_select_all on public.doubt_reply_images
  for select using (
    exists (
      select 1 from public.doubt_replies r
      join public.doubts d on d.id = r.thread_id
      where r.id = reply_id and (r.user_id = auth.uid() or d.is_removed = false)
    )
  );
