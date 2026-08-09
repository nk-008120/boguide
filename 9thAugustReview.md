# BiOGuide — Pre-Production Review

**Date:** 2026-08-09. **Scope:** a full pass over the live site immediately before a production push and the start of a social-media growth push. Covers everything fixed in today's session plus a fresh, independent verification pass done specifically for this document (sitewide link/image crawl, SEO/social-sharing checks, mobile spot-check, console/build health). Trust the live code/site over this document if the two ever disagree later — this is a snapshot, not a source of truth.

**Bottom line:** the site is close. Nothing found today is a hard blocker on its own, but one item (the Discussions RLS migration) makes a shipped feature silently broken until you run one SQL command, and two items (no social-preview image, missing `robots.txt`) directly undercut the social-media push you're about to start. Everything else is either already fixed or a known, tracked, non-blocking gap.

---

## 1. What this session fixed (recap)

| Item | What happened |
|---|---|
| **Discussions RLS bug** | Posting a thread/reply failed with `new row violates row-level security policy`. Root cause: `discussions.js` never sent `user_id`. Fix written as [`supabase/migrations/008_discussions_user_id_default.sql`](supabase/migrations/008_discussions_user_id_default.sql) (defaults `user_id` to `auth.uid()` server-side). **⚠️ Not yet confirmed run against production — see §2.1, this is the top item on this list.** |
| **Copyright images** | Of 12 images flagged `CONFIRMED COPYRIGHT` (visible commercial watermarks — Britannica, Pearson, Elsevier/Netter, W.H. Freeman, etc.), **11 are now genuinely fixed** — replaced with unwatermarked sources, or (for the enzyme-kinetics table) removed entirely and rebuilt as a native data table instead of a textbook scan. `image-sources.md` updated throughout. **1 remains unresolved and known-broken by your own choice — see §2.2.** |
| **Avatar picker** | Code expected 12 files named `avatar-01.png`…`avatar-12.png`; disk had 3 `.jpg`s. Now all 12 real files are wired up correctly (mixed extensions are fine — `.avif` was converted to `.png` since the DB's `avatar_url` CHECK constraint doesn't allow `.avif`). Verified all 12 resolve. |
| **Supabase keep-alive** | Free-tier auto-pause after 7 days idle was a real risk with four features now depending on the project. Added `api/keepalive.js` + a daily Vercel Cron entry in `vercel.json`. No manual setup needed — Vercel picks up `crons` from `vercel.json` on deploy. |
| **Dead survey CTA** | `/about/` and `/resources/` no longer claim a closed survey "is live... visit soon." |
| **"Articles" → "BiOInsights"** | Renamed everywhere — nav, homepage, account page, privacy page, the section's own URL (`/articles/` → `/bioinsights/`, with aliases so old links redirect). Verified via crawl. |
| **Font trial** | Tried two combinations, reverted to the original Fraunces/Inter per your call. Confirmed byte-identical to pre-trial state. |

---

## 2. Before you push — ranked by how much it'll hurt if skipped

### 2.1 Run migration 008 (Discussions is currently non-functional) — **do this first**

The Discussions feature you shipped this cycle **cannot accept a single post right now** in production — every "Start a discussion" or "Reply" click fails with the RLS error from your screenshot earlier this session. The fix is written and waiting; it just needs to be run once in the Supabase SQL editor:

```sql
alter table public.discussion_threads alter column user_id set default auth.uid();
alter table public.discussion_comments alter column user_id set default auth.uid();
```

After running it, actually test posting a thread and a reply with a real logged-in account before you consider this closed — don't just trust the SQL ran clean. **Effort: 2 minutes. Impact: a shipped, nav-visible feature is completely dead without it.**

### 2.2 The one unfixed copyrighted image

`static/ANIMALPHYSIOPICS/saltatory-vs-continuous-conduction.jpg`, on [Nervous System Physiology](content/resources/3-animal-physiology/Nervous-System-Physiology/_index.md), still carries the "© 2012 Encyclopaedia Britannica, Inc." watermark — confirmed by opening the file directly, not just trusting the filename. You told me to skip this one for now, which is a reasonable call to make deliberately, but flagging again here since this document is the "final check before launch" record: **this is the single most legally exposed thing still live on the site.** Worth a real fix before — or very soon after — the traffic increases that a social push brings. `image-sources.md`'s row for this file has the full history of both failed attempts, so a fresh session can pick it up without re-deriving anything.

### 2.3 No social-preview image when links get shared — **directly relevant to your next step**

