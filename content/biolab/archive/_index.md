---
title: "BiOLab Protocol Archive"
description: "Browse BiOGuide-verified and community-submitted lab protocols, read a protocol, see its feedback and results, or report a problem."
layout: "wide"
---

<div id="biolab-archive-root" class="biolab-archive-page">

<section id="biolab-archive-list-view">
  <div class="biolab-archive-header">
    <span class="biolab-eyebrow">BIOLAB ARCHIVE</span>
    <h1 class="biolab-archive-h1">Protocol Archive</h1>
    <p class="biolab-archive-intro">Every protocol here published the moment its author submitted it, there's no review queue before it goes live. Look for the badge on each card: <strong>BiOGuide-Verified</strong> protocols have been checked by our staff, <strong>Community</strong> ones haven't. See something wrong or unsafe? Use the Report button on the protocol's page.</p>
    <a href="/biolab/submit/" class="btn-primary biolab-submit-cta">+ Submit a protocol</a>
  </div>

  <div class="biolab-archive-controls">
    <input type="search" id="biolab-archive-search" class="biolab-archive-search" placeholder="Search protocols by title, topic, or attribution…" aria-label="Search protocols">
    <select id="biolab-archive-category" class="biolab-archive-category-select" aria-label="Filter by category">
      <option value="">All categories</option>
      <option value="physiology">🫀 Physiology</option>
      <option value="biochemistry">⚗️ Biochemistry</option>
      <option value="molecular-biology">🧬 Molecular biology</option>
      <option value="microbiology">🦠 Microbiology</option>
      <option value="ecology">🌿 Ecology</option>
      <option value="genetics">🧫 Genetics</option>
      <option value="anatomy">🦴 Anatomy</option>
      <option value="other">✨ Other</option>
    </select>
  </div>

  <p id="biolab-archive-list-status" class="discussions-status">Loading protocols…</p>
  <p id="biolab-archive-list-empty" class="discussions-status" hidden>No protocols match your search.</p>
  <div id="biolab-archive-list" class="biolab-archive-list" hidden></div>
</section>

<section id="biolab-archive-detail-view" hidden>
  <a href="/biolab/archive/" class="papers-nav-btn biolab-archive-back-link">← Back to all protocols</a>
  <p id="biolab-archive-detail-status" class="discussions-status">Loading…</p>
  <article id="biolab-archive-protocol" hidden></article>
</section>

</div>

<script src="/js/biolab-archive.js" defer></script>
