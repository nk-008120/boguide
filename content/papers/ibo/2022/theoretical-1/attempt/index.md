---
title: "Timed Attempt - Theoretical 1"
---

<div id="papers-attempt-root" class="papers-attempt-root">

<section id="attempt-start" class="attempt-screen">
  <h2>Timed Attempt - Theoretical 1</h2>
  <p>50 questions · 180 minutes. This is a sample duration until the real IBO time limit is confirmed - treat it as approximate for now.</p>
  <p>Once you start, the page will try to go fullscreen and the timer begins immediately - there's no pause. You can jump to any question in any order, mark questions for review, and change answers freely before submitting. Subject categories are hidden until after you submit.</p>
  <div id="attempt-last-report-summary"></div>
  <button type="button" id="attempt-start-btn" class="papers-nav-btn papers-nav-next">Start Timed Attempt</button>
</section>

<section id="attempt-live" class="attempt-screen" hidden>
  <div class="attempt-topbar">
    <div class="attempt-timer" id="attempt-timer">--:--</div>
    <button type="button" id="attempt-refullscreen-btn" class="papers-nav-btn" hidden>Re-enter Fullscreen</button>
    <button type="button" id="attempt-submit-btn" class="attempt-submit-btn">Submit Test</button>
  </div>
  <div class="attempt-layout">
    <aside class="attempt-palette" id="attempt-palette"></aside>
    <main class="attempt-main">
      <div class="attempt-question-header">
        <span id="attempt-question-number"></span>
        <button type="button" id="attempt-mark-btn" class="attempt-mark-btn">☆ Mark for Review</button>
      </div>
      <div id="attempt-question-body" class="content"></div>
      <div class="attempt-question-nav">
        <button type="button" id="attempt-prev-btn" class="papers-nav-btn papers-nav-prev">← Previous</button>
        <button type="button" id="attempt-clear-btn" class="papers-nav-btn">Clear Response</button>
        <button type="button" id="attempt-next-btn" class="papers-nav-btn papers-nav-next">Next →</button>
      </div>
    </main>
  </div>
</section>

<section id="attempt-report" class="attempt-screen" hidden></section>

</div>

{{< papers-attempt olympiad="ibo" year="2022" round="theoretical-1" >}}
<script src="/js/papers-attempt.js" defer></script>
