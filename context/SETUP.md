# BiOrchive login + leaderboard — setup steps

Everything in the codebase is already wired to the environment variable names
below — you don't need to touch any code, just create the accounts/keys and
paste them into the right places. Do these in order.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project (any
   name/region/database password you like — just keep the DB password
   somewhere safe, you won't need it for this setup though).
2. Once the project is ready, go to **Project Settings -> API**. You'll need
   three values from this page later:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`) — bare origin only,
     no trailing path like `/rest/v1/`
   - **anon / public key**
   - **service_role key** (click "Reveal" — keep this one secret, never put
     it in the Hugo/browser-facing env vars)

## 2. Run the schema

1. In the Supabase dashboard, open **SQL Editor -> New query**.
2. Paste in the entire contents of [supabase/schema.sql](supabase/schema.sql)
   from this repo and click **Run**.
3. Confirm it succeeded with no errors. You should now see `profiles` and
   `attempt_reports` tables, and `best_attempt_per_round` /
   `leaderboard_per_round` / `leaderboard_overall` views, under
   **Table Editor**.
4. Also run [supabase/migrations/002_profile_fields.sql](supabase/migrations/002_profile_fields.sql),
   [003_leaderboard_avatar.sql](supabase/migrations/003_leaderboard_avatar.sql),
   [004_moderation_and_deletion.sql](supabase/migrations/004_moderation_and_deletion.sql),
   [005_bioclash_notify.sql](supabase/migrations/005_bioclash_notify.sql),
   [006_bioclash_results.sql](supabase/migrations/006_bioclash_results.sql),
   [007_discussions.sql](supabase/migrations/007_discussions.sql),
   and [008_discussions_user_id_default.sql](supabase/migrations/008_discussions_user_id_default.sql)
   the same way, in that order (SQL Editor -> New query -> paste -> Run).
   **008 is a production hotfix — run it before promoting Discussions to real
   users.** Without it, every "Start a discussion" / "Reply" click fails with
   `new row violates row-level security policy for table "discussion_threads"`
   — the insert never sent `user_id`, and the RLS policy has no way to
   approve a row where that column is NULL. 008 defaults `user_id` to
   `auth.uid()` server-side; no code or grant change was needed.
   002 adds Part 2's `country`/`about`/`education_level` columns; 003 adds
   `avatar_url` to the leaderboard views; 004 adds `profiles.is_hidden`
   (moderation — see below) and the `account_deletions` log table (backing
   the account page's "Delete my account" button); 005 adds
   `profiles.notify_bioclash`, the opt-in flag behind the BiOClash landing
   page's (`/bioclash/`) login-based "get notified" widget; 006 adds the
   `bioclash_results` table + `bioclash_leaderboard` view backing the
   "BiOClash Champions" podium on `/papers/leaderboard/` (see "Recording
   BiOClash results" below — there's no automated scoring for BiOClash yet,
   so this table starts empty and the podium shows an honest "no champions
   crowned yet" state until you populate it by hand); 007 adds
   `discussion_threads`/`discussion_comments` and their feed views backing
   `/discussions/` (see "Closing a discussion thread" below). Any future
   schema change lands as a new numbered file in `supabase/migrations/`
   rather than editing `schema.sql` retroactively — run new ones in order
   as they're added.

### Recording BiOClash results

There's no scoring engine or admin UI for BiOClash yet — once a season
concludes and you know the placements, enter them by hand in the SQL
Editor. Find each winner's uuid via **Table Editor -> profiles** (search by
`display_name`), then:

```sql
insert into public.bioclash_results (user_id, season, placement, score_label)
values
  ('<uuid-1>', 'Season 1 — Fall 2026', 1, '94/100'),
  ('<uuid-2>', 'Season 1 — Fall 2026', 2, '89/100'),
  ('<uuid-3>', 'Season 1 — Fall 2026', 3, '85/100');
```

`score_label` is optional free text (leave it out / pass `null` if you'd
rather not show a score). The Champions podium always shows whichever
`season` value has the most recent `awarded_at` timestamp, so inserting a
new season's results automatically retires the old one — no code change
needed. To correct a mistake, just `update`/`delete` the row directly
(there's no self-serve edit path, same as every other admin action today).

### Closing a discussion thread

There's no in-app way to close a thread, by design — it's an owner-only
action done by hand in the SQL Editor:

```sql
update public.discussion_threads set is_closed = true where id = '<thread-uuid>';
```

Find the uuid from the thread's URL (`/discussions/?thread=<uuid>`) or via
**Table Editor -> discussion_threads**. Once closed, the RLS policy on
`discussion_comments` blocks any new replies at the database level — not
just hidden in the UI — even from a logged-in user hitting the API
directly. Re-open a thread the same way (`is_closed = false`). To remove a
thread entirely (spam, abuse), delete the row — comments cascade-delete
with it. A single bad comment can be deleted the same way from
`discussion_comments` without touching the thread.

### Moderation

There's no admin UI yet — to hide a bad `display_name`/profile from the
leaderboard (and now also from Discussions — hidden users' threads/comments
drop out of `discussion_threads_feed`/`discussion_comments_feed` the same
way they already drop out of the leaderboard views), run this in the SQL
Editor:

```sql
update public.profiles set is_hidden = true where id = '<user-uuid>';
```

Find the uuid via **Table Editor -> profiles** (search by `display_name`).
Hidden profiles disappear from both leaderboard views immediately but keep
their account and attempt history intact — this only affects visibility, not
data (`is_hidden = false` un-hides them).

## 3. Add avatar images

**Done, 2026-08-09.** All 12 avatars now exist at `static/avatars/` and
`AVATAR_FILES` in `static/js/papers-account.js` matches their real filenames
(mixed extensions — jpg/png/svg — not all `.png`, which is fine, the picker
just uses whatever's in the list). Two files originally supplied as `.avif`
were converted to `.png`: `profiles.avatar_url` has a CHECK constraint
(`002_profile_fields.sql`) that only allows
`png|jpg|jpeg|webp|svg` — `.avif` would have passed the picker UI but then
silently failed to save to the database. If more avatars are added later,
keep new files to one of those five extensions, or extend the CHECK
constraint in a new migration first.

## 4. Configure Auth

In **Authentication -> Providers**, confirm **Email** is enabled (it is by
default).

In **Authentication -> Sign In / Providers -> Email** (or **Auth ->
Settings**, depending on dashboard version):
- Turn **on** "Confirm email" — this keeps the leaderboard free of
  throwaway-email spam. Users will get a verification email before they can
  log in.
- Email delivery: Supabase's shared default sender works fine to start
  (rate-limited, but plenty for a small community site). You can switch to
  custom SMTP later in **Authentication -> Settings -> SMTP Settings** with
  no code changes needed.

In **Authentication -> URL Configuration**:
- **Site URL**: `https://boguide.vercel.app`
- **Redirect URLs**: add both `https://boguide.vercel.app/**` and
  `http://localhost:1313/**` (the second one is so password-reset/email-
  confirmation links work when you're testing with a local `hugo server`).

## 5. Set environment variables in Vercel

In the Vercel project dashboard -> **Settings -> Environment Variables**, add:

| Name | Value | Notes |
|---|---|---|
| `HUGO_SUPABASE_URL` | the Project URL from step 1 | public, used at Hugo build time |  DONE 
| `HUGO_SUPABASE_ANON_KEY` | the anon/public key from step 1 | public, used at Hugo build time |  
| `SUPABASE_URL` | same Project URL | used by `api/` functions only |
| `SUPABASE_ANON_KEY` | same anon key | used by `api/` functions only |
| `SUPABASE_SERVICE_ROLE_KEY` | the service_role key from step 1 | **mark as Sensitive** — this one can bypass all row-level security, never expose it client-side |

Redeploy after saving (Vercel usually does this automatically on the next
push, or you can trigger a manual redeploy from the dashboard).

### Supabase keep-alive (added 2026-08-09)

Free-tier Supabase projects auto-pause after 7 days with no API activity —
now a real risk since login, the leaderboard, BiOClash, and Discussions all
depend on this one project. `vercel.json` now has a `crons` entry hitting
`api/keepalive.js` (a trivial read-only `profiles` query) once a day at
06:00 UTC. **Nothing manual to do** — Vercel Cron reads `vercel.json`
automatically on deploy, no dashboard toggle needed on the Hobby plan for a
single once-daily job. Worth a one-time check after the next deploy:
**Vercel dashboard -> your project -> Cron Jobs** should show `/api/keepalive`
with a recent successful run.

## 6. Local development (optional)

If you want to run `hugo server` locally with the login system working, set
the same `HUGO_SUPABASE_URL` / `HUGO_SUPABASE_ANON_KEY` as real OS
environment variables in your shell before starting the server, e.g. in
PowerShell:

```powershell
$env:HUGO_SUPABASE_URL = "https://xxxxx.supabase.co"
$env:HUGO_SUPABASE_ANON_KEY = "..."
hugo server
```

Without these set, the site still builds and runs fine — the login-related
scripts just won't have a backend to talk to (see verification checklist
below).

Note: `hugo server` only serves the static site — it does **not** run the
`api/submit-attempt.js` serverless function (Vercel-only). To test the
"Submit to Leaderboard" button itself locally, install the
[Vercel CLI](https://vercel.com/docs/cli) and run `vercel dev` instead (it
needs `vercel login` + `vercel link` to your project first, plus a local
`.env` with the same `SUPABASE_URL`/`SUPABASE_ANON_KEY`/
`SUPABASE_SERVICE_ROLE_KEY` values — that file is already gitignored). This
is entirely optional: everything else (browsing, login, viewing
leaderboards) works fine under plain `hugo server` once steps 1-4 above are
done and deployed.

## Verification checklist

Once steps 1-5 are done and deployed:

- [ ] Visit `/account/`, sign up with a real email, confirm the verification
      email arrives and confirming it lets you log in. Visiting the old
      `/papers/account/` URL should redirect here automatically (Hugo alias).
- [ ] Log out, log back in; try "Forgot password?" and confirm the reset
      email + set-new-password flow completes.
- [ ] Complete a Timed Attempt (e.g. `/papers/ibo/2022/theoretical-1/attempt/`)
      while logged in, and click **Submit to Leaderboard** on the report
      screen — confirm it shows a server-computed score and rank.
- [ ] Open that round's leaderboard page (e.g.
      `/papers/ibo/2022/theoretical-1/leaderboard/`) and confirm your entry
      appears, ranked correctly.
