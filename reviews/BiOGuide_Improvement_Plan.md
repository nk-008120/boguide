# BiOGuide Improvement Plan

**Repository:** [nk-008120/boguide](https://github.com/nk-008120/boguide)  
**Live site:** [bioguide.world](https://bioguide.world)  
**Plan date:** 2026-09-18  
**Based on codebase review of commit `27026d8` (2026-09-17)**

---

## 1. Current State Summary

BiOGuide is a hybrid Hugo static site + Vercel serverless + Supabase platform for biology olympiad preparation. It includes:

- Notes@BiOGuide (127+ subtopic pages)
- BiOrchive (past-paper timed practice)
- BiOClash (competitive timed rounds with anti-cheat)
- BiOLab (open protocol archive)
- Doubts (staff-answered Q&A)
- Dashboard (SM-2 spaced repetition + mastery tracking)
- BiOGames / BiOLudo (client-only game)

Recent work has significantly improved security documentation (`ARCHITECTURE.md`, `SECURITY.md`), RLS testing (PGlite suites), shared auth for BiOClash, Sentry, dual licensing (MIT code / CC BY-NC-SA content), and product surface.

**Overall maturity score (latest review): 8.5 / 10**

---

## 2. Priority Matrix

| Priority | Item | Impact | Effort | Owner focus |
|----------|------|--------|--------|-------------|
| P0 | Durable rate limiting | High (abuse / scale) | Medium | Backend |
| P0 | Paper/YAML caching | High (latency / cold starts) | Low–Medium | Backend |
| P0 | Shared auth across all API routes | Medium–High | Low | Backend |
| P1 | Unit tests for grading pure functions | High (correctness) | Medium | Backend / QA |
| P1 | Extend BiOLab RLS test coverage past mig 017 | Medium–High | Medium | Security |
| P1 | Client JS build step (bundle + minify) | Medium | Medium | Frontend |
| P2 | Repository size / media strategy | Medium (DX + CI) | Medium–High | Infra |
| P2 | Structured error codes / logging | Medium | Low–Medium | Backend |
| P3 | TypeScript for `api/` | Medium (long-term) | High | Backend |
| P3 | Navigation / menu density cleanup | Low–Medium | Low | Product |

---

## 3. Detailed Work Items

### P0 — Immediate (1–2 weeks)

#### 3.1 Durable rate limiting

**Problem:** `rateLimit()` in `api/_lib/bioclash.js` uses an in-memory `Map`. It resets on cold starts and does not coordinate across Vercel instances.

**Target:**
- Use Upstash Redis, Vercel KV, or a small Supabase table keyed by `(user_id, action, window)`.
- Keep the same API surface: `rateLimit(userId, action, maxPerWindow, windowMs)`.
- Apply to all sensitive endpoints (start attempt, submit, lock block, extension, drafts, account deletion).

**Acceptance criteria:**
- Rate limits survive cold starts.
- Behavior is consistent under concurrent instances.
- 429 responses remain clear and non-leaky.

#### 3.2 Paper / YAML caching

**Problem:** `loadPaper()` and similar helpers read + parse YAML from disk on every request.

**Target:**
- Module-level cache (Map) with optional TTL, or Redis cache keyed by paper ID.
- Invalidate on deploy (process restart is acceptable for v1).
- Keep strict ID validation (`/^[a-z0-9-]+$/`).

**Acceptance criteria:**
- Repeated requests for the same paper do not re-parse YAML under normal load.
- Unknown / invalid IDs still return null safely.
- Memory use stays bounded.

#### 3.3 Shared auth for all API routes

**Problem:** BiOClash uses `authenticate()`; other routes (e.g. `submit-attempt.js`, `delete-account.js`) may still duplicate Bearer extraction + `getUser` logic.

**Target:**
- Promote a shared helper (e.g. `api/_lib/auth.js`) used by every authenticated endpoint.
- Standardize 401 / 429 response shapes.

**Acceptance criteria:**
- No duplicated auth boilerplate across `api/*.js`.
- All authenticated routes reject missing/invalid tokens consistently.

---

### P1 — Short term (2–4 weeks)

#### 3.4 Unit tests for pure grading logic

**Problem:** RLS suites are strong; pure functions (`autoGrade`, `componentIsCorrect`, `seededShuffle`, `recompute`) lack focused unit tests.

**Target:**
- Add a small Node test suite (no DB required) covering:
  - MCQ / true-false / numeric grading
  - Tolerance on numerics
  - Free-response exclusion
  - Seeded shuffle determinism per user
  - Extension penalty calculation
- Run in CI on every push/PR.

**Acceptance criteria:**
- Tests pass locally and in CI.
- Failures clearly identify which grading path broke.

#### 3.5 Extend BiOLab RLS standing suite

**Problem:** `ARCHITECTURE.md` notes that coverage for migrations after 017 is incomplete as a standing regression suite.

**Target:**
- Fold multi-image, attachments, moderation, and feedback policies into `tests/biolab/`.
- Keep PGlite + verbatim migration application.

**Acceptance criteria:**
- Later BiOLab migrations are exercised on every CI run.
- Spoofing of `created_by`, official badge, and removal flags remains blocked.

#### 3.6 Client JS build pipeline

**Problem:** Large unbundled scripts (`bioclash-attempt.js`, `papers-attempt.js`, `biolab-archive.js`, dashboard scripts, etc.) increase load cost and maintenance surface.

**Target:**
- Introduce esbuild or Vite for `static/js` entry points used by heavy interactive pages.
- Code-split attempt engines so they load only when needed.
- Keep simple pages on plain scripts if preferred.

**Acceptance criteria:**
- Production payloads for attempt pages are smaller.
- Local dev workflow remains simple (`hugo server` + optional watch build).

---

### P2 — Medium term

#### 3.7 Repository size / media strategy

**Problem:** Repo size ~756 MB hurts clone time and CI.

**Target options:**
- Git LFS for large images/diagrams, or
- External CDN / object storage for media with references from content,
- Audit and remove unused assets / temporary files.

**Acceptance criteria:**
- Clone size reduced meaningfully without breaking image links.
- Hugo image pipeline and gitignore rules remain correct.

#### 3.8 Structured errors and logging

**Problem:** Many endpoints return generic 500s; logging is mostly `console.error`.

**Target:**
- Consistent `{ error, code }` JSON shape where safe.
- Request/route context in Sentry (`captureError` already present — extend usage).
- Avoid leaking internal details to clients.

---

### P3 — Longer term

#### 3.9 TypeScript for `api/`

Gradual migration of `_lib` helpers and high-traffic routes to TypeScript for safer refactors.

#### 3.10 Navigation / IA cleanup

Large product surface has densified the main menu. Consider clearer grouping, progressive disclosure, or a secondary nav for Notes sections.

---

## 4. Suggested Sprint Sequencing

### Sprint A (Stabilize)
1. Durable rate limiting  
2. YAML/paper caching  
3. Shared auth across all API routes  

### Sprint B (Correctness & Confidence)
4. Grading unit tests  
5. Expand BiOLab RLS suite  
6. Confirm CI runs both test suites on every PR  

### Sprint C (Performance & DX)
7. Client JS bundling for heavy pages  
8. Media / repo-size strategy  
9. Structured error taxonomy  

---

## 5. Metrics to Track

| Metric | Why |
|--------|-----|
| p95 latency of `bioclash-start-attempt` / `submit-attempt` | Caching + cold-start impact |
| 429 rate and false-positive rate limits | Rate-limit tuning |
| CI duration and flake rate | Test suite health |
| JS payload size on attempt pages | Frontend build success |
| Repo clone size | Media strategy success |
| Sentry error volume by route | Production stability |

---

## 6. Explicit Non-Goals (for this plan)

- Rewriting the stack away from Hugo + Vercel + Supabase
- Replacing BiOLab’s publish-immediately model
- Making client-side anti-cheat a hard security boundary
- Genericizing BiOClash exam content generation with AI (restricted zone remains)

---

## 7. References

- `ARCHITECTURE.md` — system model, RLS boundary, BiOClash/BiOLab design
- `SECURITY.md` — reporting and intentional non-issues
- `AGENTS.md` / `AI_ATTESTATION.txt` — AI policy and restricted zones
- `tests/rls/`, `tests/biolab/` — existing verification harnesses
- Prior codebase reviews (2026-09-15 and 2026-09-18)

---

*This plan is derived from independent codebase review. Implementation order may shift with team capacity and season deadlines (e.g. BiOClash).*
