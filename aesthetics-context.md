# BioGuide — Aesthetics Context Handoff

**Purpose:** orient a fresh context window for the site's visual-design pass, now that content-writing (`handoff.md`) and the Static-image/Interactive-widget pass (`visual-reference-workflow.md`) are the established, working patterns for every section. This file does not audit current rendering — look at the live site yourself before making changes; it exists to save you from re-deriving stack facts and the content/CSS interaction points that aren't obvious from reading CSS alone.

## What BioGuide is

A static study-guide site for IBO/USABO (biology olympiad) prep, built with **Hugo** on the **Hextra** theme (`theme = "hextra"` in `hugo.toml`). Content is organized into numbered subject sections under `content/resources/`, each following the depth/structure pattern in `handoff.md` (dense prose, named examples, a fixed page template with Overview/Key Concepts/Comparative Structures/Common Exam Questions/Visual Reference/Practice Problems). Read `handoff.md` if you need that pattern; you shouldn't need to for pure CSS work.

## Current styling state

- `assets/css/custom.css` (~450 lines) already exists and is the live customization layer — check it before assuming Hextra defaults are what's rendering. It covers at least badge styles (`.badge-custom`, `.badge-exploration`, `.badge-challenge`, `.badge-curiosity` — used by the `topic-meta` shortcode) and card tweaks.
- `layouts/partials/banner.html` and three shortcodes (`iframe.html`, `mathjax.html`, `topic-meta.html`) are the only layout overrides — everything else is stock Hextra.
- **Do not touch `hugo.toml`'s `[menu]` section** — the sidebar is fully automatic from content-tree structure + each page's `weight`, confirmed working with zero manual menu edits across every section built so far.

## How CSS interacts with content you didn't write today

- **Widgets are out of reach of site-wide CSS.** Every Interactive-widget file (`static/*.html`, ~100+ of them across sections) is a standalone document with its **own inline `<style>` block**, embedded via `{{< iframe src="..." >}}`. They follow a shared hand-maintained visual system (cream background `#fefcf5`, `#2d6a4f` green accents, `'Inter'` font — documented in `visual-reference-workflow.md`) but a change to `custom.css` will not reach inside an iframe. If the aesthetics pass is meant to touch widgets too, that's a separate, much larger job (editing each file individually), not a CSS-layer change.
- **Math is KaTeX** (Hextra default, `$...$` / `$$...$$`). Don't reintroduce MathJax — a few legacy pre-existing pages hardcode a MathJax script tag; that's a known bug, not a pattern.
- **Mermaid diagrams render natively** via fenced code blocks — no plugin CSS to manage.
- **Every Static image** is inserted as standard markdown `![alt](/SECTIONPICS/file.ext)` immediately followed by an italic attribution line (`*Source: ... — confirm licensing basis...*`) — any `img`/figure styling change will apply across dozens of pages uniformly, which is good, but check how the attribution line (a plain `<em>` paragraph, not a `<figcaption>`) looks under any new image treatment.
- **Dark/light mode** is Hextra's built-in toggle — style changes need to hold up in both; nothing in this project has overridden that mechanism.

## Suggested first step

Start the dev server (`.claude/launch.json` has `hugo-dev`, `hugo server --port 1313 --disableFastRender`) and look at a handful of pages across different sections yourself — a landing page, a content page with inline images, a page with widgets — before deciding what to change. No prior aesthetics decisions have been made beyond what's already in `custom.css`; treat this as a genuinely open first pass, not a continuation of a documented plan.
