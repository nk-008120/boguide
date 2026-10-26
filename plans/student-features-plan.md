# Student features plan: close the learning loop

Status: proposal written on 2026-10-12. Nothing here is decided and nothing
is built. Every item marked "proposed" is the planner's suggestion and is
listed again in section 9 for the site owner to confirm or reject.

BiOGuide already holds more material than a student will finish. The aim of
this plan is to connect that material into one loop (learn, test, fix,
retest) and to add a small number of things that students cannot get
elsewhere. It does not add more notes.

## 1. What exists today

Counts were taken from the repository on 2026-10-12.

### Content and data

| Asset | Count | Where |
|---|---|---|
| Note sections | 16 | `content/resources/` |
| Note pages | 132 | `content/resources/**/_index.md` |
| Standalone simulators | 143 | `static/*.html` |
| Attemptable paper years | IBO 2015 to 2024 (9 files), INBO 2026 (1 file) | `data/papers/` |
| Paper problems | 864 | `data/papers/*/*.yaml`, `rounds[].problems[]` |
| Gradable statements | 3505 | `problems[].statements[]` |
| Statements with a written explanation | 3505 of 3505 | `statements[].explanation` |
| Problems with a difficulty label | 343 of 864 | `problems[].difficulty` |
| Question pages that contain an image | 729 of 864 | `content/papers/**/q*/index.md` |
| Topic graph entries | 113 | `static/data/topic-graph.json` |
| Practice challenge sets | 23 files, 113 questions | `data/challenges/` |
| BiOLudo question sets | 30 files | `data/bio-ludo/` |

Each problem carries `subjects[]` with a `name` and a `link` to its note
page. Each topic graph entry carries `slug`, `section`, `difficulty`,
`prerequisites[]` and `syllabus_tags[]`.

### Linking that is already in place

| Shortcode | Note pages using it (of 132) | What it does |
|---|---|---|
| `topic-meta` | 117 | Topic header data |
| `related-questions` | 99 | Lists past paper questions on this topic |
| `iframe` | 89 | Embeds a simulator |
| `practice-challenge` and `challenge-cta` | 23 | Inline practice set |
| `study-next` | 0 | Exists, unused |
| `term` | 0 | Exists, unused in notes |

Notes already link forward to questions. The reverse direction (question to
simulator, wrong answer to note) is the gap.

### Backend that features can reuse

| Piece | Where | Relevance |
|---|---|---|
| Attempt storage | `attempt_reports` table, written by `api/submit-attempt.js` | Holds `subject_stats` and `per_question` |
| Subject spaced review | `subject_review_state` (migration 029), logic in `static/js/papers-knowledge.js` | SM-2 fields at subject level |
| Auth and rate limiting | `api/_lib/auth.js`, `rate_limit_hit` RPC (migration 041) | Shared by every new endpoint |
| Daily job | `api/daily-cron.js`, 05:00 UTC, set in `vercel.json` | One slot for scheduled work |
| Leaderboard views | `leaderboard_per_round`, `leaderboard_overall`, `best_attempt_per_round` | Pattern for public aggregates |
| Community content | `community_solutions`, `content_corrections`, `doubts` tables | Moderation pattern |
| Live sessions | `live_sessions`, `live_registrations` (migration 043) | Hosts for solve-throughs |
| Page ratings | `page_ratings`, `page_ratings_agg` (migration 035) | Existing student feedback signal |
| Analytics | PostHog and GA4 partials in `layouts/partials/scripts/` | Evidence for prioritising |

### One limit that shapes the plan

`attempt_reports.per_question` stores only `{id, number, name, correct,
total}` for each problem. It does not record which statements were wrong,
and the submitted answers are not kept. Any feature that needs
statement-level history (the mistake notebook, statement statistics) starts
collecting from the day it ships. Past attempts cannot be backfilled.

## 2. Principles

1. Reuse data before creating data. Every phase 1 and 2 feature runs on
   questions, figures and explanations that already exist.
2. No new secrets. Past paper answers are already public on the site, so
   features built on them may grade in the browser. Anything ranked
   publicly is graded on the server, as paper attempts are today.
3. Signed-out students get a working version. Progress is kept in the
   browser until they log in.
4. Each feature ships with one measurable success test and is reviewed
   against it after four weeks.
5. Motion and visual treatment follow the existing tier system. New pages
   default to tier 2.

## 3. Phase 1: Daily Figure

