# Visual Reference Workflow — Handoff

**Written:** 2026-07-31, after fully illustrating Plant Physiology's Static images (11 pages, 50 images + 1 video). **Purpose:** carry the established Static-image workflow into a fresh context window for a different subject (Evolution, Ethology, Animal Anatomy, etc.) without re-deriving it. Pairs with `handoff.md` (content-writing pattern) and `image-sources.md` (the running ledger this workflow maintains) — read this file, then check `image-sources.md` for what's already done before starting a new subject.

## The core workflow (steady-state loop)

1. **I propose a batch** for one page: usually all of that page's Visual Reference `Static` items (typically 4-6), each with a short description of what to look for and an exact filename to save it as.
2. **The user sources the images themselves** — searches, evaluates candidates, saves the file to the exact path/filename I specified under `static/<SECTION>PICS/`. I do not fetch or download images myself; the user does, then tells me the source (a URL, or a plain-text attribution like "public domain" / "credit in image" / a named site).
3. **I verify the files exist** (`ls`), then **view every one with the Read tool** before writing anything — never caption from the filename or the user's one-line source description alone. This step has caught real problems every batch: content that doesn't match the original spec, wrong file formats, accidental duplicates.
4. **I write an accurate caption based on what the image actually shows**, not what was originally requested. If a sourced image is broader, narrower, or adjacent to the spec (common), say so explicitly in the caption or a trailing note — never silently force a caption that overclaims what's in the picture.
5. **I insert the image inline in Key Concepts**, directly under the paragraph/subsection it illustrates — see "Placement philosophy" below, this is a deliberate, user-directed departure from the original template.
6. **I update `image-sources.md`** (the ledger) with the new row(s) before or immediately after wiring in.
7. **I verify the live render** against the local Hugo dev server (see "Verification" below) — confirm the image sits under the correct heading and returns HTTP 200, not just that the markdown looks right.
8. **I report back concisely**: what's placed, what's flagged, what's dropped, then the next batch's requests.

## Placement philosophy — inline, not bottom-of-page

**Original template had a single `## Visual Reference` section at the bottom of every page** (Interactive + Static subsections, per `handoff.md`). The user explicitly overrode this for Static content: *"there does not have to be a visual reference portion... when these concepts are introduced and explained, the image should be presented then and there, it is really a bad idea to make people scroll to the bottom."*

Applied as follows, confirmed as the standing rule for this project:

- **Static images**: placed inline in `## Key Concepts`, immediately after the sentence/paragraph they support, using ordinary markdown image syntax. The `## Visual Reference` section's `**Static**` subsection is deleted entirely once a page's images are placed — replaced with a one-line note: `*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*`
- **Interactive widgets stay in `## Visual Reference` at the bottom** — the user explicitly confirmed this when asked ("No, rather than going inline, the widgets will be at the bottom"). Don't move them inline without asking again if a new session considers it.
- The `**Interactive**` heading gets `*(built later — see project workflow)*` appended until those widgets are actually built.
- A page is "done" for this workflow once every Static item is either placed inline, explicitly dropped (see below), or intentionally left unillustrated (rare, only when nothing usable was found — say so in the leftover Visual Reference note).

## Image conventions

- **Directory**: `static/<SECTION>PICS/` — one flat directory per section, matching the site's pre-existing convention (`MCBBPICS`, `ECOLOGYPICS`, `BIOINFOPICS`, `ANATOMYPICS`). Create it once per new subject with `mkdir`.
- **Filename**: descriptive kebab-case, assigned by me when I request the image (e.g. `root-water-pathways-apoplast-symplast-transcellular.png`), so there's no back-and-forth about naming. Always give the user the exact path when requesting.
- **Markdown**: standard `![alt text](/SECTIONPICS/filename.png)` followed immediately by an italic attribution line: `*Source: <who/where> — confirm licensing basis before public deployment*` (wording varies slightly but always flags unresolved licensing unless truly confirmed open).
- **Alt text carries the real content description** — write it as a full sentence describing what the image shows structurally, since it doubles as the caption for accessibility and for anyone scanning just the markdown source.

## Licensing: default posture is "flag, don't block"

This project's standing instruction: **source anything, even with doubt — insert it, but flag clearly.** Concretely:
- `CHECK` (the default): source isn't confirmed CC/open-license/public-domain. Insert anyway, caption with "confirm licensing basis before public deployment," log in the ledger.
- `OK (likely)`: source is from a publisher with a known open-access default (Frontiers, MDPI — both confirmed CC BY 4.0 by default during this project). Still worth a final check before public deployment, but meaningfully better footing than a bare `CHECK`.
- **`CONFIRMED COPYRIGHT`** — reserve this stronger flag for images carrying an explicit, visible copyright notice in the image itself (e.g. "© Merriam-Webster, Inc." printed directly on a diagram). This is categorically different from "unconfirmed" — surface it distinctly in both the ledger and the inline caption, don't let it blend into the general `CHECK` pile. Still insert per the user's standing preference, but say plainly that it must not go on the public site without a license or replacement.
- **ResearchGate / ScienceDirect "topics" pages / Wiley / Springer chapter links are essentially never confirmed-open** by default — flag every one, even when the content match is excellent. Frontiers and MDPI are the two sources encountered so far with a genuine open-access default worth calling out positively.
- If the user explicitly overrides a flagged concern ("continue with the current images"), update the ledger to say so explicitly (e.g. *"Inserted per user decision to proceed despite the flagged concern"*) rather than quietly clearing the flag — the caution should stay visible for the eventual public-deployment pass even after the decision to proceed.

