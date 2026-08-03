# BioGuide — Content Creation Handoff (Plant Anatomy)

**Written:** 2026-08-04. **Purpose:** carry the full established pattern from the now-complete Animal Anatomy section into a fresh conversation to build Plant Anatomy — content, static images, and interactive widgets, all three phases.

## Status of prior work (verify current state yourself — don't just trust this)

`content/resources/2-animal-anatomy/` (16 pages) is **fully complete**: IBO-depth content, ~100 static images placed inline and logged in `C:\NK\boguide\image-sources.md`, and interactive widgets (Plotly + vanilla JS/SVG) built and verified in-browser for all 16 pages. Treat it as the reference implementation for every phase below — when unsure, go read a page from it directly rather than relying on this summary.

As of the original audit (now stale — re-check before trusting): `content/resources/6-plant-anatomy/_index.md` was boilerplate "coming soon." `content/resources/5-plant-physiology/_index.md` already has real content (referenced repeatedly in `image-sources.md`, e.g. `Water-Transport-Transpiration`) — **do not confuse the two sections**, this handoff is specifically about **Plant Anatomy** (`6-plant-anatomy`), not Plant Physiology.

**First step in the new session**: confirm current state yourself — `ls content/resources/6-plant-anatomy/`, check whether it's still boilerplate, check whether `static/PLANTANATOMYPICS/` (or similar) exists, check whether a subtopic plan already exists anywhere. Don't assume anything above is still accurate.

## Phase 1: Content (plan first, then write)

Do **not** write Markdown until the user approves a subtopic breakdown — this was the pattern for Animal Anatomy every time (a wrong first guess at structure got corrected twice: once on overall depth, once on the 5:3:2 tier ratio). Propose a subtopic list for Plant Anatomy, ask what natural tiers/ratio (if any) the subject has — don't assume it mirrors Animal Anatomy's human/vertebrate/animal-kingdom split, plants don't have an obvious analogous structure. Likely candidates worth considering: cell/tissue level (parenchyma, collenchyma, sclerenchyma, meristems) vs. organ level (root, stem, leaf) vs. reproductive structures (flower, seed, fruit) — but let the user confirm rather than assuming.

**Depth bar**: same as Animal Anatomy — roughly first-year-university depth, named cell types and their specific roles, staged/timed processes, specific structural mechanisms, not organ-name-level generality. Read `content/resources/2-animal-anatomy/Human-Reproductive-System/_index.md` as the calibration sample if unsure.

**Front matter / page template**: identical to Animal Anatomy — reuse `layouts/shortcodes/topic-meta.html` as-is (no changes needed), same `difficulty`/`prerequisites`/`syllabus_tags` fields, same section order (Overview → Key Concepts → Comparative Structures → Common Exam Questions → Visual Reference → Practice Problems), one subdirectory + `_index.md` per topic (never a monolithic tabbed page), split further whenever a topic proves too dense to share a page (this happened repeatedly in the Human tier of Animal Anatomy).

## Phase 2: Static images

Read `C:\NK\boguide\visual-reference-workflow.md` if it still exists (referenced repeatedly during the Animal Anatomy image pass — confirm it's still there and current before relying on it, this handoff-writer never actually re-read its full contents directly). Key points that held true in practice for Animal Anatomy, whether or not that file still says so:

- Propose a batch of Static items per page (filename + description each) for the user to source.
- **Two sourcing variants actually happened in practice**: (a) the user pastes source *pages* (not files) and expects you to `WebFetch` them to locate/verify the actual image + license before asking permission to download; (b) the user just saves files directly into `static/<SECTION>PICS/` themselves and says "saved" — check the directory before doing anything else, since this became the dominant pattern later in the Animal Anatomy pass.
- **Always view every image with `Read` before captioning** — never caption from a filename or the user's one-line source description alone. Several "obvious" matches turned out to be mismatches (wrong topic entirely) or had visible copyright notices baked into the image that needed flagging.
- New asset folder needed: `static/PLANTANATOMYPICS/` (matching the existing convention — `ECOLOGYPICS`, `MCBBPICS`, `BIOINFOPICS`, `ANATOMYPICS`, `ANIMALPHYSIOPICS`, `PLANTPHYSIOPICS`), create it before the first image is saved.
- **Gotchas hit repeatedly, budget for them**: SVG and AVIF files don't render via the `Read` tool — rasterize to PNG first (Python/Pillow works directly for AVIF; for SVG, use the Browser tool to fetch+draw the SVG onto an `OffscreenCanvas` and export as a PNG data URL, since no local SVG renderer is installed). Filenames with spaces/parentheses need renaming to something URL-safe before referencing them in Markdown. The user sometimes saves files into the *wrong* section's picture folder (e.g. leftover from a previous topic) — check there if a file isn't where expected.
- Log every image in `C:\NK\boguide\image-sources.md` (append rows, don't rewrite the file) with a status: `OK`/`OK (likely)` for confirmed-open licenses, `CHECK` for unconfirmed, `CONFIRMED COPYRIGHT` for a visible copyright/signature baked into the image itself (flag clearly, insert anyway per the user's standing preference, but mark it must not go to production unlicensed). If an image doesn't actually match its spec, insert it anyway with an honest caption explaining the mismatch — don't silently force-fit it or silently skip it.
- After inserting, remove the placed items from the page's `**Static**` Visual Reference list (leave a one-line "(placed inline above)" note) and verify live: `curl` every image URL for 200, and grep the rendered page HTML to confirm each image lands under the correct heading.
- The dev server (`hugo server --port 1313`) can silently die mid-session — if a `curl` to `127.0.0.1:1313` returns `000`, just restart it (`nohup hugo server --port 1313 > /tmp/hugo-server.log 2>&1 &`, wait ~25s for the initial build, it's a real full build not instant).

## Phase 3: Interactive widgets

Same as Animal Anatomy's now-complete pass: no build step, no npm, everything is raw HTML/CSS/JS/Plotly embedded directly in the Markdown content file. Read `content/resources/8-ecology/_index.md` for the working precedent (Plotly via a raw CDN `<script>` tag, plus hand-rolled `<div>`/`<script>` blocks). `hugo.toml` already has `unsafe = true` in the goldmark renderer config, so raw HTML passes through with no config changes needed. Use Plotly for anything quantitative (a real graph/chart), vanilla JS manipulating an inline SVG for click-through/hover/slider/toggle interactions. Verify every widget by actually clicking/dragging it in the Browser tool and confirming the DOM/visual state changes — not just confirming the page loads. Move each built widget's description out of the Visual Reference `**Interactive**` list into the body text near the concept it illustrates, same relocation pattern used for static images.

## Suggested pacing

Given this is one fresh session covering all three phases for a whole new section, it's reasonable to do Phase 1 (full content, all pages) first and get it approved, *then* work through Phases 2–3 page by page — or, since the pattern is now well-proven, do all three phases for one page at a time before moving to the next page, if that paces better. Either way: **don't skip the subtopic-breakdown approval step at the very start** — that's the one step every prior session insisted on before writing content.
