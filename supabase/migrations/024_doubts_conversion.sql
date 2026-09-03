
alter table public.discussion_threads rename to doubts;
alter table public.discussion_comments rename to doubt_replies;

alter index if exists idx_discussion_threads_created rename to idx_doubts_created;
alter index if exists idx_discussion_comments_thread rename to idx_doubt_replies_doubt;

alter table public.doubts
  add column if not exists subject text not null default 'general'
    check (subject in (
      'cell-biology', 'genetics', 'evolution', 'ecology', 'physiology',
      'biochemistry', 'anatomy', 'taxonomy-systematics', 'ethology', 'general'
    ));

grant insert (title, body, subject) on public.doubts to authenticated;

drop policy if exists discussion_threads_insert_own on public.doubts;
drop policy if exists doubts_insert_own on public.doubts;
create policy doubts_insert_own on public.doubts
  for insert
  with check (auth.uid() = user_id);

drop policy if exists doubts_update_staff_close on public.doubts;
create policy doubts_update_staff_close on public.doubts
  for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true)
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true)
  );

grant update (is_closed) on public.doubts to authenticated;

drop policy if exists discussion_comments_insert_open_thread on public.doubt_replies;
drop policy if exists doubt_replies_insert_staff_only on public.doubt_replies;
create policy doubt_replies_insert_staff_only on public.doubt_replies
  for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_staff = true)
    and exists (select 1 from public.doubts d where d.id = thread_id and d.is_closed = false)
  );

drop policy if exists discussion_threads_select_all on public.doubts;
drop policy if exists doubts_select_all on public.doubts;
create policy doubts_select_all on public.doubts
  for select using (true);

drop policy if exists discussion_comments_select_all on public.doubt_replies;
drop policy if exists doubt_replies_select_all on public.doubt_replies;
create policy doubt_replies_select_all on public.doubt_replies
  for select using (true);

drop view if exists public.discussion_threads_feed;
drop view if exists public.discussion_comments_feed;

create or replace view public.doubts_feed as
select
  d.id,
  d.title,
  d.body,
  d.subject,
  d.is_closed,
  d.created_at,
  p.id as user_id,
  p.display_name,
  p.avatar_url,
  p.country,
  (select count(*) from public.doubt_replies r where r.thread_id = d.id) as comment_count
from public.doubts d
join public.profiles p on p.id = d.user_id
where p.is_hidden = false
order by d.created_at desc;

create or replace view public.doubt_replies_feed as
select
  r.id,
  r.thread_id,
  r.body,
  r.created_at,
  p.id as user_id,
  p.display_name,
  p.avatar_url,
  p.country,
  p.is_staff
from public.doubt_replies r
join public.profiles p on p.id = r.user_id
where p.is_hidden = false
order by r.created_at asc;

grant select on public.doubts_feed to anon, authenticated;
grant select on public.doubt_replies_feed to anon, authenticated;
