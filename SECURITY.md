# Security

## Reporting a vulnerability

Email **resourcerepository4boguide@gmail.com** with what you found and how
to reproduce it. Please don't open a public GitHub issue for anything
that isn't already public knowledge, exam content and account data are
the two things on this site that would actually hurt someone if a report
sat in the open before it was fixed.

You should get a response acknowledging the report within a few days.
There's no bug bounty, this is a small student-run project, but real
reports are taken seriously and credited if you'd like.

## Security model

BiOGuide is a Hugo static site with no application server: Vercel
functions and direct Supabase client calls are the only two ways data
moves, and Postgres Row Level Security is the actual access control for
everything a client touches directly. See `ARCHITECTURE.md` for the full
picture; the short version is that an RLS bug here is not a
defense-in-depth failure, it's the whole boundary failing for that table,
which is why `tests/rls/` and `tests/biolab/` exist and run in CI on
every push.

A few things that look like gaps but are deliberate, so a report on them
will be closed as expected behavior rather than fixed, though a specific
attack we hadn't considered is still worth reporting:

- **BiOLab publishes immediately and moderates by report-and-remove**, not
  pre-publish review. This is an intentional tradeoff for an open
  contribution archive, not an oversight. See `ARCHITECTURE.md`.
- **`bioclash_leaderboard`, `bioclash_season_standings`,
  `best_attempt_per_round`, `leaderboard_per_round`, `leaderboard_overall`,
  and `page_ratings_agg` are `SECURITY DEFINER` views by design.** They
  exist specifically to show an aggregate across all users despite the
  underlying tables' RLS restricting each user to their own rows
  (`attempt_reports`, `page_ratings`). Flagging these as "should be
  `SECURITY DEFINER`" in an automated scanner is correct to notice and
  expected to stay that way; converting them to `security_invoker` would
  break the leaderboards, not fix a vulnerability.
- **Exam content in `data/bioclash/*.yaml` is never sent to the client
  ahead of time**, but the questions themselves are visible to anyone who
  legitimately starts an attempt. That's the intended exam experience,
  not a leak.

## Scope

In scope: this repository's code, Supabase schema/RLS, and the Vercel
functions in `api/`. Out of scope: third-party services this project
depends on but doesn't control (Supabase's own platform, Vercel's own
platform, Umami, PostHog, Google Analytics), report those to their
respective maintainers instead.