Smallest build. Its purpose is to test whether students return daily before
larger work begins.

### What the student sees

- One past paper problem per day that has a figure, with its statements.
- A three minute soft timer, answers, then the official explanations.
- A streak counter and a plain text result they can copy and share.
- A link to the note page for the problem's subject.

### Technical design

- **Question pool.** A curated list in `data/daily/queue.yaml`. Each entry is
  a reference: `olympiad`, `year`, `round`, `problem`. Curation matters
  because not every one of the 729 illustrated problems reads well alone.
  Target: 120 entries before launch, which covers four months.
- **Selection.** The site is static and is not rebuilt daily. A Hugo
  template writes the whole pool to `/data/daily.json` at build time. The
  browser picks the entry at index `daysSinceEpochUTC mod poolLength`. Every
  student gets the same problem on the same UTC day.
- **Page.** `content/daily/_index.md` with a `daily-figure` shortcode and
  `static/js/daily-figure.js`. Rendering and grading reuse the statement
  renderer in `static/js/papers-attempt.js`.
- **Storage.** Signed out: `localStorage`. Signed in: one row per day.

```sql
create table public.daily_results (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  day date not null,
  problem_ref text not null check (char_length(problem_ref) between 1 and 120),
  correct smallint not null check (correct >= 0),
  total smallint not null check (total between 1 and 12),
  created_at timestamptz not null default now(),
  primary key (user_id, day)
);

alter table public.daily_results enable row level security;

create policy daily_results_select_own on public.daily_results
  for select using (auth.uid() = user_id);

create policy daily_results_insert_today on public.daily_results
  for insert with check (
    auth.uid() = user_id
    and day = (now() at time zone 'utc')::date
  );
```

- **Integrity.** The insert policy stops backfilling a streak. Scores are
  graded in the browser and can be faked, which is acceptable only while
  there is no public ranking. If a ranking is wanted, grading moves to a new
  `api/daily-submit.js` that follows `api/submit-attempt.js`.
- **Account deletion.** The cascade on `user_id` covers it. No storage
  bucket is involved.

### Work list

1. Curate the first 120 queue entries.
2. Build-time template for `/data/daily.json`.
3. Page, shortcode, script and stylesheet.
4. Migration and RLS test in `tests/rls/`.
5. Streak tile on the dashboard next to the existing streak grid.
6. Entry point on the home page and in the menu.

### Effort, risk, success test

- Effort: about one week.
- Risk: the pool repeats after it runs out. Mitigation: the script warns
  staff when fewer than 30 unseen days remain.
- Success test: four weeks after launch, at least 25 percent of students who
  play once play on three or more days in the following week.

## 4. Phase 2: Mistake notebook

Largest learning gain. Reviewing one's own errors on a schedule is worth
more than attempting new papers.

### What the student sees

- A page at `/dashboard/mistakes/` listing statements they got wrong,
  grouped by subject.
- A "due today" queue. Each card shows the statement, its figure, the
  official explanation, a link to the note page and, where one exists, a
  simulator.
- After answering, the card is rescheduled. A statement answered correctly
  three times in a row leaves the queue.

### Technical design

- **Step 1, record statement results.** `recompute()` in
  `api/submit-attempt.js` already decides `isCorrect` for every statement
  (lines 48 to 61) and then discards it. Add a `wrong_statements` jsonb
  column to `attempt_reports` holding `[{ "q": "q1", "l": "A" }]` for
  incorrect statements only. Storing only the wrong ones keeps rows small.
- **Step 2, review state.** A new table modelled on
  `subject_review_state`, one row per student per statement.

