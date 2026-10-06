# BiOLab v2 plan: finish the product and lift BETA

Status: planning complete on 2026-10-05, no implementation started.
Source of truth for every build session. If a session finds that the code
disagrees with this plan, it stops and reports instead of improvising.

BiOLab today is a protocol archive where anyone can publish a protocol
instantly, others can comment, report and submit results, and results hold
one number plus photos. This plan closes the gaps found in the 2026-10-05
status review and adds structured result types that complement the existing
phone-camera colorimetry.

## 1. Decision log

Every decision below was made by the site owner in the 2026-10-05 planning
quiz. Items marked "default" were not asked and are the planner's proposal,
listed again in section 9 for confirmation.

### Scope and integration

| Decision | Outcome |
|---|---|
| Relationship to Lablaps and BenchQuant | Record the method, import the output. No embed, no API. Users run those tools themselves and BiOLab stores what they produce. |
| Techniques live at launch | Colorimetric (existing), colony counting, cell counting, gel or blot densitometry, plate readout (ELISA or qPCR style tables). |
| Where the technique is decided | The protocol author declares a readout type when submitting. The result form on that protocol adapts. |
| Naming of the two products | Plain text names and outbound links, no logos, no "official integration" wording, one line stating BiOGuide is not affiliated. |
| What users provide | Manual entry form, a "method used" field, and the original export file kept as an attachment. No CSV parsing at launch. |
| Result storage | One table. `technique` plus a typed `data` jsonb on `biolab_submissions`, shape validated and derived values computed in the database. |
| Payoff | BiOGuide reference result where staff set one, plus peer spread (median, range, n) from public results. |

### Lifecycle and trust

| Decision | Outcome |
|---|---|
| Edit own protocol | Free edits. A trigger stores every prior version. Page shows "Edited <date>". Author and staff can read history. |
| Withdraw | Soft, reversible `is_withdrawn`, author-settable. Others' results and feedback are kept. Distinct from staff `is_removed`. |
| Delete own data | Authors can permanently delete their own results (with photos and export files) and their own feedback comments. |
| Edit own result | Allowed, with an "Edited" marker. Database re-validates and recomputes on every update. |
| Readout type after results exist | Locked once any result exists. Free to change before that. |
| Staff powers in app | Triage only (actioned or dismissed). Removal and restore stay a Supabase dashboard action. |
| Staff queue | Dedicated `/biolab/moderation/` page. Open-report count on that page only, no email alerts. |
| Abuse | Minimal database caps per user per day on protocols, results, feedback, reports and uploaded files. |
| My BiOLab | Its own page at `/biolab/mine/`, linked from the account page, the hub and the archive header. |

### Content and launch

| Decision | Outcome |
|---|---|
| Export file types | Images (re-encoded through the EXIF stripper), CSV, JSON, PDF. MIME-locked private bucket, 10 MB each, max 5 per result, download-only via signed URL, never rendered inline, visible to others only while the result is public and not removed. |
| Per-technique fields | Core fields per technique, section 4.3. No replicate statistics. |
| Peer spread rule | Shown from 3 public results, split by technique and method used, median and min to max with n, no mean, no outlier removal. Below 3 it says not enough public results yet. |
| Calibration card | Publish a printable BiOGuide card as a PDF linked from every colorimetric protocol. |
| Aspirin reference result | Hidden until re-measured. The placeholder row is removed, the page shows peer spread only. |
| Official protocols at launch | Aspirin plus one each for colony counting, cell counting, densitometry and plate readout. |
| Content authorship | Planner drafts, the team verifies, adds attribution and approves. Nothing is marked official until a person has verified it. |
| Hub | Live hub with real counts and newest protocols. The local-only survey is removed. |
| Release plan | Two releases. Release 1 is lifecycle and hub with BETA still on. Release 2 is techniques and content, then BETA is removed. |
| Deliverable | This plan plus one kickoff prompt per session. |

## 2. Out of scope, recorded as backlog