This is a new finding from today's crawl, not something raised before. I checked the actual rendered `<head>` of the homepage and a content page: **there is no `og:image` meta tag anywhere on the site.** Hextra's theme supports one (`site.Params.images` in `hugo.toml`, or per-page `images` front matter) — it's just never been set.

Practically: when a BiOGuide link gets pasted into Discord, Instagram DMs, X/Twitter, or WhatsApp — exactly the channels you're about to lean on — it'll unfurl with a title and description but **no image**, which reads as less trustworthy/lower-effort than a link with a preview card, and gets less engagement. This is a five-minute fix (one `images` line in `hugo.toml` pointing at `/logo.png` or a dedicated social-card image) with outsized payoff given the timing. I did not make this change myself — pick the image you want representing the site in link previews first.

### 2.4 Missing `robots.txt`

Confirmed via direct request: `/robots.txt` 404s. Not a functional bug (Google indexes sites fine without one), but it's a one-file, two-minute addition and there's no reason to skip it for a production launch. A minimal one (`User-agent: *\nAllow: /\nSitemap: https://boguide.vercel.app/sitemap.xml`) is standard. `sitemap.xml` itself is already working correctly (Hugo generates it automatically — verified 361 URLs present, all resolving).

### 2.5 One more broken image, found in today's full-site crawl

`/resources/14-practical-4/` references `/imagejps/imagejp5.png` ("C3 vs C4 plants," Problem 5's combined-practice image) — only `imagejp1-4.png` actually exist in `static/imagejps/`. This is a straightforward content gap (the 5th image was apparently never supplied), not a licensing issue. Confirmed via a full sitewide image crawl (727 unique images checked across all 361 pages) — this was the only other broken image found besides the known saltatory one.

---

## 3. Full-site integrity crawl (new this session)

Ran a real crawl against a local build, not a sample: every URL in `sitemap.xml` (361 pages), every internal link found on those pages (561 unique), every `<img>` src rendered on those pages (727 unique).

| Check | Result |
|---|---|
| All sitemap pages load | ✅ 361/361 return 200 |
| All internal links resolve | ✅ 561/561 return 200 |
| All images resolve | ⚠️ 725/727 — the two exceptions are §2.2 and §2.5 above |
| Clean Hugo build | ✅ zero template/render errors (aside from a known pre-existing Windows file-lock quirk in local dev only — documented in `LOGIN_ROADMAP.md`, doesn't affect Vercel's fresh-container builds) |
| Mobile viewport (375px) | ✅ no horizontal overflow on homepage; spot-checked, not exhaustively swept across all 361 pages — worth a manual skim on a real phone before/soon after launch, particularly BiOClash's custom-themed pages and the leaderboard tables |

---

## 4. Known, already-tracked gaps (not new — carried forward so this doc is a complete snapshot, not just a diff)

These were already documented before today and remain true. Not blockers by themselves, but worth being deliberate about rather than forgetting they exist once traffic starts:

- **Image licensing backlog**: roughly 429 images still logged as `CHECK` (sourced, no watermark, but license not independently confirmed) in `image-sources.md`. Today's session fixed the worst tier (visible commercial watermarks); this broader backlog is a standing, lower-urgency risk that scales with traffic, not something to clear before launch.
- **Minors' data / COPPA-GDPR posture**: `/privacy/` has an honest first-pass age clause (asks under-13 US users to get a parent's help), but there's no actual age gate at signup and no parental-consent mechanism. Reasonable for current scale; worth revisiting if the audience grows materially.
- **No in-app moderation UI**: Discussions and the leaderboard both rely on a manual `profiles.is_hidden` flag set via the Supabase SQL editor — no report button, no admin panel. Fine for a small early audience; a real risk multiplier once Discussions actually starts getting used (which migration 008 is what unblocks).
- **Local dev and production share one Supabase project** — no staging DB. Unrelated to launch readiness, just a standing operational fragility worth fixing eventually.

---

## 5. Suggested order of operations

1. Run migration 008, verify posting actually works (§2.1) — blocks a shipped feature, do this regardless of anything else.
2. Add an `og:image` (§2.3) — cheap, and it's specifically what your very next step (social media push) depends on looking good.
3. Add `robots.txt` (§2.4) — cheap, no reason not to.
4. Source the missing `imagejp5.png` (§2.5) — cheap, contained to one page.
5. Push to production.
6. Circle back to the saltatory image (§2.2) before or very soon after traffic picks up — it's the one item here with real legal weight, not just polish.

Items in §4 are explicitly *not* on this list — they're standing background risk, not launch blockers, and shouldn't hold up shipping.
