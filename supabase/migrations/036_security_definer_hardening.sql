revoke execute on function public.handle_new_user() from anon, authenticated;

do $$
begin
  if exists (select 1 from pg_proc where proname = 'rls_auto_enable' and pronamespace = 'public'::regnamespace) then
    revoke execute on function public.rls_auto_enable() from anon, authenticated;
  end if;
end $$;

alter view public.biolab_public_protocols set (security_invoker = true);
alter view public.biolab_public_submissions set (security_invoker = true);
alter view public.biolab_protocol_feedback_feed set (security_invoker = true);
alter view public.doubts_feed set (security_invoker = true);
alter view public.doubt_replies_feed set (security_invoker = true);
alter view public.bioclash_leaderboard set (security_invoker = true);
alter view public.bioclash_season_standings set (security_invoker = true);
