# BiOGuide

[![Built with Hugo](https://img.shields.io/badge/Built%20with-Hugo-ff4088?style=flat&logo=hugo)](https://gohugo.io/)
[![Hextra Theme](https://img.shields.io/badge/Theme-Hextra-3b82f6?style=flat)](https://github.com/imfing/hextra)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**BiOGuide** is a free, open-core study platform for biology olympiad preparation — covering IBO, USABO, INBO, and other national/international competitions. It combines structured study guides, past-paper practice with timed attempts and scoring, competitive rounds, a protocol archive, and community Q&A into a single site.

**Live:** [bioguide.world](https://bioguide.world)

---

## Product Surface

### Notes@BiOGuide

The core study resource. 15 topic sections with 127+ subtopic pages covering the full IBO syllabus:

| # | Section | Subtopics |
|---|---------|-----------|
| 1 | Cell & Molecular Biology | 23 pages — cell structure, membranes, cytoskeleton, DNA replication, transcription, translation, gene regulation, metabolism, biotechnology |
| 2 | Animal Anatomy | 16 pages — comparative vertebrate systems (skeletal, muscular, nervous, circulatory, respiratory, digestive, excretory, reproductive, endocrine) |
| 3 | Animal Physiology | 13 pages — homeostasis, thermoregulation, osmoregulation, gas exchange, immunity, neural/endocrine signaling |
| 4 | Biosystematics | 7 pages — classification, phylogenetics, cladistics |
| 5 | Plant Physiology | Water transport, mineral nutrition, photosynthesis, hormones, stress responses |
| 6 | Plant Anatomy | 10 pages — tissues, roots, stems, leaves, flowers, fruits, seeds |
| 7 | Genetics | Mendelian inheritance, linkage, population genetics, molecular genetics |
| 8 | Ecology | Population, community, and ecosystem ecology |
| 9 | Ethology | 9 pages — animal behavior, learning, communication, social behavior |
| 10 | Bioinformatics | Sequence alignment, phylogenetics, computational biology |
| 11–14 | Practicals (P1–P4) | Lab techniques, wildlife ethology, plant biology, computational/quantitative methods |
| 15 | Evolution | 11 pages — mechanisms, speciation, adaptation |

Each page follows a consistent structure: Overview, Key Concepts, Comparative Structures, Common Exam Questions, Visual Reference, and Practice Problems.

### BiOrchive

Past-paper practice engine for IBO, INBO, and TBO. Features timed attempts, per-question instant scoring, detailed solutions, and per-round leaderboards. Currently hosts 450+ individual question pages across multiple years and rounds.

### BiOClash

Competitive biology rounds with seasonal scoring. Includes timed block-based attempts, draft saving, anti-cheat tab-monitoring, and a Z-score ranking model.

### BiOLab

Open protocol archive for lab practicals — publish-immediately, community-submitted, with a report-and-remove moderation model.

### Doubts

Staff-answered Q&A system where users can submit biology questions and receive verified responses.

### Dashboard

Personalized study dashboard with mastery tracking, prerequisite-aware recommendations, trend analysis, topic-page badges, and a "weak areas first" toggle. All computed client-side from timed attempt history.

### Prep Guides

Dedicated preparation guides for specific competitions: IBO, USABO, and INBO.

### BiOBytes

Articles and testimonials — competition experiences from medalists (Belgium, Azerbaijan, Slovakia, Turkmenistan), lab recommendations, and topical articles.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Static Site Generator | [Hugo](https://gohugo.io/) v0.162+ (extended) |
| Theme | [Hextra](https://github.com/imfing/hextra) (heavily customized) |
| Backend | [Supabase](https://supabase.com/) — Auth, Postgres, Storage |
| Serverless Functions | Vercel Functions (11 API routes) |
| Hosting | [Vercel](https://vercel.com/) |
| Analytics | [Umami](https://umami.is/) (self-hosted, with Core Web Vitals) |
| Styling | Tailwind CSS + 7,600+ lines of custom CSS |
| Math Rendering | KaTeX (via Hugo's built-in support) |
| Interactive Widgets | Plotly, Vanilla JS, SVG |

### Design Identity

- **Palette:** Lilac (`#8965c4`) + Sage (`#5c7a58`), custom gradient background
- **Typography:** Fraunces (display serif) for headings, Inter for body
- **Themes:** Light / Dark / System / Favourite (a 4th custom theme, the default)
- **Difficulty badges:** Beginner (green), Intermediate (amber), Advanced (purple)

---

## Project Structure

```
content/
  resources/          # Notes@BiOGuide — 15 topic sections, 127+ subtopics
  papers/             # BiOrchive — past papers, questions, leaderboards
  bioclash/           # BiOClash — competitive rounds
  biolab/             # BiOLab — protocol archive
  doubts/             # Q&A
  dashboard/          # Study dashboard
  biobytes/           # Articles & testimonials
  ibo-preparation/    # IBO prep guide
  usabo-preparation/  # USABO prep guide
  inbo-preparation/   # INBO prep guide
api/                  # Vercel serverless functions (11 routes)
static/js/            # Client-side JS (24 files)
assets/css/           # Custom stylesheets
layouts/              # Hugo templates & shortcodes
data/                 # Structured data (challenges, BiOClash config)
```

---

## Local Development

### Prerequisites

- [Hugo (extended)](https://gohugo.io/installation/) v0.162+
- Git
- (Optional) Node.js for theme asset builds

### Setup

```bash
git clone https://github.com/nishit-kalani/bioguide.git
cd bioguide
hugo server --disableFastRender
```

Visit `http://localhost:1313`. Serverless functions and Supabase features require environment variables not included in the repo.

---

## AI Transparency

This project operates under a public AI transparency policy. All AI-assisted changes are disclosed in `AI_INVOLVEMENT_LOG.csv` and governed by the attestation in `AI_ATTESTATION.txt`. BiOClash exam content is a restricted AI-free zone. See `AGENTS.md` for the full policy.

---

## License

Content is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Code components follow the Hextra theme's license terms.
