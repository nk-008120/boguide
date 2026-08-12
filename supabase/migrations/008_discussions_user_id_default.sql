alter table public.discussion_threads
  alter column user_id set default auth.uid();

alter table public.discussion_comments
  alter column user_id set default auth.uid();
