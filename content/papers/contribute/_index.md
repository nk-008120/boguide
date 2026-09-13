---
title: "Contribute to BiOrchive"
description: "Submit a source paper for staff to ingest, propose a correction to existing content, or share an original solution/study note — all reviewed by staff before going live."
layout: "wide"
---

<div id="papers-contribute-root" class="biolab-archive-page">

<div class="biolab-archive-header">
  <span class="biolab-eyebrow">BIORCHIVE</span>
  <h1 class="biolab-archive-h1">Contribute</h1>
  <p class="biolab-archive-intro">Three ways to help grow the archive. Everything here goes to a staff review queue first — nothing is published automatically, and papers specifically get a licensing check before anything is added, the same way every paper already on the site did.</p>
</div>

<a href="/papers/" class="papers-nav-btn biolab-archive-back-link">← Back to Papers</a>

<div class="papers-contribute-tabs" role="tablist">
  <button type="button" class="papers-contribute-tab active" data-tab="paper" role="tab" aria-selected="true">Submit a Paper</button>
  <button type="button" class="papers-contribute-tab" data-tab="correction" role="tab" aria-selected="false">Suggest a Correction</button>
  <button type="button" class="papers-contribute-tab" data-tab="solution" role="tab" aria-selected="false">Share a Solution/Note</button>
</div>

<div id="papers-contribute-status" class="discussions-status">Loading…</div>

<section class="papers-contribute-panel" data-panel="paper">
  <p class="biolab-feedback-hint">Found an exam paper that isn't on BiOrchive yet? Submit it here instead of emailing it — staff will still check its license before anything is ingested, same as always.</p>
  <form id="paper-contribution-form" class="discussions-form" hidden>
    <label class="biolab-submit-label" for="pc-olympiad">Olympiad</label>
    <input type="text" id="pc-olympiad" name="olympiad" maxlength="100" placeholder="e.g. IBO, USABO, British Biology Olympiad" required>

    <label class="biolab-submit-label" for="pc-year">Year</label>
    <input type="text" id="pc-year" name="year" maxlength="20" placeholder="e.g. 2025" required>

    <label class="biolab-submit-label" for="pc-round">Round / paper label</label>
    <input type="text" id="pc-round" name="round_label" maxlength="200" placeholder="e.g. Theoretical Exam 2, Semifinal Exam" required>

    <label class="biolab-submit-label" for="pc-source-url">Where you found it <span class="biolab-feedback-hint">(a link, if there is one)</span></label>
    <input type="url" id="pc-source-url" name="source_url" maxlength="2000" placeholder="https://...">

    <label class="biolab-submit-label" for="pc-license">What does the source say about reuse? <span class="biolab-feedback-hint">(required — this is the single most important field; "I don't know" is a valid answer, but please say so rather than guessing)</span></label>
    <textarea id="pc-license" name="license_note" maxlength="2000" rows="3" placeholder="e.g. 'The exam PDF's own first page says CC BY-NC-SA 4.0' or 'No license statement found anywhere, I'm not sure about reuse rights'" required></textarea>

    <label class="biolab-submit-label" for="pc-exam-file">Exam PDF <span class="biolab-feedback-hint">(required, up to 10MB)</span></label>
    <input type="file" accept="application/pdf,.pdf" id="pc-exam-file" required>

    <label class="biolab-submit-label" for="pc-answer-file">Answer key PDF <span class="biolab-feedback-hint">(optional, up to 10MB)</span></label>
    <input type="file" accept="application/pdf,.pdf" id="pc-answer-file">

    <button type="submit" class="papers-nav-btn papers-nav-next">Submit for review</button>
    <div class="discussions-msg" id="paper-contribution-msg"></div>
  </form>
</section>

<section class="papers-contribute-panel" data-panel="correction" hidden>
  <p class="biolab-feedback-hint">Spotted a wrong subject tag, a typo, or a mis-transcribed answer on a question that's already live? Point us at it.</p>
  <form id="content-correction-form" class="discussions-form" hidden>
    <label class="biolab-submit-label" for="cc-olympiad">Olympiad</label>
    <input type="text" id="cc-olympiad" name="olympiad" maxlength="100" placeholder="e.g. ibo" required>

    <label class="biolab-submit-label" for="cc-year">Year</label>
    <input type="text" id="cc-year" name="year" maxlength="20" placeholder="e.g. 2023" required>

    <label class="biolab-submit-label" for="cc-round">Round ID</label>
    <input type="text" id="cc-round" name="round_id" maxlength="100" placeholder="e.g. theoretical-1" required>

    <label class="biolab-submit-label" for="cc-problem">Question ID</label>
    <input type="text" id="cc-problem" name="problem_id" maxlength="50" placeholder="e.g. q12" required>

    <label class="biolab-submit-label" for="cc-field">What's wrong</label>
    <select id="cc-field" name="field" required>
      <option value="" disabled selected>Choose what needs fixing…</option>
      <option value="subject_tags">Subject tag(s)</option>
      <option value="answer">Answer</option>
      <option value="explanation">Explanation</option>
      <option value="statement_text">Statement/question text</option>
      <option value="figure">Figure/image</option>
      <option value="other">Something else</option>
    </select>

    <label class="biolab-submit-label" for="cc-current">Current value <span class="biolab-feedback-hint">(optional — paste what's there now, if easy to copy)</span></label>
    <textarea id="cc-current" name="current_value" maxlength="2000" rows="2"></textarea>

    <label class="biolab-submit-label" for="cc-proposed">Proposed correction</label>
    <textarea id="cc-proposed" name="proposed_value" maxlength="5000" rows="3" required></textarea>

    <label class="biolab-submit-label" for="cc-reason">Why</label>
    <textarea id="cc-reason" name="reason" maxlength="1000" rows="2" placeholder="What makes you think this is wrong?" required></textarea>

    <button type="submit" class="papers-nav-btn papers-nav-next">Submit for review</button>
    <div class="discussions-msg" id="content-correction-msg"></div>
  </form>
</section>

<section class="papers-contribute-panel" data-panel="solution" hidden>
  <p class="biolab-feedback-hint">Write your own explanation or study note for an existing question — your own words, not a reproduction of the exam or its official solution.</p>
  <form id="community-solution-form" class="discussions-form" hidden>
    <label class="biolab-submit-label" for="cs-olympiad">Olympiad</label>
    <input type="text" id="cs-olympiad" name="olympiad" maxlength="100" placeholder="e.g. ibo" required>

    <label class="biolab-submit-label" for="cs-year">Year</label>
    <input type="text" id="cs-year" name="year" maxlength="20" placeholder="e.g. 2023" required>

    <label class="biolab-submit-label" for="cs-round">Round ID</label>
    <input type="text" id="cs-round" name="round_id" maxlength="100" placeholder="e.g. theoretical-1" required>

    <label class="biolab-submit-label" for="cs-problem">Question ID</label>
    <input type="text" id="cs-problem" name="problem_id" maxlength="50" placeholder="e.g. q12" required>

    <label class="biolab-submit-label" for="cs-body">Your explanation/note</label>
    <textarea id="cs-body" name="body" maxlength="5000" rows="8" placeholder="Explain your own reasoning, an alternative approach, or a study tip for this question — in your own words." required></textarea>

    <button type="submit" class="papers-nav-btn papers-nav-next">Submit for review</button>
    <div class="discussions-msg" id="community-solution-msg"></div>
  </form>
</section>

</div>

<script src="/js/papers-contribute.js" defer></script>
