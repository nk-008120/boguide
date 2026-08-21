---
title: "IBO Results Analysis"
---

{{< biorchive-bg >}}

<style>
.results-hub { max-width: 780px; margin: 0 auto; }
.results-hub h2 { font-family: 'Fraunces', serif; font-size: 1.6rem; margin: 2rem 0 0.5rem; }
.results-hub p { color: var(--tw-prose-body, #555); line-height: 1.7; }
.results-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
.results-card {
  display: block; padding: 1.5rem; border-radius: 12px;
  background: rgba(137,101,196,0.06); border: 1px solid rgba(137,101,196,0.15);
  text-decoration: none !important; transition: border-color 0.2s, box-shadow 0.2s;
}
.results-card:hover { border-color: #8965c4; box-shadow: 0 2px 12px rgba(137,101,196,0.12); }
.results-card .year { font-family: 'Fraunces', serif; font-size: 1.8rem; font-weight: 700; color: #8965c4; }
.results-card .host { font-size: 0.95rem; color: var(--tw-prose-body, #555); margin: 0.25rem 0 0.5rem; }
.results-card .meta { font-size: 0.82rem; color: var(--tw-prose-body, #888); }
:is(.dark) .results-card { background: rgba(137,101,196,0.08); border-color: rgba(137,101,196,0.2); }
:is(.dark) .results-card .host, :is(.dark) .results-card .meta { color: #aaa; }
</style>

<div class="results-hub">

<p>
Statistical breakdowns of official IBO final results. Each page covers medal cutoffs, station difficulty, country standings, theory-versus-practical balance, and data-driven training insights.
</p>

<h2>Year-by-Year Analyses</h2>

<div class="results-cards">
  <a class="results-card" href="/papers/ibo/results/2026/">
    <div class="year">2026</div>
    <div class="host">Vilnius, Lithuania</div>
    <div class="meta">302 competitors / 78 countries / 4 practical labs</div>
  </a>
  <a class="results-card" href="/papers/ibo/results/2025/">
    <div class="year">2025</div>
    <div class="host">Quezon City, Philippines</div>
    <div class="meta">298 competitors / 81 countries / 4 practical labs</div>
  </a>
  <a class="results-card" href="/papers/ibo/results/2024/">
    <div class="year">2024</div>
    <div class="host">Astana, Kazakhstan</div>
    <div class="meta">203 competitors / 66 countries / 4 practical labs</div>
  </a>
  <a class="results-card" href="/papers/ibo/results/2023/">
    <div class="year">2023</div>
    <div class="host">Al Ain, UAE</div>
    <div class="meta">244 competitors / 63 countries / 4 practical labs</div>
  </a>
  <a class="results-card" href="/papers/ibo/results/2022/">
    <div class="year">2022</div>
    <div class="host">Yerevan, Armenia (Online)</div>
    <div class="meta">237 competitors / 59 countries / 4 practical labs</div>
  </a>
</div>

<h2>Cross-Year Analysis</h2>

<div class="results-cards">
  <a class="results-card" href="/papers/ibo/results/cross-year/">
    <div class="year" style="font-size:1.4rem;">2022 - 2026</div>
    <div class="host">How the IBO changed across five years</div>
    <div class="meta">Medal thresholds, difficulty trends, country trajectories, theory vs. practical shifts</div>
  </a>
</div>

<p style="margin-top:2rem; font-size:0.85rem; color:#888;">
Analysis computed from official IBO final results PDFs. Not an official IBO publication.
</p>

</div>
