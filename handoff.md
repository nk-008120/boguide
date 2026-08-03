# BioGuide — Interactive Widget Handoff (Animal Anatomy)

**Written:** 2026-08-04. **Status: COMPLETE as of 2026-08-04.** All 16 pages now have their Interactive widgets built, moved inline into Key Concepts, and verified by actually clicking/dragging/toggling each one in the browser (Plotly charts, SVG+JS sliders/toggles, click-through walkthroughs, quizzes). The Animal Anatomy section's Visual Reference work (static images + interactive widgets) is fully done. Original handoff context preserved below for reference.

**Purpose (historical):** carry full context into a fresh conversation to build the Interactive widgets for the Animal Anatomy section — the one remaining piece of that section's Visual Reference work.

## State: what's already done

`content/resources/2-animal-anatomy/` (16 pages) is **fully complete except for interactive widgets**:
- Full IBO-depth content (established over several prior sessions).
- **Static images**: ~100 images sourced, verified, captioned, and placed inline in Key Concepts (not collected in Visual Reference) across all 16 pages. Every image cross-checked against `static/ANATOMYPICS/` — zero missing, zero orphaned. Full ledger with license/attribution/mismatch notes at `C:\NK\boguide\image-sources.md`.
- Each page's `## Visual Reference` section still has an **`**Interactive**`** subsection with 1–2 bullet-point specs (written earlier, not yet built) and a **`**Static**`** subsection now reading *"(Static images are placed inline in Key Concepts above...)"*.

**What's left**: implement every `**Interactive**` bullet as an actual working widget, embedded directly in the page's Markdown, placed inline in Key Concepts near the concept it illustrates — the same relocation pattern already used for static images (don't leave it sitting under Visual Reference; move it to where it teaches something).

## Task list state

A task list exists with tasks #1–16 (one per page, all `completed`, all about static images) and **task #17: "Interactive widgets: Animal Anatomy (all 16 pages)"**, still `pending`. Break #17 into 16 per-page sub-tasks mirroring the image workflow (`TaskCreate` one per page, work through them in page order, `TaskUpdate` to `in_progress`/`completed` as you go) — the same rhythm that worked well for images.

## What each page needs — read it directly, don't rely on this list

Each page's exact Interactive specs are already written in its `## Visual Reference` → `**Interactive**` section. **Read that section directly** before starting a page rather than trusting a summary — the specs are precise about what should be draggable/clickable and what they should demonstrate. Page order (same as the image pass): Body-Plans, Human-Skeletal-System, Human-Integumentary-System, Human-Muscular-System, Human-Nervous-System, Human-Sensory-Organs, Human-Circulatory-System, Human-Respiratory-System, Human-Digestive-System, Human-Excretory-System, Human-Reproductive-System, Fish-Amphibian-Anatomy, Reptile-Bird-Anatomy, Mammalian-Comparative-Anatomy, Invertebrate-Body-Plans-1, Invertebrate-Body-Plans-2.

Roughly: quantitative/graphed specs (cardiac cycle Wiggers diagram, countercurrent gill O₂ graph, HPG hormone cycle chart, lung volumes chart, countercurrent-multiplier osmolarity graph, action-potential/conduction-speed chart) → **Plotly**. Click-through, hover-to-reveal, slider, or toggle specs (sarcomere contraction, NMJ/EC-coupling walkthrough, reflex arc, jaw-to-ear homology animator, limb-stance toggle, accommodation simulator, cochlear tonotopy, nephron filtration explorer, GI transit timeline, gastric-gland quiz, follicular staging carousel, sponge water-flow simulator, nematocyst firing, bird two-cycle airflow stepper, heart-chamber evolution slider, water vascular system animator, arthropod ID key) → **vanilla HTML/CSS/JS** (SVG diagrams manipulated by inline `<script>`), no new library needed.

## Site tooling reality — confirmed this session

- **No build step, no npm, no root `package.json`.** Everything is raw HTML/CSS/JS/Plotly embedded directly in the Markdown content files — there is no shortcode or component system for interactivity in this repo.
- **Existing precedent to copy the pattern from**: `content/resources/8-ecology/_index.md` — has a working Plotly widget loaded via a raw `<script src="https://cdn.plot.ly/plotly-3.1.0.min.js"></script>` tag placed directly in the Markdown, plus hand-rolled `<div>`/`<script>` blocks with vanilla JS for other interactivity. Read that file for the exact working pattern (script placement, container div IDs, styling) before building the first widget.
- **Raw HTML passes through fine**: `hugo.toml` has `[markup.goldmark.renderer] unsafe = true`, confirmed already set — no config changes needed.
- Each Hugo page is a standalone HTML document, so JS/CSS scoping only matters *within* a single page (multiple widgets on the same page need unique element IDs) — no cross-page collision risk.
- `image-sources.md` is image-specific; **no equivalent ledger is needed for widgets** — track progress via the task list instead.

## Verification workflow — don't skip this

A widget spec is "done" only once it's been *exercised*, not just loaded:
1. `hugo server --port 1313` (background) if not already running — check with `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:1313/` first; last session it silently died partway through and had to be restarted (`nohup hugo server --port 1313 > /tmp/hugo-server.log 2>&1 &`, then wait ~25s for the initial build before curling — it's a real full-site build, not instant).
2. Navigate the Browser tool to the specific page.
3. Actually click/drag/hover the widget (use `computer`/`find`/`read_page`), and confirm the DOM/visual state changes as specified — e.g. for a slider, confirm a label's text or an SVG attribute actually updates; for a click-through, confirm the highlighted element changes step to step.
4. Screenshot as proof once working.
5. Move the `**Interactive**` bullet's content from Visual Reference into the body text at the relevant point (matching how static images were relocated), leaving a short "(implemented inline above)" note under Visual Reference — same pattern as the Static subsection now reads.

## Suggested first step in the new session

Don't start writing code immediately. Re-create the 16-page task list (mirroring tasks #1–16 from the image pass, adjusted for widgets), read `content/resources/8-ecology/_index.md` once to confirm the exact embedding pattern, then start with Body-Plans page 1's two Interactive specs — build, verify by clicking it in the browser, move it inline, mark the task complete, then proceed page by page.
