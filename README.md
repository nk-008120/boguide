# BiOGuide

[![Built with Hugo](https://img.shields.io/badge/Built%20with-Hugo-ff4088?style=flat&logo=hugo)](https://gohugo.io/)
[![Hextra Theme](https://img.shields.io/badge/Theme-Hextra-3b82f6?style=flat)](https://github.com/imfing/hextra)
[![Code License: MIT](https://img.shields.io/badge/Code%20License-MIT-blue.svg)](LICENSE-CODE.txt)
[![Content License: CC BY-NC-SA 4.0](https://img.shields.io/badge/Content%20License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**BiOGuide** is a free, open-core study platform for biology olympiad preparation, covering IBO, USABO, INBO, and other national/international competitions. It combines structured study guides, past-paper practice with timed attempts and scoring, competitive rounds, a protocol archive, and community Q&A into a single site.

**Live:** [bioguide.world](https://bioguide.world)

---

## Product Surface

### Notes@BiOGuide

The core study resource. 15 topic sections with 127+ subtopic pages covering the full IBO syllabus:

| # | Section | Subtopics |
|---|---------|-----------|
| 1 | Cell & Molecular Biology | 23 pages: cell structure, membranes, cytoskeleton, DNA replication, transcription, translation, gene regulation, metabolism, biotechnology |
| 2 | Animal Anatomy | 16 pages: comparative vertebrate systems (skeletal, muscular, nervous, circulatory, respiratory, digestive, excretory, reproductive, endocrine) |
| 3 | Animal Physiology | 13 pages: homeostasis, thermoregulation, osmoregulation, gas exchange, immunity, neural/endocrine signaling |
| 4 | Biosystematics | 7 pages: classification, phylogenetics, cladistics |
| 5 | Plant Physiology | Water transport, mineral nutrition, photosynthesis, hormones, stress responses |
| 6 | Plant Anatomy | 10 pages: tissues, roots, stems, leaves, flowers, fruits, seeds |
| 7 | Genetics | Mendelian inheritance, linkage, population genetics, molecular genetics |
| 8 | Ecology | Population, community, and ecosystem ecology |
| 9 | Ethology | 9 pages: animal behavior, learning, communication, social behavior |
| 10 | Bioinformatics | Sequence alignment, phylogenetics, computational biology |
| 11–14 | Practicals (P1–P4) | Lab techniques, wildlife ethology, plant biology, computational/quantitative methods |
| 15 | Evolution | 11 pages: mechanisms, speciation, adaptation |

Each page follows a consistent structure: Overview, Key Concepts, Comparative Structures, Common Exam Questions, Visual Reference, and Practice Problems.

### BiOrchive

Past-paper practice engine for IBO, INBO, and TBO. Features timed attempts, per-question instant scoring, detailed solutions, and per-round leaderboards. Currently hosts 450+ individual question pages across multiple years and rounds.

### BiOClash

Competitive biology rounds with seasonal scoring. Includes timed block-based attempts, draft saving, anti-cheat tab-monitoring, and a Z-score ranking model.

### BiOLab

Open protocol archive for lab practicals: publish-immediately, community-submitted, with a report-and-remove moderation model.

### Doubts

Staff-answered Q&A system where users can submit biology questions and receive verified responses.

### Dashboard

Personalized study dashboard with mastery tracking, prerequisite-aware recommendations, trend analysis, topic-page badges, and a "weak areas first" toggle. All computed client-side from timed attempt history.

### Prep Guides

Dedicated preparation guides for specific competitions: IBO, USABO, and INBO.

### BiOBytes

Articles and testimonials: competition experiences from medalists (Belgium, Azerbaijan, Slovakia, Turkmenistan), lab recommendations, and topical articles.

### BiOLudo

A childhood ludo variant integrated with biology quizzes to create the first interactive fun and learning game for BiOlogy enthusiasts when they are bored. Special question bank of its own.

### About, Tribute sections

Visit /about and /tribute

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Static Site Generator | [Hugo](https://gohugo.io/) v0.162+ (extended) |
| Theme | [Hextra](https://github.com/imfing/hextra) (heavily customized) |
| Backend | [Supabase](https://supabase.com/): Auth, Postgres, Storage |
| Serverless Functions | Vercel Functions (11 API routes) |
| Hosting | [Vercel](https://vercel.com/) |
| Analytics | [Umami](https://umami.is/) (self-hosted, Core Web Vitals + country stats), [PostHog](https://posthog.com/) (EU-hosted, product-analytics events only, no session recording), [Google Analytics 4](https://analytics.google.com/) |
| Error Tracking | [Sentry](https://sentry.io/) (API layer only, opt-in via `SENTRY_DSN`) |
| Styling | Tailwind CSS + 7,600+ lines of custom CSS |
| Math Rendering | KaTeX (via Hugo's built-in support) |
| Interactive Widgets | Plotly, Vanilla JS, SVG |

### Design Identity

- **Palette:** Lilac (`#8965c4`) + Sage (`#5c7a58`), custom gradient background (for-her).
- **Typography:** Fraunces (display serif) for headings, Inter for body
- **Themes:** Light / Dark / System / Favourite (a 4th custom theme, the default)
- **Difficulty badges:** Beginner (green), Intermediate (amber), Advanced (purple)

---

## Project Structure

Explained in detail in ARCHITECTURE.md

Mermaid.js for GitDiagram:

flowchart TD

subgraph group_learning["Published Learning"]
  node_prep["Olympiad Guide<br/>content surface"]
  node_ibo["IBO Guide<br/>content surface"]
  node_papers["Past Papers<br/>content surface"]
  node_clashpages["BiOClash Pages<br/>content surface"]
  node_labarchive["Protocol Archive<br/>content surface"]
  node_dashboard["Study Dashboard<br/>content surface"]
  node_doubts["Doubts Q&amp;A<br/>content surface"]
  node_biobytes["BiOBytes Content<br/>content surface"]
end

subgraph group_contributions["BiOrchive Contributions"]
  node_papersauth["Papers Auth Client<br/>browser auth client"]
  node_review["Review Console<br/>staff review UI"]
  node_ingest["Paper Ingestion<br/>assembly pipeline"]
end

subgraph group_bioclash["BiOClash Runtime"]
  node_attemptapi["Attempt State API<br/>POST API"]
  node_bioclashcore["BiOClash Core<br/>domain service"]
  node_admin["BiOClash Operations<br/>operations handler"]
end

subgraph group_biolab["BiOLab Calibration"]
  node_calibrate["Calibration Function<br/>POST function"]
end

subgraph group_external["External Services"]
  node_identity["Supabase Identity<br/>auth service"]
  node_attemptdb[("Attempt Database<br/>state store")]
  node_storage[("Contribution Storage<br/>object storage")]
end

subgraph group_actors["External Actors"]
  node_learner["Learner Browser<br/>external actor"]
  node_reviewer["Staff Reviewer<br/>external actor"]
end

node_learner -->|"POST paper ID"| node_attemptapi
node_attemptapi -->|"invoke runtime"| node_bioclashcore
node_bioclashcore -->|"validate token"| node_identity
node_attemptapi -->|"read and write state"| node_attemptdb
node_attemptapi -->|"return state"| node_learner
node_admin -->|"load and grade"| node_bioclashcore
node_admin -->|"finalize results"| node_attemptdb
node_reviewer -->|"open console"| node_review
node_review -->|"get session"| node_papersauth
node_papersauth -->|"manage auth"| node_identity
node_review -->|"review submissions"| node_attemptdb
node_review -->|"sign file URLs"| node_storage
node_ingest -->|"generate paper content"| node_papers
node_learner -->|"POST calibration image"| node_calibrate
node_calibrate -->|"verify token"| node_identity

click node_prep "https://github.com/nk-008120/boguide/tree/main/content/biology-olympiad-preparation"
click node_ibo "https://github.com/nk-008120/boguide/tree/main/content/ibo-preparation"
click node_papers "https://github.com/nk-008120/boguide/tree/main/content/papers"
click node_clashpages "https://github.com/nk-008120/boguide/tree/main/content/bioclash"
click node_labarchive "https://github.com/nk-008120/boguide/tree/main/content/biolab"
click node_dashboard "https://github.com/nk-008120/boguide/tree/main/content/dashboard"
click node_doubts "https://github.com/nk-008120/boguide/tree/main/content/doubts"
click node_biobytes "https://github.com/nk-008120/boguide/tree/main/content/biobytes"
click node_papersauth "https://github.com/nk-008120/boguide/blob/main/static/js/papers-auth.js"
click node_review "https://github.com/nk-008120/boguide/blob/main/static/js/papers-contribute-review.js"
click node_ingest "https://github.com/nk-008120/boguide/blob/main/scripts/papers_ingest/assemble.py"
click node_attemptapi "https://github.com/nk-008120/boguide/blob/main/api/bioclash-attempt-state.js"
click node_bioclashcore "https://github.com/nk-008120/boguide/blob/main/api/_lib/bioclash.js"
click node_admin "https://github.com/nk-008120/boguide/blob/main/api/bioclash-admin.js"
click node_calibrate "https://github.com/nk-008120/boguide/blob/main/supabase/functions/biolab-calibrate-delta/index.ts"

classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a
classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554
classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337
classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81
classDef toneTeal fill:#ccfbf1,stroke:#0f766e,stroke-width:1.5px,color:#134e4a
class node_prep,node_ibo,node_papers,node_clashpages,node_labarchive,node_dashboard,node_doubts,node_biobytes toneBlue
class node_papersauth,node_review,node_ingest toneAmber
class node_attemptapi,node_bioclashcore,node_admin toneMint
class node_calibrate toneRose
class node_identity,node_attemptdb,node_storage toneIndigo
class node_learner,node_reviewer toneTeal


---

## Local Development

### Prerequisites

- [Hugo (extended)](https://gohugo.io/installation/) v0.162+
- Git
- (Optional) Node.js for theme asset builds

### Setup

```bash
git clone https://github.com/nk-008120/boguide.git
cd boguide
hugo server --disableFastRender
```

Visit `http://localhost:1313`. Serverless functions and Supabase features require environment variables not included in the repo.

---

## Architecture and Security

See [ARCHITECTURE.md](ARCHITECTURE.md) for how the stack fits together, the RLS-as-security-boundary model, and the reasoning behind BiOClash's anti-cheat design, BiOLab's open-archive model, and the ingestion pipeline. See [SECURITY.md](SECURITY.md) for the security posture and how to report a vulnerability.

Two test suites verify RLS behavior against real Postgres (`tests/biolab/`, `tests/rls/`), both run in CI on every push and PR.

---

## Contributing

Want to add a past paper to BiOrchive yourself, using git and your own pipeline? See
[CONTRIBUTING_PAPERS.md](CONTRIBUTING_PAPERS.md) for the workflow, the licensing checks a
paper has to clear first, and the prompts to use. If you would rather hand off a paper
without touching the repository, use the in-browser form at
[bioguide.world/papers/contribute/](https://bioguide.world/papers/contribute/) instead.

---

## AI Transparency

This project operates under a public AI transparency policy. All AI-assisted changes are disclosed in `AI_INVOLVEMENT_LOG.csv` and governed by the attestation in `AI_ATTESTATION.txt`. BiOClash exam content is a restricted AI-free zone. See `AGENTS.md` for the full policy.

---

## License

BiOGuide is dual-licensed:

- **Code** (`layouts/`, `static/js/`, `api/`, `assets/css/`, `scripts/`) is licensed under [MIT](LICENSE-CODE.txt).
- **Educational content** (`content/`, including `content/bioclash/`, and `data/`, including `data/bioclash/`) is licensed under [CC BY-NC-SA 4.0](LICENSE-CONTENT.txt). BiOClash content is additionally governed by the AI-Free policy in `AGENTS.md`.

The vendored [Hextra](https://github.com/imfing/hextra) theme under `themes/hextra/` retains its own license terms.