- Structured protocol fields (materials, steps, safety) instead of one text body.
- A promotion path to a "BiOGuide-verified" badge for community protocols. Official status stays `created_by IS NULL`, set from the dashboard.
- In-app removal and restore by staff, email or digest alerts for new reports.
- Parsing Lablaps or BenchQuant exports into fields.
- In-browser auto-detection of colonies or bands.
- Replicate-level statistics and mean or standard deviation.
- Any partnership approach to Lablaps or BenchQuant.
- New-account waiting periods.

## 3. Release 1: lifecycle and hub (BETA stays on)

Migrations are numbered from 043 because 042 is the latest. 042 must be
applied to the live project before anything below.

### 3.1 Migration 043: protocol lifecycle and revisions

On `biolab_practicals`:
- Add `is_withdrawn boolean not null default false` and `edited_at timestamptz`.
- Grant update on `is_withdrawn` to `authenticated`. Existing update grant on title, description, body, source_attribution, category stays.
- Tighten the update policy so an author cannot edit a protocol that staff removed: `using (created_by = auth.uid() and is_removed = false)` with the same `with check`. (default)

New table `biolab_protocol_revisions`:
- Columns: id, protocol_id (references `biolab_practicals` on delete cascade), title, description, body, source_attribution, category, saved_at default now().
- A `before update` trigger on `biolab_practicals`, SECURITY DEFINER with a fixed `search_path`, inserts the OLD values when any of the five content columns changes and sets `edited_at = now()`.
- RLS: select for the protocol's author and for staff (`profiles.is_staff`). No insert, update or delete grant to any client role.

Views and policies that must exclude withdrawn protocols:
- `biolab_public_protocols`: add `where is_withdrawn = false` and expose `edited_at`. Keep `security_invoker = true`.
- The attachments table and storage select policies: public read only when the protocol is neither removed nor withdrawn, with the author still able to read their own.
- Public submissions view and feedback feed: verify, then test, that results and comments under a withdrawn or removed protocol disappear from public reads. The current `biolab_public_submissions` filters only on the submission's own `is_removed`, so this may need a join condition on the protocol. Report what the real behaviour is before changing it.

### 3.2 Migration 044: owner deletes

