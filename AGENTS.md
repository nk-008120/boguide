# AI Agent Directives — BiOGuide

This repository operates under a public AI transparency policy. If you are an AI
coding agent (Claude, GPT, Gemini, Copilot, or any other) working in this repo —
autonomously, in an IDE, or via chat — these directives are binding. Read
`AI_ATTESTATION.txt` in full before making any change.

## 1. Restricted zones — do not touch without explicit human confirmation first

The attestation declares an AI-Free policy on BiOClash's actual exam content.
Before editing anything under these paths, stop and ask the human first,
even for a small fix:

- `content/bioclash/**` (question/case-file content specifically — not build
  tooling or styling, see note below)
- `data/bioclash/*.yaml` (question text, options, correct answers)
- Any internal team discussion / research-paper-reference documents referenced
  from BiOClash material

Treat anything
under `content/bioclash/` and `data/bioclash/` as fully restricted.

## 2. Log every AI-assisted change

Append a row to `AI_INVOLVEMENT_LOG.csv` for any meaningful AI-assisted edit,
using the existing columns (Date, Section, AI Tool, Nature of Involvement,
Source/Evidence, Commit Hash). Do this in the same session as the work, not
retroactively — retroactive reconstruction is unreliable (see the log's own
existing caveat about not covering every historical commit).

## 3. Do not conceal AI involvement

**Effective 2026-08-2,committing to the EU Directives, this project's policy is disclosure, not concealment.**
Do not remove `Co-Authored-By` trailers, do not strip AI tool names from
comments or commit messages, do not rewrite history to erase AI involvement.
Earlier work in this repository's history did the opposite (see
`backup-unwanted-state` branch and commits predating this date on `main`) —
that was a prior, since-superseded approach. Follow the current policy, not
the old commits.

## 4. Image/media attribution

Per `AI_ATTESTATION.txt` point 4.A, any AI-generated or AI-assisted image
needs visible attribution or a watermark consistent with what's already
declared (e.g. the Grok watermark on BiOClash MB-01 graphs). Don't strip
existing attribution when editing pages.

## 5. When uncertain

If a task's scope is ambiguous relative to these directives — especially
anything touching BiOClash — stop and ask the human rather than guessing.
Getting this wrong undermines the attestation's credibility, which is the
entire point of it existing.
