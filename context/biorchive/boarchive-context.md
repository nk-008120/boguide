# BioGuide Papers Archive — Context Handoff

**Status as of 2026-08-09: superseded — this is the original pre-build
research/planning doc, kept as a historical record of the design rationale,
not as current state.** The papers archive (BiOrchive) described here as a
future/undecided thing has long since been built and is live at
`/papers/`, with real IBO 2022/2024 content, a login/leaderboard layer, and
now (2026-08-09) a "BiOClash Champions" section too. **For current, accurate
state, read `papers-ingestion-workflow.md`** (exam completion status,
ingestion process) **and `LOGIN_ROADMAP.md`** (login/leaderboard
architecture) instead of this file. The "Open questions" section below was
answered long ago (the answers: MVP first not full aoXiv parity, IBO/USABO
real exam PDFs as the actual content source, Hugo `data/*.yaml` as the data
architecture, no contribute/login flow for content itself, extend the
site's own identity rather than a separate sub-brand) — none of that
resolution is recorded here, only in what was actually built. Kept around
because the aoXiv research itself is still accurate and might be useful if
the "comparable to aoXiv" ambition is ever revisited at greater scope.

**Purpose (original, historical):** orient a fresh context window to build a Biology Olympiad papers archive comparable to [aoxiv.aoguide.app](https://aoxiv.aoguide.app) (astronomy olympiad archive, sister project to aoguide.app — the same site whose CSS/design language inspired the "Favourite" theme this session; see `aesthetics-context.md`). This is a **new, large feature**, separate from the aesthetics work — different scope, likely different implementation approach. This doc is research, not a locked plan; verify anything load-bearing yourself before building.

## What aoXiv actually is (researched directly, not guessed)

- **Content**: 13 olympiads (IOAA, INAO, USAAAO, BAAO, CAAO, etc. — international/regional/national/open), spanning 109 years total, 456 files. Each olympiad has its own archive page listing every year it has data for, most recent first.
- **Per-year structure**: location, `N rounds · N problems`, a "Results" link. Broken into **rounds** (Theory, Data Analysis, Planetarium, Sky Map, Telescope, Group Competition, Observation, Team Competition — varies by olympiad/year), each with exam duration and round-level links (Problems / Solutions / Answer sheet / Instructions / Grading scheme — not all present every year). Within each round, **individual problems** are listed by code (T1, D1, OP1...) with a short title and point value.
- **Auth is not required to browse.** Direct quote from the login page: *"Only contributors need an account. Browsing olympiad problems is open to everyone — no sign-in required."* Login is GitHub OAuth, gated to a **contribute/admin workflow** for people adding new data — not a reader-facing feature at all. This is the single most important scoping fact: **the core archive needs zero backend.**
- **Tech stack** (from the public, MIT-licensed [source repo](https://github.com/bunchofcellulose/aoXiv)): SvelteKit + TypeScript, Drizzle ORM + a real database — but **only for the auth/contribute/admin layer**. Per their own README: *"Browsing works without any configuration. Authentication (login/profile/contribute/admin) stays disabled until the environment variables below are set."*
- **The actual archive data is just YAML + PDF files on disk**, not a live database:
  ```
  static/contests/
    <contest-id>/
      index.yaml          # competition metadata: id, name, shortName, website, summary, icon, tag (International/Regional/National/Open), url, desc
      2025/
        2025.yaml          # this year's data: name, location, link, problemsLink, papers[], problems[]
        <pdf files...>
  ```
  `papers[]` entries carry `category`, `link`/`solutionLink`/`answerSheet`/`gradingScheme`/`results`/`additionalFiles`, `examDuration`, participant counts (`n`, `camp`, `gold`/`silver` cutoffs), and a `scores` matrix (row 1 = totals, subsequent rows = per-problem scores). `problems[]` entries carry `id`, `number`, `name`, `category`, `author`, `maxScore`, and the same link fields. Full schema is in their README — read it again directly if you need exact field names, don't rely on memory of this doc for the complete list.

**Why this matters for BioGuide:** aoXiv's own core data model is filesystem-based (YAML + PDFs), not actually dependent on their database. That means a Hugo-native equivalent — Hugo `data/` files (or front matter) driving a custom layout, PDFs in `static/`—can realistically achieve comparable *browsing* functionality without adopting a whole new stack. The database/auth layer is genuinely optional and can be deferred indefinitely (or replaced with something much simpler, like a Google Form, matching how this project already crowdsources input elsewhere).

## Current BioGuide state (as of this handoff)

- `content/papers/_index.md` is a **placeholder stub** — title + one sentence, no structure, no links. This is a from-scratch build, not a refactor.
- **Zero backend anywhere in the project.** Confirmed by direct search: no Firebase, no auth, no database, no `api/`/`functions/` directories, no relevant env vars. `vercel.json` only defines a static redirect. This is a 100% static Hugo/Hextra site.
- Existing PDF-hosting precedent already exists and should be followed for consistency: small/curated PDFs live directly in `static/` and are linked with plain `<a href="/file.pdf">` (see `content/resources/10-bioinformatics/_index.md`, `14-practical-4/_index.md`); larger/bulk collections are external Google Drive folder links (see `content/resources/_index.md`, "Practice Papers & Solutions"). Neither is indexed or browsable today — both are manually placed links.
- The site's established visual identity (lilac/sage, Fraunces/Inter, difficulty-color system — full detail in `aesthetics-context.md`) exists and works well; a papers archive should probably feel like *part of BioGuide*, not a bolted-on separate app — though note aoXiv itself is visually its own thing, distinct from aoguide.app's own site design, so there's precedent either way. This is a real open decision, not a settled one — see below.

## Open questions the next session needs to resolve before building

1. **Scope of "comparable"** — full parity (multi-olympiad, multi-round, per-problem breakdown, scores/cutoffs, results) is a lot of data entry/collection work, separate from the engineering. Is the full aoXiv-style depth wanted from day one, or an MVP (e.g. just IBO + USABO, problems-and-solutions only, no scores/cutoffs/results matrices) that grows over time?
2. **Which olympiads/years/papers actually get archived first**, and where that content comes from — this is a real content-sourcing job, not just a template. The existing "Practice Papers" Google Drive folder (referenced in `content/resources/_index.md`) may be a starting source; confirm what's actually available to seed this with.
3. **Data architecture**: Hugo `data/*.yaml` (site-wide, not tied to a content page) vs. per-olympiad content bundles with structured front matter vs. something else. Recommend prototyping with one olympiad's worth of real data before committing to a schema, since the shape needs to survive contact with real, messy source PDFs (missing years, missing solutions, varying round structures).
4. **Is a contribute/login flow in scope at all**, even later? If genuinely needed eventually, that's the point where this stops being a pure-Hugo job — flag that decision explicitly rather than half-building toward it.
5. **Visual identity** — extend BioGuide's existing lilac/sage system, or give this its own distinct sub-brand (as aoXiv does relative to aoguide.app)? Get a decision before writing CSS.
6. **Search/filter** — aoXiv has a "Search problems" and per-olympiad "Search olympiads" input plus tag filters (All/International/Regional/National/Open). A static site can approximate this client-side (e.g. a prebuilt JSON index + a small JS filter, similar in spirit to how Hextra's own search already works) — don't assume a server-side search is required.

## Suggested first steps for the next session

1. Re-verify this doc's claims about aoXiv live (things change) and re-check `content/papers/_index.md` hasn't been touched since.
2. Get the open questions above answered **before** writing code — this is a big enough feature that guessing on data architecture will be expensive to unwind.
3. Prototype small: pick one real olympiad (IBO is the obvious first candidate given this site's focus) with a handful of real years/papers, get the data schema and rendering right end-to-end for that one case, *then* decide whether to template it out further.
