# Contributing papers to BiOrchive

BiOrchive is BiOGuide's past-paper archive: timed attempts, instant scoring, per-question
solutions, subject tagging, and leaderboards, built from `data/papers/**/*.yaml` and
`content/papers/**`. This document is for people who want to add a new paper by working
directly in the git repository.

## Two ways to contribute a paper

| | Best for | What happens |
|---|---|---|
| [`/papers/contribute/`](https://bioguide.world/papers/contribute/) on the live site | Anyone with an account, no git or coding needed | You upload the exam and answer-key PDFs and a note on where you got them and what license applies. A staff member reviews it, and if it checks out, a future session runs the same pipeline described in this document. |
| This document | People comfortable with git, GitHub, and underlying code themselves | You run the ingestion pipeline yourself, in your own clone, and open a pull request with the finished paper already on the site. |

Both end up going through the same technical pipeline. This document is only about the
second path.

## Before anything else: rights and licensing

This is the step that matters most, and the one place where guessing or assuming causes
real problems. Read this section before opening a single PDF.

BiOGuide's own educational content is licensed under CC BY-NC-SA 4.0 (see
`LICENSE-CONTENT.txt`), and a paper you add becomes part of that. But the exam papers
themselves come from outside organizations, and those organizations set their own terms.
Some exam boards license their papers permissively. Some explicitly forbid redistribution
or electronic storage without direct permission. Some say nothing at all, which is its own
kind of uncertain.

Before ingesting anything:

1. Check the source PDF's own first page, and any page that accompanies it, for a license
   or rights statement.
2. If it says nothing, or says something restrictive, or you are not sure, stop and open an
   issue or ask in the project's usual contact channel before doing any further work. Do not
   ingest a paper on the assumption that "it's probably fine" or "other olympiad papers on
   the site use CC BY-NC-SA so this one probably does too."
3. A pull request that adds a paper without a clear, checkable answer to "what license or
   permission covers this source" will not be mergeable regardless of how well the technical
   ingestion was done.

If you are not sure a paper clears this bar, the `/papers/contribute/` web form is the
safer route: it puts the licensing question in front of a human reviewer before anything is
written to the repository.

## Prerequisites

- Git and a GitHub account.
- OPTIONAL - Helping agent for verification or conduction of audits/fixes.
- Python 3 with `pdfplumber`, `PyMuPDF`, and `openpyxl` (or the csv equivalent) available,
  the same dependencies `scripts/papers_ingest/*.py` already use.
- [Hugo (extended)](https://gohugo.io/installation/) v0.162 or newer, to run the site
  locally and verify the paper before opening a PR.
- The exam PDF and the official answer key or solutions PDF for the paper you want to add,
  already cleared against the rights check above.

## Setup

```bash
git clone https://github.com/nk-008120/boguide.git
cd boguide
git checkout -b add-paper-olympiad-year-round
```

Replace `add-paper-olympiad-year-round` with something specific, for example
`add-paper-usabo-2024-open`.

## The prompts

### If this is the first paper from a new olympiad

Paste this into , with the exam and answer-key PDFs already in the repository
somewhere the agent can read them (for example a scratch folder, or directly under
`static/papers/<olympiad>/<year>/` where they will end up regardless):

```
I want to add a paper from [OLYMPIAD NAME] to BiOrchive. There is no
<olympiad>-paper-ingestion skill for this yet, so use the
paper-ingestion-skill-creator skill first to work through this paper's real
structure and write a new dedicated skill for it, before ingesting anything.

Exam PDF: [path]
Answer key or solutions PDF: [path]
Where I got these and what I know about their license or usage terms: [describe]

Once the new skill exists, use it to actually ingest this paper, following its
own verification checklist before you tell me it's done.
```

### If a skill for this olympiad already exists

```
Use the [olympiad]-paper-ingestion skill to ingest this paper into BiOrchive.

Olympiad: [e.g. usabo]
Year: [e.g. 2024]
Round: [e.g. open-exam]
Exam PDF: [path]
Answer key or solutions PDF: [path]
Where I got these and what I know about their license or usage terms: [describe]

Follow the skill's own verification checklist before telling me it's done, and
tell me honestly about any judgment calls you had to make along the way rather
than just reporting success.
```

Both prompts deliberately ask for the source and license information up front, since that
is the fact the assistant cannot verify on its own and the one most likely to block a PR
later if it is missing.

## How this connects to the rest of the site

A paper that only passes `scripts/papers_ingest/validate.py` is not necessarily a paper
that works everywhere it should. The skills above are written to also cover this, but it is
worth understanding why each piece matters, since it is easy to miss one:

- **Question bank search and filters** (`/papers/question-bank/`) reads directly from
  `hugo.Data.papers`, so a correctly structured `data/papers/<ol>/<year>.yaml` entry appears
  there automatically. The subject tags on each question are what make it filterable and
  searchable by topic; a question with no subject tags, or with a tag typo, is harder to
  find and does not show up in the right topic filter.
- **The study dashboard** depends on a second taxonomy beyond `validate.py`'s check:
  `static/data/topic-graph.json`. A subject tag can point at a real, current resource page
  and still be invisible to the dashboard's mastery grouping if it is not also listed there.
  Both ingestion skills call this out explicitly and include the check to run before calling
  a batch finished.
- **Timed attempts and the leaderboard** only work for a round where every statement is
  `true_false` or `mcq` (`static/js/papers-attempt.js` does not grade `numeric` or
  `free_response` statements). A round with any of those stays practice-mode only, which is
  a legitimate outcome, not a failure, but it needs to be a deliberate decision, not an
  oversight.


## Verification before opening a pull request

Both skills end with a checklist along these lines. Do not skip it just because
`validate.py` passed, since that script never actually loads a page:

- Start Hugo locally (`hugo server --disableFastRender`) and open the new round.
- Answer at least one full question and confirm it scores correctly with explanations
  shown.
- Confirm figures actually render.
- Confirm previous/next navigation works, with no "Previous" on the first question and no
  "Next" on the last.
- Confirm the round's own listing page, the year's listing page, and
  `/papers/question-bank/` all show the new content.
- If timed-attempt mode was enabled, load `/dashboard/` and confirm there are no console
  errors.
- Confirm every subject tag used actually appears in `static/data/topic-graph.json`, not
  just in `validate.py`'s check.

## Opening the pull request

Include, in the PR description:

- The olympiad, year, and round being added.
- The source of the PDFs and the license or permission that covers them, restated plainly
  even though it should already be in your commit history or notes.
- Whether timed-attempt mode was enabled, and if not, why.
- Any judgment calls made during ingestion (an answer-key disagreement, a figure that
  needed manual cropping, a subject tag added to `static/data/topic-graph.json`), the same
  way `ibo-paper-ingestion`'s own worked examples document theirs.
