---
title: "BiOClash — an independent biology competition"
layout: "wide"
images: ["/og-bioclash.png"]
---

<div id="bioclash-root" class="bioclash-page">
<div class="bioclash-landing-bg" aria-hidden="true"></div>

<div id="bioclash-curtains" class="bioclash-curtains" role="button" tabindex="0" aria-label="Click, or press Enter, to raise the curtain and reveal BiOClash">
  <div class="bioclash-curtain-valance" aria-hidden="true"></div>
  <div class="bioclash-curtain-panel bioclash-curtain-left" aria-hidden="true"></div>
  <div class="bioclash-curtain-panel bioclash-curtain-right" aria-hidden="true"></div>
  <div class="bioclash-curtain-prompt" aria-hidden="true">
    <span class="bioclash-curtain-prompt-mark">✦</span>
    <span class="bioclash-curtain-prompt-text">Click to raise the curtain</span>
    <span class="bioclash-curtain-prompt-mark">✦</span>
  </div>
</div>
<script>
/* Synchronous (not defer) and runs exactly here, before the rest of the
   page paints — deliberately NOT in papers-bioclash.js. The curtain is
   display:none by default in CSS; this decides whether to reveal it BEFORE
   first paint, so a repeat visitor who's already opened it this session
   never sees it flash on then get hidden a beat later by the deferred
   script. Deliberately does NOT skip for prefers-reduced-motion — that
   only shortens the open animation (see custom.css section 15b's
   reduced-motion block), it doesn't hide the curtain outright. Withholding
   the whole click-to-reveal interaction from reduced-motion visitors would
   mean some real visitors never see the feature at all; softening the
   motion is the correct accessibility response here, not removing it. */
(function () {
  var el = document.getElementById('bioclash-curtains');
  if (!el) return;
  var alreadyOpened = false;
  try { alreadyOpened = sessionStorage.getItem('bioclash-curtains-opened') === '1'; } catch (e) {}
  if (!alreadyOpened) el.style.display = 'block';
})();
</script>

<section class="bioclash-hero">
  <div class="bioclash-hero-bg" aria-hidden="true">
    <svg width="0" height="0" style="position:absolute">
      <symbol id="bioclash-dna-motif" viewBox="0 0 60 220">
        <path d="M10 0 C 50 27, -30 55, 10 82 C 50 109, -30 137, 10 164 C 50 191, -30 219, 10 220" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        <path d="M50 0 C 10 27, 90 55, 50 82 C 10 109, 90 137, 50 164 C 10 191, 90 219, 50 220" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        <line x1="12" y1="14" x2="48" y2="14" stroke="currentColor" stroke-width="2" opacity="0.65"/>
        <line x1="26" y1="41" x2="34" y2="41" stroke="currentColor" stroke-width="2" opacity="0.65"/>
        <line x1="12" y1="96" x2="48" y2="96" stroke="currentColor" stroke-width="2" opacity="0.65"/>
        <line x1="26" y1="123" x2="34" y2="123" stroke="currentColor" stroke-width="2" opacity="0.65"/>
        <line x1="12" y1="178" x2="48" y2="178" stroke="currentColor" stroke-width="2" opacity="0.65"/>
        <line x1="26" y1="205" x2="34" y2="205" stroke="currentColor" stroke-width="2" opacity="0.65"/>
      </symbol>
    </svg>
    <svg class="bioclash-dna-strand bioclash-dna-1" viewBox="0 0 60 220"><use href="#bioclash-dna-motif"></use></svg>
    <svg class="bioclash-dna-strand bioclash-dna-2" viewBox="0 0 60 220"><use href="#bioclash-dna-motif"></use></svg>
    <svg class="bioclash-dna-strand bioclash-dna-3" viewBox="0 0 60 220"><use href="#bioclash-dna-motif"></use></svg>
    <svg class="bioclash-dna-strand bioclash-dna-4" viewBox="0 0 60 220"><use href="#bioclash-dna-motif"></use></svg>
    <svg class="bioclash-dna-strand bioclash-dna-5" viewBox="0 0 60 220"><use href="#bioclash-dna-motif"></use></svg>
  </div>
  <p class="bioclash-eyebrow">OPEN Season 1: targeting September 11</p>
  <h1 class="bioclash-wordmark">BiOClash</h1>
  <p class="bioclash-tagline">An independent biology competition, built the same way as everything else here.</p>
  <p id="bioclash-countdown" class="bioclash-countdown" aria-live="polite">Loading countdown…</p>
  <div class="bioclash-hero-actions">
    <a href="#bioclash-notify-section" class="bioclash-btn bioclash-btn-primary"><span class="bioclash-btn-shine" aria-hidden="true"></span><span>Get notified</span></a>
    <a href="https://discord.gg/WpC8y6dbv" class="bioclash-icon-link" target="_blank" rel="noreferrer" title="Discord: look for #bioclash-updates">{{< icon "discord" >}}</a>
    <a href="https://www.instagram.com/bioguideofficial/" class="bioclash-icon-link" target="_blank" rel="noreferrer" title="Instagram">{{< icon "instagram" >}}</a>
  </div>
