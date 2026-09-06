---
title: "Your Study Dashboard"
description: "Personalized study recommendations based on your practice history -- see your strengths, weaknesses, and what to study next."
layout: "wide"
noindex: true
sitemap:
  disable: true
---

<div id="dashboard-root" class="dashboard-wrapper">
  <div id="dashboard-loading" class="dashboard-gate">
    <p>Loading your dashboard...</p>
  </div>
  <div id="dashboard-logged-out" class="dashboard-gate" style="display:none;">
    <h2>Sign in to see your dashboard</h2>
    <p>The study dashboard tracks your practice history and generates personalized recommendations. It requires an account.</p>
    <a href="/account/?next=/dashboard/" class="btn-primary">Sign In or Create Account</a>
    <a href="/dashboard-guide/" class="btn-primary" style="background:linear-gradient(135deg,#5c7a58,#8965c4);">How the Dashboard Works</a>
  </div>
    <div id="dashboard-no-data" class="dashboard-gate" style="display:none;">
    <h2>Take your first practice paper</h2>
    <p>The dashboard builds your knowledge profile from timed attempt submissions. Complete a practice round in BiOrchive and submit your score to the leaderboard to get started.</p>
    <a href="/papers/" class="btn-primary">Go to BiOrchive</a>
    <a href="/dashboard-guide/" class="btn-primary" style="background:linear-gradient(135deg,#5c7a58,#8965c4);">How the Dashboard Works</a>
  </div>
  <div id="dashboard-content" style="display:none;">
    <div id="dashboard-header"></div>
    <div id="dashboard-summary"></div>
    <div id="dashboard-readiness"></div>
    <h2>Study Recommendations</h2>
    <div id="dashboard-recs" class="attempt-rec-list"></div>
    <div id="dashboard-next-paper"></div>
    <div id="dashboard-plan-link"></div>
    <h2>Subject Mastery</h2>
    <div id="dashboard-subjects"></div>
    <h2>Section Coverage</h2>
    <div id="dashboard-sections"></div>
    <h2>Recent Attempts</h2>
    <div id="dashboard-recent"></div>
    <h2>Study Activity</h2>
    <div id="dashboard-streak"></div>
    <div id="dashboard-copy-summary"></div>
  </div>
</div>

<script src="/js/papers-knowledge.js"></script>
<script src="/js/papers-dashboard.js"></script>
