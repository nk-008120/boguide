---
title: "Submit a Protocol — BiOLab"
description: "Write up your own lab protocol and publish it to the BiOLab archive immediately credited to you, no staff review queue."
layout: "wide"
---

<div id="biolab-submit-root" class="biolab-archive-page biolab-submit-page">

<div class="biolab-archive-header">
  <span class="biolab-eyebrow">BIOLAB ARCHIVE</span>
  <h1 class="biolab-archive-h1">Submit a Protocol</h1>
  <p class="biolab-archive-intro">Write up a lab protocol on any topic; materials, steps, safety notes; It publishes to the archive the moment you submit it. There's no staff review queue before it goes live, so read the disclaimer below carefully before you continue.</p>
</div>

<a href="/biolab/archive/" class="papers-nav-btn biolab-archive-back-link">← Back to the archive</a>

<div id="biolab-submit-status" class="discussions-status">Loading…</div>
<form id="biolab-submit-form" class="discussions-form biolab-submit-form" hidden>

  <label class="biolab-submit-label" for="biolab-submit-title">Title</label>
  <input type="text" id="biolab-submit-title" name="title" maxlength="140" placeholder="e.g. Iodine Clock Reaction" required>

  <label class="biolab-submit-label" for="biolab-submit-category">Category</label>
  <select id="biolab-submit-category" name="category" required>
    <option value="" disabled selected>Choose a category…</option>
    <option value="physiology">🫀 Physiology</option>
    <option value="biochemistry">⚗️ Biochemistry</option>
    <option value="molecular-biology">🧬 Molecular biology</option>
    <option value="microbiology">🦠 Microbiology</option>
    <option value="ecology">🌿 Ecology</option>
    <option value="genetics">🧫 Genetics</option>
    <option value="anatomy">🦴 Anatomy</option>
    <option value="other">✨ Other</option>
  </select>

  <label class="biolab-submit-label" for="biolab-submit-description">Short description <span class="biolab-feedback-hint">(shown on the archive card, optional)</span></label>
  <input type="text" id="biolab-submit-description" name="description" maxlength="200" placeholder="One sentence summarizing the protocol">

  <label class="biolab-submit-label" for="biolab-submit-body">Full protocol <span class="biolab-feedback-hint">(materials, steps, safety notes)</span></label>
  <textarea id="biolab-submit-body" name="body" maxlength="8000" rows="12" placeholder="Materials:
- ...

Steps:
1. ...

Safety notes:
- ..." required></textarea>

  <label class="biolab-submit-label" for="biolab-submit-attribution">Source attribution <span class="biolab-feedback-hint">(optional but encouraged - credit where this came from)</span></label>
  <input type="text" id="biolab-submit-attribution" name="source_attribution" maxlength="300" placeholder="e.g. Adapted from [competition/publication name], or leave blank if this is entirely your own">

  <div class="biolab-archive-capture-box">
    <label class="biolab-submit-label" for="biolab-submit-attachments">Workflow PDF <span class="biolab-feedback-hint">(optional, up to 5 files, 10MB each - a printable checklist, data sheet, or reference workflow, not required to submit)</span></label>
    <input type="file" accept="application/pdf,.pdf" multiple id="biolab-submit-attachments">
    <div class="biolab-archive-capture-preview" id="biolab-submit-attachments-preview" hidden></div>
  </div>

  <div class="biolab-caution-box biolab-submit-disclaimer">
    <span class="biolab-caution-label">⚠️ Before you submit, please read</span>
    <p id="biolab-submit-disclaimer-text">By submitting this protocol, you confirm it is your own original work, or that you have properly credited its real source. You understand that BiOGuide does not review community-submitted protocols before they publish, and that neither BiOGuide nor its team verifies their safety, accuracy, or suitability for any particular lab or audience. Following this protocol is your own responsibility, observe your own institution's safety rules at all times.</p>
    <label class="biolab-submit-ack-label">
      <input type="checkbox" id="biolab-submit-ack" name="acknowledged_disclaimer" required>
      I have read this and I agree.
    </label>
  </div>

  <button type="submit" class="papers-nav-btn papers-nav-next">Publish protocol</button>
  <div class="discussions-msg" id="biolab-submit-msg"></div>
</form>

</div>

<script src="/js/biolab-submit-protocol.js" defer></script>