- [ ] Open `/papers/leaderboard/` (the nav bar's "Leaderboard" link) and
      confirm the overall standings include that same attempt.
- [ ] Repeat a Timed Attempt anonymously (logged out) and confirm the report
      screen looks exactly as it did before this feature existed, aside from
      a small "Log in to save this" link — nothing is forced or blocking.
- [ ] In the Supabase Table Editor, open `attempt_reports` and confirm the
      stored `total_correct`/`total_statements` match what the server
      returned — not anything a client could have sent directly (there is no
      way to write to this table except through the serverless function).

Part 2 additions:

- [ ] While logged in on `/account/`, confirm the navbar icon (top-left, next
      to the logo) shows the generic login glyph, then pick an avatar in the
      account page and confirm the navbar icon switches to it without a page
      reload, and stays switched after navigating to another page.
- [ ] Fill in country/education level/about on the account page, save, and
      confirm a submitted leaderboard entry shows the matching flag emoji
      next to your name on both the per-round and overall leaderboard pages.
- [ ] Try typing more than 50 words into "About" and confirm the form blocks
      saving with a message, rather than silently truncating or erroring.
- [ ] Visit an article under `/articles/` while logged out and confirm the
      body is blurred with a "Log in to keep reading" prompt; log in from
      that prompt and confirm it returns you to the same article, unblurred.
- [ ] Visit `/bioclash/` while logged out, click "Log in to get notified",
      confirm it lands on `/account/?next=%2Fbioclash%2F`; log in and confirm
      you're returned to `/bioclash/` with the widget now showing "You're
      opted in ✓". In the Supabase Table Editor, confirm that user's
      `profiles.notify_bioclash` is `true`. Click "Opt out" and confirm it
      flips back to `false` and the login CTA reappears.
- [ ] Visit `/papers/leaderboard/` with `bioclash_results` still empty and
      confirm the "BiOClash Champions" section shows the "no champions
      crowned yet" message with a working link to `/bioclash/`, rather than
      an empty podium or a broken query. Insert a test season's results
      (see "Recording BiOClash results" above), reload, and confirm the
      podium renders with the right names/avatars/flags and the season
      label; delete the test rows afterward.
- [ ] Visit `/discussions/` while logged out and confirm you can read the
      (empty, at first) thread list, and see "Log in to start a discussion"
      rather than a form. Log in, post a thread, confirm it redirects to
      `/discussions/?thread=<id>` and shows your post. Log in as a second
      account (or log out and back in as another user) and post a reply;
      confirm it appears. Close the thread via the SQL snippet above,
      reload the thread page, and confirm the reply form is replaced by
      "This thread is closed" — then confirm attempting to insert a comment
      on that thread directly via the Supabase client (e.g. browser
      devtools console) is rejected by RLS, not just hidden by the UI.
