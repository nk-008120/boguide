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
which is why `tests/rls/` and `tests/biolab/` exist. They run in CI on
every push and pull request to `main`, together with the grading, vault
and API handler tests, a JavaScript linter, an internal link check on the
built site and a secret scan. Work on other branches is not checked until
it is proposed for `main`.

A few things that look like gaps but are deliberate, so a report on them
will be closed as expected behavior rather than fixed, though a specific
attack we hadn't considered is still worth reporting:

- **BiOLab publishes immediately and moderates by report-and-remove**, not
  pre-publish review. This is an intentional tradeoff for an open
  contribution archive, not an oversight. See `ARCHITECTURE.md`.
- **`best_attempt_per_round`, `leaderboard_per_round`, `leaderboard_overall`,
  and `page_ratings_agg` are `SECURITY DEFINER` views by design.** They
  exist specifically to show an aggregate across all users despite the
  underlying tables' RLS restricting each user to their own rows
  (`attempt_reports`, `page_ratings`). A scanner is right to notice them
  and they are expected to stay that way; converting them to
  `security_invoker` would break the leaderboards, not fix a vulnerability.
  Every other public view, including `bioclash_leaderboard` and
  `bioclash_season_standings`, runs as `security_invoker` since migration
  036, because the tables underneath them are already safe to read.
- **Staff status is public.** `is_staff` on a profile is readable by
  anyone, because it is what puts the staff badge on a reply. A hidden
  profile, on the other hand, is readable only by its owner.
- **Answer keys in `data/bioclash/` are never sent to the client**, and a
  question's text only reaches a participant who has started an attempt
  and reached that block. The questions being visible to someone who
  legitimately starts is the intended exam experience, not a leak.
- **Raw HTML in content is allowed on purpose.** Hugo's Markdown renderer
  runs with `unsafe = true`, because the BiOClash pages, the games and the
  standalone simulators are written as HTML. Everything under `content/`
  and `static/` reaches the site only through a reviewed commit, so it is
  trusted input. Text written by users (doubts, protocols, feedback) never
  passes through that renderer. It is fetched and rendered in the browser,
  and that code is where escaping is enforced.
- **Staff accounts are set in the database, not in the repository.**
  Migration 023 names the first five staff profiles by ID. Those IDs are
  not secrets, since staff status is public, and users cannot change the
  flag on their own profile. Later staff changes are made directly in the
  database and are not committed.

One thing that is a real gap and not a design choice: for MB-01 the paper
file sat in plaintext in a public repository until shortly before the
round, and its figures are ordinary static files that can be fetched
without starting an attempt. We know, we chose to run that round as it
was, and the reasoning and the fix for later rounds are written up in
`ARCHITECTURE.md` under "What went wrong with MB-01, and what we decided".
A report that only restates this will be closed as known.

## What the browser is told

Every response carries HSTS, `X-Content-Type-Options: nosniff`, same-origin
framing only, and a strict referrer policy, all set in `vercel.json`. A small Content Security Policy is enforced: no plugins, no `<base>`
rewriting, and no framing by other sites. The full policy is still sent in
report-only mode, because the site relies on inline scripts. Treat that
part as a work in progress, not a control.

Third-party code is pinned. The Supabase client is served from our own
site with an integrity hash, and the Plotly and MathJax tags name an exact
version and carry one too. The exceptions are Google Analytics, which
cannot be pinned, and Mermaid, which is fetched at build time and is not
yet pinned to a version.

The post-login `next` parameter on the account page is accepted only when
it is a path on this site.

## Scope

In scope: this repository's code, Supabase schema/RLS, and the Vercel
functions in `api/`. Out of scope: third-party services this project
depends on but doesn't control (Supabase's own platform, Vercel's own
platform, Umami, PostHog, Google Analytics), report those to their
respective maintainers instead.
