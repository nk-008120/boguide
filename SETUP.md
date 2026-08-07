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
   - **Project URL** (e.g. `https://xxxxx.supabase.co`)
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

## 3. Configure Auth

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

## 4. Set environment variables in Vercel

In the Vercel project dashboard -> **Settings -> Environment Variables**, add:

| Name | Value | Notes |
|---|---|---|
| `HUGO_SUPABASE_URL` | the Project URL from step 1 | public, used at Hugo build time |
| `HUGO_SUPABASE_ANON_KEY` | the anon/public key from step 1 | public, used at Hugo build time |
| `SUPABASE_URL` | same Project URL | used by `api/` functions only |
| `SUPABASE_ANON_KEY` | same anon key | used by `api/` functions only |
| `SUPABASE_SERVICE_ROLE_KEY` | the service_role key from step 1 | **mark as Sensitive** — this one can bypass all row-level security, never expose it client-side |

Redeploy after saving (Vercel usually does this automatically on the next
push, or you can trigger a manual redeploy from the dashboard).

## 5. Local development (optional)

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

Once steps 1-4 are done and deployed:

- [ ] Visit `/papers/account/`, sign up with a real email, confirm the
      verification email arrives and confirming it lets you log in.
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