</section>

<section class="bioclash-section bioclash-panel">
  <h2>What it is</h2>
  <p>BiOClash is an original biology competition, not a translated IBO/USABO paper archive like BiOrchive, but questions written and reviewed by BiOGuide itself. It's the one part of this site where the content is genuinely ours, not a licensed reproduction.</p>
  <p>Right now, it's still being built. Here's what we're planning, and how to hear the moment it's ready.</p>
</section>

<section class="bioclash-section bioclash-panel">
  <h2>What's being planned</h2>
  <ul class="bioclash-planning-list">
    <li><span class="papers-pill bioclash-pill">Format</span> Planning timed, solo rounds: heavily scrutinized and difficult.</li>
    <li><span class="papers-pill bioclash-pill">Scope</span> Aiming to cover the full IBO syllabus.</li>
    <li><span class="papers-pill bioclash-pill">Frequency</span> Planning a full season of subject-focused rounds spread across the year: Molecular Biology &amp; Biochemistry, Animal Anatomy &amp; Physiology, Genetics &amp; Evolution, Plant Anatomy &amp; Physiology, Ecology, Ethology, and Biosystematics, capped off by a Full Syllabus round in the weeks before IBO, with placements across the season aiming to add up to one cumulative season ranking.</li>
    <li><span class="papers-pill bioclash-pill">Timing</span> Subject rounds are planned to run 90 minutes, with the Full Syllabus round given longer. An optional short extension is planned to be available during an attempt, at a competitive cost rather than as free extra time.</li>
    <li><span class="papers-pill bioclash-pill">Scoring</span> Planning to rank each round by standardized performance relative to that round's own field, not raw marks, closer to how many real olympiads report results than a simple percentage. Season standing is planned to be a weighted composite across every round, not just an average.</li>
    <li><span class="papers-pill bioclash-pill">Recognition</span> Podium finishers may be recognized with an honorary Junior Partner position at BiOGuide.</li>
  </ul>
</section>

<section class="bioclash-section bioclash-panel">
  <h2>Why it exists</h2>
  <p>Plenty of biology competitions already exist, but most are institutional, expensive to access, or slow to modernize. BiOGuide itself runs on the same principles as everything else here: <a href="/about/">non-commercial, built by students, for students</a>. BiOClash is that same approach applied to the competition format itself, not just notes and papers.</p>
</section>

<section class="bioclash-section bioclash-panel">
  <h2>Get involved</h2>
  <p>BiOClash is green-field; nothing is set in stone yet. If you'd want to help design questions, write rounds, or shape the format, this is one of the most open-ended ways to join as a Content Reviewer or Partner. Reach out: <a href="mailto:resourcerepository4boguide@gmail.com">resourcerepository4boguide@gmail.com</a>.</p>
</section>

<section id="bioclash-notify-section" class="bioclash-section bioclash-panel bioclash-notify-section">
  <h2>Get notified</h2>
  <div id="bioclash-notify" class="bioclash-notify" data-next="/bioclash/">
    <p class="bioclash-notify-msg">Loading…</p>
  </div>
  <p class="bioclash-notify-alt">Prefer not to log in? Follow along on <a href="https://discord.gg/WpC8y6dbv" target="_blank" rel="noreferrer">Discord (#bioclash-updates)</a> or <a href="https://www.instagram.com/bioguideofficial/" target="_blank" rel="noreferrer">Instagram</a> instead.</p>
</section>

</div>

<script src="/js/papers-bioclash.js" defer></script>
<script src="/js/bioclash-landing-theme.js" defer></script>