```sql
create table public.statement_review_state (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  olympiad text not null check (char_length(olympiad) between 1 and 20),
  year text not null check (char_length(year) between 1 and 10),
  round_id text not null check (char_length(round_id) between 1 and 60),
  problem_id text not null check (char_length(problem_id) between 1 and 20),
  letter text not null check (char_length(letter) between 1 and 4),
  ease_factor numeric not null default 2.5 check (ease_factor >= 1.3),
  interval_days integer not null default 1 check (interval_days >= 1),
  repetitions integer not null default 0 check (repetitions >= 0),
  due_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, olympiad, year, round_id, problem_id, letter)
);

create index idx_statement_review_due on public.statement_review_state (user_id, due_at);

alter table public.statement_review_state enable row level security;

create policy statement_review_select_own on public.statement_review_state
  for select using (auth.uid() = user_id);

create policy statement_review_update_own on public.statement_review_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

- **Step 3, populate.** `api/submit-attempt.js` upserts one row per wrong
  statement with the service role after the attempt row is saved. Students
  have no insert policy, so the queue cannot be stuffed from the browser.
- **Step 4, schedule.** Reuse the SM-2 update already written in
  `static/js/papers-knowledge.js`. Move it into a shared function so the
  subject and statement schedulers cannot drift apart.
- **Step 5, page.** `content/dashboard/mistakes/index.md`,
  `static/js/papers-mistakes.js`. Statement text and explanations come from
  the paper data already published per round.
- **Step 6, simulator links.** No data maps topics to simulators today
  beyond the `iframe` calls inside note pages. Extract those 89 pages'
  embeds at build time into `/data/sim-map.json`, keyed by note page link.

### Limits

- Starts empty for everyone. Attempts made before launch carry no statement
  detail.
- Upper bound is 3505 rows per student. No pagination problem.
- Practice challenges and BiOClash rounds are out of scope for version 1.

### Work list

1. Migration: `wrong_statements` column and `statement_review_state`.
2. `submit-attempt.js` change, with a grading unit test in `tests/grading/`.
3. RLS tests: own rows only, no client insert.
4. Shared scheduler function and its test.
5. Mistakes page, script and stylesheet (`body.fx`, dashboard tokens).
6. Build-time simulator map.
7. Dashboard card: "N statements due today".
8. `api/delete-account.js`: no change needed, cascade covers the table.

### Effort, risk, success test

- Effort: about three weeks.
- Risk: students with few attempts see an empty page. Mitigation: the page
  offers a short diagnostic set drawn from their weakest subject.
- Success test: students who review at least ten statements improve their
  score on those subjects in their next attempt more than students who do
  not. Measured from `subject_stats`.

## 5. Phase 3: Virtual practical bench

Strongest differentiator. Practical exams are half of IBO and most students
have little lab access.

### Scope for version 1

Four task types, chosen because each can be graded automatically.

| Task | Student does | Graded by | Builds on |
|---|---|---|---|
| Dilution planner | Plans a serial dilution to hit target concentrations within a volume budget | Numeric tolerance per tube | Numeric statement type (`expected`, `tolerance`) |
| Standard curve | Reads absorbances, fits a line, reports an unknown | Numeric tolerance | BiOLab colorimetry, biostatistics section |
| Gel reading | Assigns band sizes and identifies lanes on a generated gel | Exact match and tolerance | Existing gel simulators in `static/` |
| Dichotomous key | Keys out specimens from drawings | Exact match | Biosystematics section |

### Technical design

- **Task definition.** One YAML file per task in `data/bench/`, with a
  `type`, parameters, and a seed range. Each attempt draws a seed so numbers
  differ between students and between retries.
- **Generation.** A seeded generator per task type in
  `static/js/bench/<type>.js`. The grading unit tests already cover a
  seeded shuffle, so the same approach is tested here.
- **Grading.** In the browser for practice mode. A timed, ranked mode would
  need `api/bench-submit.js` to regenerate the task from the seed on the
  server and grade there, so the expected values never reach the client.
- **Storage.** One table.

```sql
create table public.bench_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  task_id text not null check (char_length(task_id) between 1 and 80),
  seed integer not null,
  score numeric not null check (score between 0 and 1),
  duration_sec integer not null check (duration_sec between 0 and 14400),
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.bench_attempts enable row level security;

create policy bench_attempts_select_own on public.bench_attempts
  for select using (auth.uid() = user_id);

create policy bench_attempts_insert_own on public.bench_attempts
  for insert with check (auth.uid() = user_id);