Delete policies and grants:
- `biolab_submissions`: `using (user_id = auth.uid() and is_removed = false)`.
- `biolab_submission_images`: via the parent submission being the caller's and not removed.
- `biolab_protocol_feedback`: `using (user_id = auth.uid() and is_removed = false)`.
- `biolab_protocol_attachments`: the protocol's author, so an author can remove an attached PDF when editing.
- Storage delete policies on `biolab-captures` (path prefix is the caller's id) and `biolab-protocol-attachments` (the protocol belongs to the caller).

Rules the session must respect:
- Deleting rows in SQL does not delete Storage files. The client calls the Storage remove API first, then deletes the row. The plan accepts that a failed second step can leave an orphan file and requires the code to handle and surface that case.
- Staff-removed items cannot be deleted by their owner, so evidence stays. (default)
- Reports reference content with `on delete cascade`. Deleting reported content therefore removes its reports. Accepted, because the content is gone with them.
- No protocol delete policy. Withdrawal is the only author action on a protocol.

### 3.3 Migration 045: staff reads limited to reported content

Staff already have report-table select and update policies (039, 040). The queue also needs to read what was reported. Add staff select policies that expose a row only when it has at least one report:
- `biolab_practicals`, `biolab_submissions`, `biolab_submission_images`, `biolab_protocol_feedback`, including removed and withdrawn rows.
- No blanket staff read of private results. Photos of unpublished results stay private even from staff unless reported. (default)

### 3.4 Migration 046: minimal caps

A SECURITY DEFINER `before insert` trigger per table calls the existing `public.rate_limit_hit(key, window_ms)` from 041 with a 24 hour window and raises a clear exception above the cap. Proposed caps per user per day, to confirm in section 9: protocols 5, results 30, feedback 40, reports of any kind 20. The trigger functions must set a fixed `search_path`. File caps are added in release 2.

### 3.5 Frontend

- `static/js/biolab-submit-protocol.js`: add edit mode at `/biolab/submit/?edit=<slug>`. Prefilled form, only the author can enter it, attachments can be added and removed.
- `static/js/biolab-archive.js`: show "Edited <date>", a clear message for withdrawn protocols, no behaviour change otherwise.
- New page `content/biolab/mine/_index.md` and `static/js/biolab-mine.js`:
  - Protocols with status chips (Live, Withdrawn, Removed by staff), Edit, Withdraw, Restore, revision count.
  - Results with the public toggle and Delete.
  - Feedback comments with Delete.
- New page `content/biolab/moderation/_index.md` and `static/js/biolab-moderation.js`: staff only. Lists open protocol, result and comment reports with the reported content inline, the reason, and Actioned and Dismissed buttons that set `status`, `resolved_by`, `resolved_at`. Shows the open-report count. States plainly that removal is done in the Supabase dashboard. Non-staff see a staff-only message, and RLS is the real gate.
- Hub `content/biolab/_index.md`: remove "IN PLANNING", "Coming Soon!", "once it exists" and the future-tense copy. Add live counts (protocols, public results) and the six newest protocols from Supabase, keep the safety rules, drop the survey script and its `biolab-feedback-v2` local storage use. Keep both calls to action.
- Links to `/biolab/mine/` from the hub, the archive header and the account page (`content/account/`).
- Rewrite `context/biolab-moderation-staff-workflow.md`, which still claims no staff role exists.

### 3.6 Tests (pglite, in `tests/biolab/`)

New files wired into the `npm test` script and `README.md`:
- `test-lifecycle.mjs`: edit and revision capture, `edited_at`, withdraw and restore, `is_removed` still not grantable, author cannot edit a removed protocol, withdrawn hidden from public views and attachment policies.
- `test-owner-deletes.mjs`: each delete policy, cannot delete another user's row, cannot delete a staff-removed row, cascade to images and reports.
- `test-staff-queue.mjs`: staff see reported content only, non-staff see nothing extra, triage updates work, staff cannot change `is_removed`.
- `test-rate-caps.mjs`: cap enforced per user, other users unaffected, window reset.

### 3.7 Release 1 gate

All suites pass. A security review pass by a separate session finds no open issue above informational. Docs updated (section 7). Then 042 to 046 are applied to the live project, the site is deployed, and BETA stays in the tutorial text.

## 4. Release 2: techniques and content (BETA lifted at the end)

### 4.1 Migration 047: readout types

- `biolab_practicals.readout_type text not null default 'manual'` with a check over `manual`, `colorimetric`, `colony_count`, `cell_count`, `densitometry`, `plate_readout`.
- Backfill: `aspirin-trinder` becomes `colorimetric`, every other existing row stays `manual`.
- Add to the insert and update grants.
- A `before update` trigger rejects a change to `readout_type` when any `biolab_submissions` row exists for the protocol. It must be SECURITY DEFINER because an author cannot see other users' private results through RLS, and those still count.

### 4.2 Migration 048: result techniques

On `biolab_submissions` add:
- `technique text not null default 'manual'`, same value set as above.
- `method_used text` limited to `lablaps`, `benchquant`, `hand_count`, `in_app_capture`, `other_tool`, with `method_other text` (60 characters) required when `other_tool`.
- `method_url text` optional, must start with `https://`, 300 characters, rendered only as a link with `rel="noopener noreferrer nofollow"`.
- `data jsonb not null default '{}'`, `notes text` (1000 characters), `edited_at timestamptz`.

A `before insert or update` trigger:
- Requires `technique` to equal the parent protocol's `readout_type` and refuses any change to `technique` afterwards.
- Calls a validation function per technique (4.3) that rejects unknown keys, wrong types and out-of-range values, caps the serialized `data` size at 20000 bytes, overwrites derived fields with server-computed values, and sets `result_value` and `result_unit` from the derived headline for the count and ratio techniques.
- Sets `edited_at` on substantive updates.

Update grants widen to `result_value`, `result_unit`, `method_used`, `method_other`, `method_url`, `data`, `notes`, alongside the existing `is_published`. Insert grants add the same columns. `calibration_inputs` stays insert-only.

`biolab_public_submissions` is recreated with `technique`, `method_used`, `method_other`, `method_url`, `data`, `notes`, `edited_at`, keeping the existing publish, removal and hidden-profile filters and `security_invoker = true`.

New view `biolab_result_spread`: grouped from `biolab_public_submissions` by protocol, technique, method used and unit, returning n, the median via `percentile_cont(0.5)`, min and max, with `having count(*) >= 3` so small groups never leave the database.

### 4.3 Field definitions

| Technique | Required input fields | Derived and headline |
|---|---|---|
| manual | `result_value`, optional `result_unit` | unchanged from today |
| colorimetric | `result_value`, optional unit, optional guided calibration into `calibration_inputs` | unchanged from today |
| colony_count | `colonies_counted` integer 0 to 10000000, `plated_volume_ul` greater than 0, `dilution_factor` at least 1 | `cfu_per_ml = colonies_counted / (plated_volume_ul / 1000) * dilution_factor`, unit CFU/mL |
| cell_count | `cells_counted` integer 0 to 10000000, `squares_counted` integer at least 1, `dilution_factor` at least 1, `chamber_depth_mm` greater than 0, `square_side_mm` greater than 0 | `cells_per_ml = cells_counted / squares_counted / (square_side_mm^2 * chamber_depth_mm * 0.001) * dilution_factor`, unit cells/mL. With a 1 mm square and 0.1 mm depth this reduces to counts per square times 10000. |
| densitometry | `target_label`, `control_label` (60 characters each), `target_intensity` at least 0, `control_intensity` greater than 0, optional `lanes` array up to 24 of label, target, control | `normalized_ratio = target_intensity / control_intensity`, unit ratio (a.u.) |
| plate_readout | `units` (20 characters), `wells` array up to 384 of `{well, value}` where `well` matches `^[A-P]([1-9]\|1[0-9]\|2[0-4])$`, optional `blank_value` | `well_count`, `min`, `max`, `mean` blank-subtracted when a blank is given. Headline is the mean in the stated units. |

### 4.4 Migration 049: result files and file caps

- Table `biolab_result_files`: id, submission_id (cascade), file_path, file_name (120 characters), file_type in `csv`, `json`, `pdf`, `png`, `jpg`, position, created_at.
- Private bucket `biolab-result-files`, 10 MB limit, allowed MIME types `text/csv`, `application/json`, `application/pdf`, `image/png`, `image/jpeg`. Session decides whether Windows' `application/vnd.ms-excel` for CSV must also be allowed.
- RLS mirrors `biolab_submission_images`: insert by the owner with path prefix equal to their id, select through the parent (own, or published and not removed), delete by the owner and not removed.
- Trigger caps files at 5 per result and joins the daily caps from 046.
- Storage select policy joins through the parent, as for photos. The insert policy stays path-prefix only, for the same reason documented in ARCHITECTURE.md.

Known limit, accepted: bucket MIME enforcement checks the declared content type, not file contents, and CSV, JSON and PDF cannot be metadata-stripped. Files are served download-only and never rendered.

### 4.5 Migration 050: reference result cleanup and official protocols

- Delete the placeholder `biolab_reference_results` row for `aspirin-trinder` (identified by its notes text, not by id). The archive already hides the reference section when no row exists.
- Seed the four new official protocols and update the aspirin body only after the team has signed off the drafts (section 5). Rows are created with `created_by` null so `is_official` is derived.
- No reference rows are seeded for the new protocols.

### 4.6 Frontend

The results code in `static/js/biolab-archive.js` is 837 lines and about to grow substantially. Extract it into `static/js/biolab-results.js` (default, section 9) before adding techniques, with no behaviour change in the extraction commit.

- Result form adapts to the protocol's `readout_type`. A live preview of the derived value helps the user, and the database stays authoritative.
- Method used selector, optional link, and a note field. Outbound product names are plain text. A line states BiOGuide is not affiliated with those tools.
- Export file uploader (5 max, 10 MB each), images re-encoded through `stripExifToJpegBlob`, other types uploaded as is, list shown with download links.
- Guided calibration offered only on `colorimetric` protocols, with a link to the printable card.
- Result edit mode with the "Edited" marker. Results edit and delete also appear on `/biolab/mine/`.
- Peer spread card on each protocol page, grouped by technique and method, with n and the "not enough public results yet" state.
- Submit form gains the readout type selector with a short explanation of each type, locked in edit mode once results exist.

### 4.7 Tests

- `test-readout-and-techniques.mjs`: readout lock including private results, technique matches protocol, per-technique validation accept and reject cases, derived value correctness against hand-computed numbers, size cap, unknown keys, `https` only links, edit marker.
- `test-result-files.mjs`: owner-only insert, published-only public read, removed hidden, delete, the 5 file cap, file caps.
- `test-spread.mjs`: under 3 results returns nothing, exactly 3 returns n, median and range, removed and private results excluded, groups split by method.
- Re-run all release 1 suites unchanged.

### 4.8 Release 2 gate and BETA lift

- All suites pass and a separate security review finds no open issue above informational.
- The five official protocols are team-verified and the card PDF is test-printed.
- Calibration validation status is resolved (section 9, item 1).
- Then remove the BETA label for BiOLab from `static/js/site-tutorial.js` (line 39 at time of writing), update the hub pill, `content/_index.md` card wording and the privacy page, apply 047 to 050, deploy, and re-check the live site.

## 5. Content track

All drafts live in `context/biolab-official-protocols/` as markdown, one file per protocol, and are not seeded until approved.

Each draft must include: title, category, readout type, source attribution placeholder for the team to complete, materials, steps, safety notes, what result to submit and in which units, and a verification checklist the team ticks (checked against real lab practice, source cited, safe in the stated setting).

Protocols:
1. Aspirin (Trinder), existing row: refresh the body to the final workflow, readout `colorimetric`.
2. Colony counting, readout `colony_count`.
3. Hemocytometer cell counting, readout `cell_count`.
4. Gel or blot densitometry, readout `densitometry`.
5. Plate readout, readout `plate_readout`.

Calibration card: `context/biolab-session2/reference-card.html` is the existing design (A4 landscape, four patches, two tubes, fiducials). Produce `static/biolab-reference-card.pdf` from it, add print and placement instructions, and test-print on a home printer. The edge function in `supabase/functions/biolab-calibrate-delta/index.ts` expects a 180 mm wide card with 12 mm fiducials, so print scale must be checked.

## 6. Dependencies and order

042 applied, then Release 1 (043 to 046, frontend, tests, review, ship), then Release 2 (047 to 050, frontend, content, tests, review, ship, lift BETA). The content track runs in parallel with the Release 2 build and gates 050.

## 7. Documentation and logging, every session

- Append a row to `AI_INVOLVEMENT_LOG.csv` in the same session, per `AGENTS.md`.
- Update `ARCHITECTURE.md` BiOLab section at the end of each release: lifecycle, owner deletes, staff reads, caps, readout types, technique validation, result files, peer spread, with only claims verified in code.
- Update `tests/biolab/README.md` and `package.json` test script.
- Update `content/privacy/index.md` for revisions, deletion, export files and what staff can see.
- No em dashes and no code comments in any file written or edited.
- Never touch the BiOClash restricted zone.

## 8. Risks

- Instant publishing plus a new upload surface raises abuse exposure. Mitigated by caps, report-and-remove and the daily queue check, but staff removal is dashboard-only and there are no alerts. A report on something unsafe can sit unseen until someone opens the queue.
- Derived-value maths errors would mislead students at scale. Mitigated by the tests against hand-computed values and by showing the inputs beside every derived number.
- Peer spread from self-reported data is only as good as the contributors. The page labels it self-reported and shows n and method.
- Storage orphans on partial delete failures.
- Calibration has never been validated on real devices (section 9, item 1).

## 9. Open items needing the site owner

1. Calibration validation. `context/biolab-session2/README.md` records that real multi-phone and lighting test data is still pending and that nothing should be treated as validated. Decide: finish real-device testing before launch, or launch guided calibration labelled experimental.
2. Biosafety framing for the official protocols. Colony counting, hemocytometry and plate readouts assume school or supervised lab access. Confirm that assumption and the sample choices (for example yeast rather than any human material).
3. Daily cap numbers in 3.4.
4. Planner defaults in this plan: removed protocols are frozen against author edits, staff-removed results and comments cannot be deleted by their owner, staff read reported content only, result UI extracted into its own script, `application/vnd.ms-excel` decision for CSV.
5. Who holds `profiles.is_staff` for the queue, and who checks it daily.