## The ledger: `image-sources.md`

One running file at the repo root (not inside `content/`, so it never gets built into the site). Table columns: `Filename | Directory | Used on page | Source | Status | Notes`. Append rows every batch, immediately — don't batch up ledger updates for later. This file is the single source of truth for the eventual "confirm all licensing before public deployment" pass across every subject, so keep it complete and current rather than reconstructing it retroactively.

## Handling real-world messiness (all of this happened at least once)

- **Mismatched file extension**: a user-saved file is sometimes a different real format than its extension claims (an AVIF or SVG saved as `.png`). The Read tool's error message names the actual detected format — confirm with `file <path>`, then `mv` to the correct extension and reference that in the markdown. Note the fix in the ledger; it's not a licensing issue, just a housekeeping one.
- **Two "different" images turning out to be the same source at different crops**: happened once (an apoplastic-only crop and a combined apoplastic+symplastic crop from the same figure). Use the more complete one for both concepts it covers, mark the redundant one `NOT INSERTED` in the ledger with a one-line explanation, don't insert both.
- **A sourced image doesn't match the original ask**: sometimes what's found is broader (e.g. a whole guard-cell metabolism map requested as a narrow "ion flux" diagram), narrower/adjacent (a generic PIN-transport diagram substituted for an unfindable Cholodny-Went-specific one), or from a different scientific domain than expected (a generalized animal/human HSF pathway figure used for a plant heat-shock concept). In every case: insert it, caption exactly what it shows, and add a short note (inline and in the ledger) about the gap between what was asked for and what's actually there. Never quietly caption it as if it were the originally-requested content.
- **User explicitly drops an item** ("no image for this, remove"): delete the spec bullet/content entirely — no residual mention, no placeholder. Confirm the removal leaves no trace when you grep the rendered page afterward.
- **A user-provided substitute is explicitly incomplete** (e.g. "substitute without the specific result shown" — a grafting-technique diagram that doesn't show the flowering outcome the text needed): still insert it if requested, but the caption must say plainly what's missing, so nobody mistakes the illustration for actually depicting the claim in the text.
- **Video, not image**: if the user provides a YouTube link for a spec item instead of a static image, embed it with Hugo's built-in shortcode `{{< youtube VIDEO_ID >}}` (already used elsewhere in this codebase — no new plumbing). Before embedding, verify the video is actually on-topic (a quick `WebFetch` on the URL for the title is enough) rather than trusting the link blindly. Log it in the ledger with `Status: N/A` and a note that it's an embed, not a hosted file.
- **A stray image with no caption arrives mid-conversation**: this has happened more than once and always turned out to be an accidental clipboard/screenshot paste, not a real instruction. If a message is only image + auto-generated coordinate-mapping metadata with zero accompanying text, treat it as noise — briefly say so and continue; don't stall the batch waiting for clarification a second time once the pattern is established.
- **The user's numbered list of sources doesn't always match the numbered list of requested images** — sometimes what actually got saved fits a different slot better than the order implies (e.g. a source titled "dormancy regulation model" turned out to match the file meant for a different spec item than the one it was listed against). Match by actual content, not by list position; note the reassignment transparently in the ledger.

## Verification (do this every batch, not just at the end)

Don't trust that a markdown edit "looks right" — confirm the live page:

1. Make sure a Hugo dev server is running (`.claude/launch.json` has a `hugo-dev` config: `hugo server --port 1313 --disableFastRender`). Start/reuse it via the browser tool's `preview_start`. If it's died (check `curl -o /dev/null -w "%{http_code}" http://127.0.0.1:1313/`), just restart it — a stray Windows file-lock on old `public/` build output has caused this at least once and a restart clears it.
2. **Use `127.0.0.1`, not `localhost`, in `curl` from this shell** — `localhost` has silently failed to resolve in this Bash/Git-Bash environment before (IPv6 vs IPv4 quirk), producing a misleading "server is down" false alarm. `127.0.0.1` worked every time.
3. Confirm placement order: `curl -s http://127.0.0.1:1313/resources/.../page/ | grep -o '<h3[^<]*<[^>]*>[^<]*\|SECTIONPICS/[a-zA-Z0-9._-]*\.\(png\|svg\)'` and eyeball that each image line falls immediately after the right heading.
4. Confirm every referenced file actually serves: loop `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:1313/SECTIONPICS/filename.png` for each — expect `200`.
5. If something was explicitly dropped, grep for its old spec text to confirm zero residual mentions.
6. The Browser pane's `screenshot` action is unreliable in this environment (frequently errors "pane not displayed, not compositing frames") — don't depend on it for verification. `curl` + `grep` against the dev server is the reliable substitute and was used for essentially all verification in this project. When a real visual check is unavoidable (e.g. confirming what an unreadable file format actually depicts), `javascript_tool` against the loaded page (e.g. forcing `img.loading = 'eager'` and reading `naturalWidth`/`complete`, or reading `svg text` node contents) is a more reliable fallback than screenshotting.

## Interactive widget gotcha: no blank lines anywhere inside an inline HTML block

Discovered across the second and third pages' widgets (Stomatal Physiology, then again in Phloem Transport — broader than first thought): **a blank line anywhere inside an inline raw-HTML block in the markdown — `<div>`, `<svg>`, `<script>`, all of it — breaks Hugo/goldmark's raw-HTML passthrough at that point**, and everything after the blank line gets reprocessed as markdown instead of passed through as raw HTML/JS.

- If the blank line is inside a `<script>`: the JS after it silently fails (straight quotes become curly quotes, a stray `<p>` appears mid-script, no console error — buttons/sliders exist but do nothing).
- If the blank line is inside markup like an `<svg>` (found this the second time, one page later): indented lines after the blank line get parsed as an **indented code block** instead — the elements vanish from the actual DOM entirely (wrapped in `<pre><code>` and HTML-escaped), so `getElementById` returns `null` for anything defined after the blank line.

Both failure modes look fine in the raw markdown and even in a casual read of the built HTML — the page builds clean, no errors anywhere. The only way to catch it is to check that specific elements exist and actually respond to interaction.

**Rule going forward: never put a blank line inside *any* inline HTML block (div/svg/script) embedded directly in a content `.md` file — from the opening tag to its matching closing tag, keep it fully blank-line-free.** Standalone widget `.html` files under `static/` are unaffected (not run through goldmark at all) — this only bites inline HTML/JS embedded directly in a page's markdown. Skip blank lines for readability inside these blocks entirely; keep them dense, or separate visual sections with a comment line instead if needed.

**Verification implication**: don't just check that a widget's container `<div>` exists in the rendered page — for every element referenced by `getElementById` inside the widget's script, confirm it round-trips (element is non-null) *and* actually exercise the JS (via `javascript_tool`: click buttons, dispatch `input` events on sliders, read back the resulting DOM state) before calling a widget done. A quick sanity check worth running preemptively on any new widget: grep the widget's markdown block for blank lines before ever loading it in a browser.

```bash
awk '/^<div id="widget-id"/{flag=1} flag && NF==0{print NR": blank line found"} flag && /^<\/script>$/{flag=0}' path/to/_index.md
```

## Interactive widget gotcha: sequential animations must reset state before replaying

Found on the fourth page's PMF animator: a button-triggered multi-step reveal (opacity 0→1 on several elements via staggered `setTimeout`s) **only animates correctly the first time**. On a second click, every element is already sitting at its final `opacity: 1` from the first run, so nothing visibly changes except the caption text — the user sees no animation at all, just flickering captions. This was caught by the user testing it directly ("the 2nd visual reference needs to function better"), not by my own verification, which had only checked that the sequence *reached* its final state once, not that it could be replayed.

**Rule going forward: any click-triggered sequential/staged animation must explicitly reset every element it touches back to its initial state at the start of the click handler**, before the `setTimeout` chain re-reveals them. Concretely: factor the "initial state" into its own `reset()` function, call it first thing inside the click listener, and only then schedule the staggered reveals. Where it helps, relabel the trigger button (e.g. "Activate" → "Replay") so it's clear repeated clicks are expected and supported.

**Verification implication**: testing a sequential-reveal widget once through to completion is not enough — click it a second time and confirm the visual state actually resets and replays, not just that the caption text changes. This is a distinct failure mode from the blank-line bug above (that one breaks silently at build time; this one only shows up at interaction time, and only on the *second* interaction).

## What's explicitly out of scope for this workflow

- **Building the Interactive widgets** is a separate, later phase (real code — SVG/JS/Plotly — not sourcing). Don't conflate the two; this document covers Static image sourcing only.
- **Public deployment / final licensing resolution** is not part of this pass. Every `CHECK`/`CONFIRMED COPYRIGHT` row in `image-sources.md` is a deliberate deferral, not an oversight — a final licensing pass across the whole ledger is a distinct future task.
- **Custom-drawn SVG diagrams were tried once and abandoned** — the first pilot image was a hand-coded SVG, and the user redirected immediately to "sourced real images, I'll find and save them" as soon as they saw a real textbook figure was available and better. Don't default back to drawing originals unless a subject genuinely has no findable real diagram for a specific concept (rare — hasn't happened yet across all of Plant Physiology).
