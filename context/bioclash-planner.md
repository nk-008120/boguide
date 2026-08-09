**Status as of 2026-08-09: implemented.** This is the original requirements
doc (the founder's raw ask), kept as-is below as the record of what was
actually requested — it does not describe current state, read it as intent,
not as a to-do list. What actually shipped:
- Landing page at `/bioclash/`: hero with curtain-reveal intro (click/Enter
  to open, respects `prefers-reduced-motion` by shortening rather than
  skipping the animation), countdown to the September 11 "Season 1" target,
  a status-honest "what it is"/"what's planned" section (future-tense
  throughout, per the instruction below about not over-committing), and a
  login-based "get notified" mechanism (`profiles.notify_bioclash`).
- New palette (Exam-Paper Crimson: parchment/crimson/gold, explicitly not
  the site's lilac/sage) and typography (headings reuse KaTeX's own
  Computer-Modern-derived font files, already loaded sitewide for math, as
  the LaTeX nod this doc asks for) — confirmed with the founder before
  building, since this was flagged as a subjective call not to guess at.
  Full CSS in `assets/css/custom.css`'s "BIOCLASH" sections.
- A flamboyant, animated hero background (DNA-strand motif) distinct from
  both BiOGuide's default gradient and BiOrchive's own watermark, per the
  hard requirement below.
- A "BiOClash Champions" section on `/papers/leaderboard/` — see
  `SETUP.md` — currently empty (no season has run) since there is
  deliberately no scoring/competition engine yet, only the display
  mechanism, per this doc's own "not the competition system itself" framing.
- **One line from the original ask below was NOT shipped verbatim**: "podium
  winners get honorary Junior Partner position at BiOGuide" was softened in
  the actual copy (to something like "may be recognized with...") after
  confirming with the founder that the flat, unconditional commitment as
  originally phrased wasn't actually intended to ship as-is.
- Icons/Discord/Instagram links, the non-commercial "why" framing tied to
  `about/_index.md`, and the navbar entry were all built as specified below.

Original requirements follow, unedited:

---

Now, we need to do major another addition to the website!  We want to add a Biology competition - The BiOClash to the website. Create a plan on what the BiOClash home page will consist of, and how you will handle the technical side. These are the features i want in it :                                                                           Design — NOT matching your existing identity

Palette: Decide a new palette.

Typography: New typography. Use nuances of Latex as it is the standard exam font.

Hero section: a bit more visual flourish is earned, since it's meant to feel like something to look forward to rather than a reference page. Maybe Dna strands flourishing like leaves on the background, or maybe something else, but very flambouyant (ALSO THIS SHOULD NOT HAVE THE SAME BACKGROUND AS BIOGUIDE OR BIORCHIVE)

A countdown or timeline element  with the target date as September 11 — even " OPEN Season 1: targeting [September 11]" gives the page a sense of motion rather than a static announcement.

Keep it short. A teaser page that's 200 words with a clear "notify me" action outperforms a long page trying to simulate content that doesn't exist yet.                                                                                                                                                                    Content — what to actually put on it now



1. Hero



Name + one-line tagline. Something like: "BiOClash — an independent biology competition, built the same way as everything else here."

A single CTA button: "Get notified" or "Join the Discord for updates" — not "Register," since there's nothing to register for yet.



2. What it is (2-3 sentences, honest about status)



Explain the concept: an original competition (not a reproduction of IBO/USABO papers like BiOrchive) — this is worth stating explicitly, since it's the one place on the site where the content is yours, not a licensed reproduction, which is a real differentiator worth calling out.

Be plain that it's in development: "This is a new project we're building from scratch — here's what we're planning, and how to be first to know when it's ready."



3. What's being planned (framed as intent, not fact)



A short bullet list of the shape you're imagining — format - TIMED ROUNDS, SOLO, HEAVILY SCRUTINIZED AND DIFFICULT, rough scope - FULL IBO SYLLABUS (which sections it'll draw from), frequency - OPEN SEASON IN SPRING AND FALL (BIANNUAL), INVITATIONAL IN DECEMBER AND JUNE.PODIUM WINNERS GET HONORARY JUNIOR PARTNER POSITION AT BIOGUIDE. — but phrase every line as "planning to" / "aiming for," not present tense. This is exactly the trap the medalist-articles line fell into: future-tense framing protects you if the format changes before launch.



4. Why it exists / how it fits BiOGuide

Also explaining why we are hosting one even when there are so many in the world.

Tie it back to your own positioning — same "non-commercial, community-built" framing as the rest of the site, so it doesn't feel like a bolted-on separate product.



5. Get involved



This is a good place to fold in your team-recruitment ask specifically for this feature — e.g. "if you'd want to help design or write questions for BiOClash, this is a great place to start" — since it's a green-field feature, it's genuinely one of the more appealing things a new Content Reviewer or Partner could sink their teeth into versus reviewing existing pages.



6. Notify-me mechanism

LOGIN IS THE PREFERRED MECHANISM. SUGGEST USERS TO LOGIN HERE AND AUTOMATICALLY RECEIVE NOTIFICATIONS FOR THE NEXT SEASON OF BiOClash

Also, icons pointing to a specific Discord channel (#bioclash-updates, tying back into the server structure we discussed) , and the instagram channel