```

- **Pages.** `content/bench/_index.md` as a hub and one page per task,
  linked from the four practical note sections (11 to 14).
- **Rate limit.** A daily insert cap following the write-limit pattern in
  migration 045.

### Work list

1. Write the task specification and marking scheme for each of the four
   types, reviewed by someone who has sat an IBO practical.
2. Seeded generators and their unit tests.
3. Task pages and a shared timer and answer sheet component.
4. Migration, RLS tests, rate limit.
5. Dashboard section: practical readiness per task type.
6. Hub page and links from practical notes.

### Effort, risk, success test

- Effort: six to eight weeks for four task types.
- Risk: tasks that feel unlike the real practical teach the wrong habits.
  Mitigation: step 1 above, and a "BETA" label until two alumni have
  reviewed each task.
- Success test: at least half of students who start a task finish it, and
  the page rating averages 4 of 5 or higher.

## 6. Phase 4: improvements to what exists

Small items that can be scheduled between the phases above.

| Item | What changes | Technical basis | Effort |
|---|---|---|---|
| Question to simulator links | Each question page shows the simulator for its subject | `/data/sim-map.json` from phase 2, rendered by `problem-meta` | 2 days |
| Fill linking gaps | 33 note pages lack `related-questions`, 43 lack a simulator, 109 lack a practice set | Audit list generated from the shortcode counts in section 1 | Ongoing content work |
| Statement statistics | After an attempt: "62 percent got this wrong", and a hardest statements list | Aggregate view over `wrong_statements`, exposed like `leaderboard_per_round`, minimum 20 attempts before a figure is shown | 1 week, after phase 2 |
| Difficulty labels | The 521 unlabelled problems get a label from real results | Derived from the same aggregate, written back to the YAML by a script | 3 days, after statistics |
| Syllabus map | The topic graph drawn as a tree, coloured by the student's mastery | 113 entries with `prerequisites[]`; mastery from `subject_stats` | 2 weeks |
| Solve-throughs | A recorded walkthrough on each paper that a live session covered | `live_sessions` gains an optional `recording_url`; shown by `papers-rounds` | 3 days plus recording work |
| More papers | USABO and NSEB have preparation pages but no attemptable papers | Existing ingestion pipeline in `scripts/papers_ingest/` and the contribution flow | Per paper |
| Use `study-next` | The unused shortcode goes on every note page, driven by `prerequisites[]` | Topic graph | 2 days |

## 7. Phase 5: larger ideas, not yet designed

These need a decision on direction before any design work.

| Idea | Student value | Main technical question |
|---|---|---|
| Duels | Challenge a friend to the same ten statements | Asynchronous (two rows compared later) is simple; live needs Supabase Realtime, which the site does not use today |
| Peer-marked reasoning | Trains written answers, which BiOClash grades by hand | Needs a rubric per question, a calibration step and moderation. Reuses the `doubts` reporting pattern |
| Country cohorts | A page per country with its selection calendar and who else is preparing | `static/data/olympiad-programmes.json` and `profiles.country` exist. Privacy review needed before showing any student list |
| Offline packs | Printable notes and flashcard export for poor connections | A print stylesheet is cheap. Flashcard export needs the unused `term` shortcode adopted first |
| Translated glossary | Key terms in the languages of the students already on the site | `data/horizon_terms.yaml` is the starting list. Needs volunteer translators and a review step |

## 8. Order and dependencies

```
Phase 1  Daily Figure            no dependencies
Phase 2  Mistake notebook        no dependencies
Phase 4  Statement statistics    needs phase 2 (wrong_statements)
Phase 4  Difficulty labels       needs statement statistics
Phase 4  Question to simulator   needs phase 2 (sim map)
Phase 3  Virtual practical bench no dependencies, longest build
Phase 5  Any item                needs an owner decision first
```

Proposed sequence: phase 1, then phase 2, then the phase 4 items that
phase 2 unlocks, then phase 3. Phase 3's task specifications can be written
in parallel from the start because they need no code.

Every new table follows the existing rules: row level security on, tests in
`tests/rls/`, a row in the privacy page's data list, and coverage in
`api/delete-account.js` or by cascade.

## 9. Decisions needed from the site owner

All proposed, none confirmed.

1. Is the sequence in section 8 right, or should the practical bench come
   first because it is the differentiator?
2. Daily Figure: private streak only, or a public ranking (which moves
   grading to the server)?
3. Daily Figure: is a new top-level menu entry acceptable, given the menu is
   already dense?
4. Mistake notebook: is it acceptable that it starts empty for existing
   students?
5. Practical bench: which four task types, and who reviews them?
6. Statement statistics: is 20 attempts the right minimum before showing a
   percentage?
7. Phase 5: which ideas, if any, go forward to design?

## 10. What this plan does not know

- Which sections students return to, and where attempts are abandoned. The
  PostHog data and `page_ratings` were not read for this plan. If most
  students never finish a paper, shorter practice sets matter more than the
  mistake notebook, and the order in section 8 should change.
- How many of the 729 illustrated problems stand alone well enough for the
  daily queue. That is found during curation.
- Whether the effort figures hold. They assume one developer and are
  estimates, not commitments.
