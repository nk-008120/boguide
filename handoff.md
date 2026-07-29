# BioGuide — AI Handoff (Review → Implementation)

**Written:** 2026-07-29. **Purpose:** carry the findings and decisions from the BioGuide codebase review/roadmap conversation into a fresh conversation for implementation, without re-running the audit.

**Full review artifact (all 10 sections, roadmap, benchmarks):** https://claude.ai/code/artifact/237e0bc6-1c0a-486a-ac58-a4ae8963c147

---

## Project

BioGuide — free, open-core Hugo (Hextra theme) study site for biology olympiad students (IBO/USABO/INBO). Live at boguide.vercel.app, private GitHub repo, root at `C:\NK\boguide`. Content is CC BY-NC-SA; future paid add-ons (AI help, competition platform) planned separately.

## What happened in the prior conversation

Ran a full codebase audit (via an Explore subagent + direct file reads) and a live browser check of boguide.vercel.app (mobile + desktop viewports), plus a live fact-check of AOGuide (aoguide.app) to ground the competitive comparison instead of guessing. Produced a 10-section review (architecture, content/pedagogy, UX, technical innovation, workflow, performance/SEO/a11y, monetization, 6-month roadmap, benchmarks, final recommendations), published as the artifact linked above.

## Verified findings that matter for implementation

1. **Mobile sidebar bug — root cause confirmed, fix identified, not yet applied.**
   - `hugo.toml:31-42`: `[[menu.main]]` entries for `"   Biochemistry"` and `"   Cell Biology"` use `parent = "Resources & Notes"` (same parent as `"1. Cell & Molecular Biology"`, not nested under it) plus fake indentation via 3 literal leading spaces in the `name` string, which HTML collapses to nothing. Result: these render as flat, unindented siblings instead of sub-items.
   - Hextra's real content-tree sidebar (driven by `content/resources/1-cell-molecular/{Biochemistry,Cell-Biology,Molecular-Biology}/_index.md`) already renders these correctly nested elsewhere on the same page — confirmed live via the accessibility tree on the deployed mobile menu (two duplicate sidebar blocks stack on top of each other; only the content-tree-driven one has a working "Toggle section" button).
   - `assets/css/custom.css:342-385` contains a **dead** attempted fix: `!important` rules targeting `.hx\:menu-item`, a class that doesn't exist anywhere in the theme (real class is `hextra-sidebar-item`).
   - **Fix**: delete the two duplicate `[[menu.main]]` entries (hugo.toml:31-42) and delete `custom.css:342-385`. Longer term, stop hand-maintaining `[menu.main]` as a shadow content tree — keep it only for `Papers`/`About`/`Articles`/`Discord`/one `/resources/` link.

2. **47MB copyrighted textbook PDF** at `static/books/Lehninger Principles of Biochemistry.pdf` — likely a full copy of a commercial textbook served publicly. Flagged as a legal risk, recommended for removal/replacement first, before other work. **Not yet resolved — needs a decision from the user, not just a code fix.**

3. **Duplicate/conflicting math + chart loading**:
   - KaTeX is the real theme default (`params.math.engine`, dead `[markup.katex]` config in `hugo.toml:9-10` does nothing), but 5 content files independently hardcode MathJax `<script>` tags with duplicated config: `content/resources/1-cell-molecular/_index.md:6`, `Biochemistry/_index.md:7`, `10-bioinformatics/_index.md:7`, `14-practical-4/_index.md:6`, `8-ecology/_index.md:7`. Both engines load simultaneously — wasted bandwidth, possible rendering conflicts.
   - Plotly loads twice on `content/resources/8-ecology/_index.md` (lines 134 and 345).
   - Dead orphan partials never called by anything: `layouts/partials/custom-head.html`, `head-custom.html`, `katex.html`.

4. **Content gaps**: `content/resources/1-cell-molecular/Cell-Biology/_index.md` and `Molecular-Biology/_index.md` are empty; `content/resources/7-genetics/_index.md` has no front matter at all; 7 of 14 top-level sections are boilerplate "coming soon" placeholders. No Evolution section exists at all.

5. **No CI/build pipeline** — no root `package.json`, no GitHub Actions, no Hugo version pin. The theme ships its own Playwright accessibility + mobile-menu tests (`themes/hextra/package.json`) that are never run.

6. **iframe shortcode** (`layouts/shortcodes/iframe.html`) has no `title` attribute and no `loading="lazy"` — a11y and perf gap, one-line fix (given in the artifact, §6).

## Roadmap agreed (Month 1 quick wins, ~5.5 person-days)

1. Fix sidebar bug (delete duplicate menu entries + dead CSS) — 0.5d
2. Resolve the 47MB textbook PDF — 0.5d + a legal/content decision from the user
3. Consolidate MathJax → KaTeX only, delete dead partials — 1d
4. Fix Plotly double-load, lazy-load simulators — 0.5d
5. Fill `7-genetics` front matter, resolve empty Cell-Biology/Molecular-Biology files — 1d
6. iframe `title` + `loading="lazy"`, add `static/robots.txt` — 0.5d
7. Verify/surface the theme's existing FlexSearch UI — 0.5d
8. Wire up the theme's existing Playwright a11y tests in CI — 1d

Medium-priority (months 2-4) and long-term (months 5-6+) items, plus the full content/pedagogy/UX/monetization strategy and AOGuide benchmarking, are in the artifact linked at the top — not repeated here to keep this file short.

## Status as of handoff

**Nothing has been implemented yet** — the prior conversation was audit + strategy only, no code was changed. The next conversation's job is to start executing the Month 1 list above, starting with item 1 (sidebar fix) since it's fully specified and needs no further decisions.

## Open question for the user

Item 2 (the 47MB PDF) needs a decision before it can be executed: delete it outright, or replace with a link to a legitimate source? Surface this early in the next conversation rather than assuming.
