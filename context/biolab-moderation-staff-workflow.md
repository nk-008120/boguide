# BiOLab moderation: staff workflow (v1)

There is no admin/staff role or in-app staff page for BiOLab. v1 moderation
is done directly in the **Supabase project dashboard**, which authenticates
as the project owner/service role and bypasses RLS and column grants
entirely -- it can read and write `is_removed` even though no client-side
code or API key ever can (see `supabase/migrations/020_biolab_moderation_removal.sql`).
This is a deliberate scope choice: building a real staff-role system is a
bigger lift than this moderation model calls for. If an in-app staff page
is wanted later, that's a new scope decision for the site owner to make,
not something to build unprompted.

## Reviewing open reports

1. Log in to the Supabase dashboard for this project.
2. Table Editor -> `biolab_protocol_reports` (for protocol reports) or
   `biolab_submission_reports` (for result/submission reports).
3. Filter or sort by `status = 'open'`. Each row has:
   - `protocol_id` / `submission_id` -- the reported content's row id.
   - `reporter_id` -- who filed it.
   - `reason` -- their free-text explanation.
   - `created_at`.

## Acting on a report

For each open report, decide: **actioned** (remove the content) or
**dismissed** (report doesn't warrant removal).

**To remove content:**

1. Table Editor -> `biolab_practicals` (protocol) or `biolab_submissions`
   (result). Find the row by the report's `protocol_id`/`submission_id`.
2. Set `is_removed` to `true`. Save.
   - This immediately hides it from `biolab_public_protocols` /
     `biolab_public_submissions` (what the site actually queries) and, for
     a removed submission's photo, from the Storage read policy too.
   - The row is **not deleted** -- the author/owner can still see their own
     removed row (tagged "Removed by staff" in the UI for results; the
     archive page shows "doesn't exist, or was removed" for a removed
     protocol slug), and the report row below still references it, so
     there's a full audit trail of what was removed and why.
3. Go back to the report row in `biolab_protocol_reports` /
   `biolab_submission_reports` and set:
   - `status` = `'actioned'`
   - `resolved_by` = your own `auth.users.id` (find it under
     Authentication -> Users if you don't have it memorized)
   - `resolved_at` = now (the dashboard's row editor can insert the current
     timestamp, or type it manually)

**To dismiss a report** (no removal warranted): just set `status =
'dismissed'`, `resolved_by`, `resolved_at` on the report row -- leave
`is_removed` as `false`.

## Un-removing something (mistake, appeal, etc.)

Set `is_removed` back to `false` on the `biolab_practicals` /
`biolab_submissions` row. There's no separate "restore" audit field in v1 --
if you want a record of why something was restored, note it in the
report row you're reverting (e.g. edit `reason` is not ideal since that's
the reporter's own text; simplest is to leave a comment in your own
records/Discussions rather than the DB, since there's no staff-notes column
in this schema).

## What staff can NOT do from the app itself

There is no "Remove" button anywhere in the BiOLab UI. `is_removed` has no
`grant insert`/`grant update` to the `authenticated` role on either table
(intentionally, matching how `is_verified`/`verified_by` already work) --
even a logged-in site owner account, using the public site, cannot flip it.
The dashboard is the only lever in v1.
