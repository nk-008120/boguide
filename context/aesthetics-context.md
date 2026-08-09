# BioGuide — Aesthetics Context Handoff (v2)

**Purpose:** orient a fresh context window continuing the visual-design pass. A full session's worth of work already landed (theme system, card/image/typography overhauls, several real bugs found and fixed). This file tells you what exists and how it's built, so you don't have to re-derive it — but **look at the live site yourself** before changing anything; this doc doesn't replace that.

**Note, 2026-08-09**: two new page families were built this session that **deliberately do not use** the identity documented below — this is intentional, not drift, so don't "fix" it back to lilac/sage if you notice:
- `/bioclash/` and the "BiOClash Champions" section of `/papers/leaderboard/` use a wholly separate palette/typography (Exam-Paper Crimson: parchment/crimson/gold, headings in a Computer-Modern-derived font) — a hard requirement from the founder, confirmed explicitly before building (see `bioclash-planner.md`'s status header). Scoped entirely under `.bioclash-page` in `custom.css`; nothing else on the site references those tokens.
- `/discussions/` (new) and the rest of `/papers/leaderboard/` (the pre-existing "Practice Leaderboard" + per-round cards) **do** use the normal lilac/sage identity below — reused, not reinvented, for those.
- `custom.css` grew substantially this session (new numbered sections for BiOClash, the Champions podium, and Discussions) — still one file, same numbered-section convention, just longer.

## What BioGuide is

A static study-guide site for IBO/USABO (biology olympiad) prep, built with **Hugo** (v0.162, extended) on the **Hextra** theme (`theme = "hextra"` in `hugo.toml`). Content lives under `content/resources/`, organized into numbered subject sections (`1-cell-molecular/`, `7-genetics/`, etc.), each following the page template in `handoff.md` (Overview/Key Concepts/Comparative Structures/Common Exam Questions/Visual Reference/Practice Problems). `content/about/`, `content/papers/`, `content/articles/`, and `content/resources/_index.md` (General Resources) round out the rest of the site.

## Design identity established this session

The site now has a real visual identity, not just stock Hextra. Everything below is deliberate and should be extended/reused, not reinvented:

- **Palette — lilac + sage**, sourced from a reference site's own CSS variables (do not re-derive from scratch):
  - Light/Favourite: lilac `#8965c4`, sage `#5c7a58`
  - Dark: lilac `#c9b7e8`, sage `#9db99a`
  - Favourite gradient background: `linear-gradient(150deg, #eaf1e6 0%, #e3d9f0 52%, #f5edfa 100%)` plus two radial glows (sage top-left, lilac bottom-right)
- **Difficulty color mapping** (used by both subject-index cards and `{{< topic-meta >}}` badges — keep these in sync if either changes): Beginner → green (`#16a34a` / dark `#4ade80`), Intermediate → amber (`#f59e0b` / `#fbbf24`), Advanced → purple (`#9333ea` / `#c084fc`).
- **Typography**: Fraunces (light/medium weight, display serif) for `h1`/`h2`/`h3`, Inter for body text. Both loaded via a single Google Fonts `@import` at the very top of `assets/css/custom.css`. Code blocks are untouched (still the default monospace stack) — don't apply Inter/Fraunces there.
- **Site-wide accent hue**: Hextra's own `--primary-hue`/`-saturation`/`-lightness` variables (its documented brand-color customization point) are overridden to lilac (263°) in `custom.css`. This retints focus rings, active-sidebar-item highlighting, and any `primary-*` Tailwind class sitewide — don't fight it by hand-styling those surfaces individually.

## Theme system: Light / Dark / System / **Favourite**

Favourite is a 4th, fully custom theme option (not a Hextra feature) — **and is now the site's default** (`[params.theme] default = "favourite"` in `hugo.toml`). It applies the lilac/sage gradient background sitewide; all other component colors intentionally reuse Light mode's palette (a deliberate simplification — don't give Favourite its own foreground colors without a reason to).

Mechanism (all project overrides of theme files at the same relative path):
- `assets/js/head/theme.js` + `assets/js/core/theme.js` — theme detection/switching logic, taught to recognize `"favourite"` as a real theme (not something `system` falls back through)
- `layouts/partials/theme-toggle.html` — adds the 4th radio option (sparkles icon) to the toggle UI in both the sidebar and footer
- `assets/css/custom.css` — the actual gradient, plus chrome-transparency fixes so the navbar/sidebar/mobile-sidebar show the gradient through instead of their default opaque white

## `assets/css/custom.css` — now ~1020 lines, single file, numbered sections

Everything customization-related lives here (no other CSS files were added). It's organized into clearly-commented numbered sections in roughly this order: legacy pre-session badge/homepage styles → Favourite theme → subject-index card difficulty coloring → content-image "card mount" framing → typography (Fraunces/Inter) → callout/admonition polish → card hover micro-interactions → practice-problem `<details>` reveal styling → table styling → search modal → print stylesheet → Mermaid sizing → key-equation boxes. **Read the section comment headers before adding new rules** — there's very likely already a pattern to extend rather than a reason to add something new.

## Layout/shortcode overrides (project files shadowing theme files at the same relative path)

| Project file | Overrides | Purpose |
|---|---|---|
| `layouts/partials/theme-toggle.html` | `themes/hextra/layouts/_partials/theme-toggle.html` | Favourite theme option |
| `layouts/partials/custom/footer.html` | (theme's own empty placeholder) | CC BY-NC-SA license line — **was broken all session** (stray `<script>` wrapper broke Go `html/template`'s contextual escaping, causing Hugo to silently render it empty); fixed, don't reintroduce a `<script>`/`<pre>` wrapper here |
| `layouts/partials/scripts/mermaid.html` | `themes/hextra/layouts/_partials/scripts/mermaid.html` | Mermaid diagram sizing fix (see below) |
| `layouts/_markup/render-image.html` | `themes/hextra/layouts/_markup/render-image.html` | Wraps every content image in `.content-image-frame` (gradient-ring "card mount") |
| `layouts/shortcodes/eqbox.html` | (new) | `{{< eqbox >}}$$ ... $${{< /eqbox >}}` — boxes a single "key equation" on a page. Used selectively (9 of the most math-heavy pages), not sitewide |
| `layouts/404.html` | theme's bare stock 404 | Standalone (no site-CSS dependency, by design — matches the theme's own robustness philosophy for error pages), on-brand lilac/sage gradient card with links back to `/resources/` |

## Known real bugs found & fixed this session (don't reintroduce these patterns)

- **Math was silently broken sitewide.** Goldmark's `passthrough` math extension isn't configured in `hugo.toml` (`[markup.katex] enable = true` is a vestigial/non-functional config key for this Hugo version), so `$...$`/`$$...$$` was never server-processed — pages without the `{{< mathjax >}}` shortcode showed raw, unrendered LaTeX text. MathJax (now added to **all 109 topic pages**, right after `{{< topic-meta >}}`) works via **client-side text-scanning** of the raw delimiter syntax, independent of Hugo's math pipeline entirely. If you add new topic pages with math, add `{{< mathjax >}}` too — nothing currently makes this automatic.
- **Footer was empty on every page** — see table above. Root cause was a stray `<script>` tag breaking Go template contextual auto-escaping; Hugo swallowed the error and rendered empty output with no visible error in normal dev-server use. If a partial override ever silently renders nothing, suspect this class of bug and check for malformed embedded tags.
- **Mermaid diagrams either illegible or oversized.** Mermaid's default `useMaxWidth:true` shrinks the whole SVG (text included) to fit the content column, which crushes text on any diagram wider than ~650-900px. The fix (in `layouts/partials/scripts/mermaid.html`) clamps the shrink factor at a minimum of 0.75 instead of letting it go arbitrarily small. Two non-obvious implementation details if you touch this again: (1) mutating the live Mermaid-inserted `<svg>`'s size in place doesn't reliably repaint in this environment — clone the node with the fix already applied and swap it in; (2) you must wait for `mermaid.run(...).then()` to resolve before sizing, not just "the `<svg>` exists in the DOM" (a `MutationObserver`-based guess) — Mermaid does its own internal width post-processing shortly after insertion, and a naive fix running first will silently get overwritten by Mermaid's own later write. This is a real race condition, not a testing artifact — it can pass in a slow sandboxed browser and still fail in a fast real one.

## Environment quirks specific to this dev/test setup (not real site bugs)

- **The sandboxed test browser has no screenshot capability.** Verify visually via `get_page_text`, `read_page`, and `javascript_tool` computed-style/geometry checks instead.
- **Stale caching is common and has hit CSS, HTML, and JS this session.** After editing `custom.css` or a layout/partial file, a plain reload often still serves the pre-edit version. Fixes that have worked: (1) for CSS specifically, clone the `<link>` tag with a `?bust=timestamp` query and swap it in via JS; (2) for template/content changes not showing up at all even after a normal reload, the Hugo dev server process itself may need a hard restart (`netstat -ano | grep :1313` → `taskkill //PID <pid> //F` → `preview_start` again) — this has been necessary multiple times, including once because an editor's atomic-write temp-file rename got briefly registered as its own Hugo template and appeared to confuse the incremental rebuild.
- **This sandbox has shown genuine style-recomputation staleness bugs** for dynamically-changed state specifically — `:has()` re-evaluation after a class toggle, `details[open]` styling, and directly mutating a JS-inserted live element's `style.width/height` have all at some point computed stale/wrong values via `getComputedStyle`/`getBoundingClientRect` in this tool, while a **fresh full page reload** (not a dynamic in-page toggle) always computed correctly. When verifying anything theme-toggle-dependent or JS-driven, prefer setting `localStorage.getItem('color-theme')` and doing a fresh `navigate()` over dispatching a click and checking immediately.
- Always clear `localStorage.removeItem('color-theme')` when done testing a specific theme, so you don't leave the browser pane stuck on a non-default theme for the next check.

## Content-layer notes (unchanged from last handoff, still true)

- **Widgets are out of reach of site-wide CSS.** Every Interactive-widget file (`static/*.html`, ~100+ across sections) is a standalone document with its own inline `<style>` block, embedded via `{{< iframe src="..." >}}`. They follow a shared hand-maintained visual system (cream background `#fefcf5`, `#2d6a4f` green accents, `'Inter'` font — documented in `visual-reference-workflow.md`). A `custom.css` change will not reach inside an iframe; touching widgets is a separate, much larger per-file job.
- **Do not touch `hugo.toml`'s `[menu]` section** structurally — it's hand-maintained (not auto-generated from the content tree, despite what an earlier version of this doc claimed) and already correct; only the theme param block was added to it this session.
- Every static image is standard markdown `![alt](/SECTIONPICS/file.ext)` immediately followed by an italic attribution paragraph — this pattern is what `render-image.html`'s wrapper targets; don't assume a `<figure>`/`<figcaption>` structure exists (it doesn't, for any current content).
- Practice-problem answers use a consistent, sitewide `<details><summary>Show answer</summary>...</details>` pattern (~40 files) — this is the *only* use of `<details>` anywhere in content, confirmed by grep, so it's safe to style broadly via `.content details`.

## What's left / not yet touched

- Widget iframes (separate, large job — see above)
- Articles pages haven't been specifically audited/restyled. Papers *has* been touched since this doc was last current — `/papers/leaderboard/` was restructured 2026-08-09 (BiOClash Champions section added, existing Hall of Fame relabeled/demoted) — but that was functional/content work, not a systematic restyle pass of the whole `/papers/` tree.
- The `{{< iframe >}}`-embedded Streamlit interactive tools' own visual language hasn't been unified with the lilac/sage identity
