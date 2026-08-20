---
title: "How the Dashboard Works"
description: "A walkthrough of how BiOGuide's personalized study dashboard tracks your practice history and generates recommendations."
layout: "wide"
---

<div class="homepage-wrapper" style="max-width:1060px;">

## What is the Study Dashboard?

The Study Dashboard is your personal command center on BiOGuide. It watches how you perform on timed practice papers, builds a knowledge profile from your results, and tells you exactly what to study next -- ranked by what will help you the most.

It is completely free, works entirely in your browser, and only requires a BiOGuide account with at least one submitted timed attempt.

Let's walk through it by following Bhavyaa, one of BiOGuide's own team members, as she would have used the system to prepare for IBO.

---

## Bhavyaa's journey, step by step

### 1. She creates an account and sets her target

Bhavyaa signs up at the [Account page](/account/), picks an avatar, and selects **IBO** from the Target Olympiad dropdown under Profile. This tells the recommendation engine to prioritize IBO syllabus topics when ranking her study suggestions. If she had skipped this, the system would default to IBO anyway (the broadest scope), but setting it explicitly means the engine knows for sure.

<div class="guide-visual">
<div class="guide-mockup">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:0.5rem;">
<div style="width:28px;height:28px;border-radius:50%;background:rgba(137,101,196,0.12);display:flex;align-items:center;justify-content:center;font-weight:600;font-size:0.7rem;color:#8965c4;">B</div>
<div><div style="font-weight:600;font-size:0.78rem;">Bhavyaa</div><div style="font-size:0.65rem;color:#64748b;">IBO 2022 aspirant</div></div>
</div>
<div style="font-size:0.68rem;color:#64748b;margin-bottom:0.3rem;">Score breakdown</div>
<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:0.5rem;">
<span style="font-family:'Fraunces',serif;font-size:1.3rem;font-weight:500;">142 <span style="font-size:0.75rem;color:#64748b;">/ 258</span></span>
<span style="font-family:'Fraunces',serif;font-size:1.1rem;font-weight:500;color:#f97316;">55%</span>
</div>
<div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:0.3rem;">Subject accuracy</div>
<div class="gm-bar"><span class="gm-bar-name">Enzyme Kinetics</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:25%;background:#dc2626"></div></div><span class="gm-bar-pct" style="color:#dc2626">25%</span></div>
<div class="gm-bar"><span class="gm-bar-name">Membrane Transport</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:38%;background:#f97316"></div></div><span class="gm-bar-pct" style="color:#f97316">38%</span></div>
<div class="gm-bar"><span class="gm-bar-name">DNA Replication</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:42%;background:#f97316"></div></div><span class="gm-bar-pct" style="color:#f97316">42%</span></div>
<div class="gm-bar"><span class="gm-bar-name">Pedigree Analysis</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:100%;background:#16a34a"></div></div><span class="gm-bar-pct" style="color:#16a34a">100%</span></div>
<div class="gm-bar"><span class="gm-bar-name">Natural Selection</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:85%;background:#22c55e"></div></div><span class="gm-bar-pct" style="color:#22c55e">85%</span></div>
<div class="gm-bar"><span class="gm-bar-name">Ecology</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:92%;background:#16a34a"></div></div><span class="gm-bar-pct" style="color:#16a34a">92%</span></div>
<div class="gm-rec-card" style="background:rgba(220,38,38,0.06);border-left:3px solid #dc2626;margin-top:0.5rem;">
<div class="gm-rec-title" style="color:#dc2626;">Focus on 5 subjects</div>
<div class="gm-rec-body">Enzyme Kinetics stands out as your weakest spot</div>
</div>
</div>
<div class="guide-mockup-caption">Post-attempt report</div>
</div>

### 2. She takes her first timed attempt

Bhavyaa heads to [BiOrchive](/papers/), picks IBO 2022 Theoretical 1, and starts a timed attempt. She works through all 50 questions under exam conditions, submits, and clicks **Submit to Leaderboard** to save the result.

Her score lands at 142/258 (55%) (It won't because she's smart, if bhavyaa's reading this, please dont be mad at me!). The report screen immediately shows per-subject accuracy bars -- she can see that Enzyme Kinetics is at 25%, Membrane Transport at 38%, while Genetics and Ecology are both above 85%. (Again, it won't tho)

Below the bars, the report gives her stateless recommendations based on this single attempt: "Focus on 5 subjects", "Enzyme Kinetics stands out as your weakest spot", "Keep doing what's working -- Genetics, Ecology are solid (85%+)".

Since this is her first attempt, the knowledge enrichment section at the bottom does not add persistent-weakness cards yet (it needs 2+ attempts to detect patterns). But it does show a **"View your study dashboard"** link. Her full knowledge profile gets cached in her browser for the rest of this session.

*(Disclaimer - (You know she made me write this) Bhavyaa is not actually stupid enough to score so low. Please note that this is an illustrative example. It does not represent the reality. In fact, she is really smart and gorgeous. (Why this too? -))*

<div style="clear:both"></div>

<div class="guide-visual">
<div class="guide-mockup">
<div class="gm-head">Bhavyaa's study dashboard</div>
<div class="gm-stat-grid">
<div class="gm-stat"><div class="gm-stat-num">1</div><div class="gm-stat-lbl">Attempts</div></div>
<div class="gm-stat"><div class="gm-stat-num">55%</div><div class="gm-stat-lbl">Average</div></div>
<div class="gm-stat"><div class="gm-stat-num" style="color:#22c55e;">3</div><div class="gm-stat-lbl">Strong</div></div>
<div class="gm-stat"><div class="gm-stat-num" style="color:#dc2626;">5</div><div class="gm-stat-lbl">Weak</div></div>
</div>
<div style="font-size:0.72rem;font-weight:600;color:#8965c4;margin-bottom:0.3rem;">Study recommendations</div>
<div style="font-size:0.62rem;font-weight:600;color:#dc2626;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:3px;">Priority study</div>
<div class="gm-rec-card" style="background:rgba(220,38,38,0.06);border-left:3px solid #dc2626;">
<div class="gm-rec-title" style="color:#991b1b;">Enzyme Kinetics <span class="gm-badge" style="background:#dc2626;">critical 25%</span></div>
</div>
<div class="gm-rec-card" style="background:rgba(249,115,22,0.06);border-left:3px solid #f97316;">
<div class="gm-rec-title" style="color:#9a3412;">Membrane Transport <span class="gm-badge" style="background:#f97316;">weak 38%</span></div>
</div>
<div style="font-size:0.62rem;font-weight:600;color:#2563eb;text-transform:uppercase;letter-spacing:0.04em;margin:0.35rem 0 3px;">Prerequisite gaps</div>
<div class="gm-rec-card" style="background:rgba(37,99,235,0.05);border-left:3px solid #2563eb;">
<div class="gm-rec-body" style="color:#1e40af;">Before <b>Signal Transduction</b>, strengthen <b>Membrane Transport</b> and <b>Protein Structure</b></div>
</div>
<div style="font-size:0.62rem;font-weight:600;color:#059669;text-transform:uppercase;letter-spacing:0.04em;margin:0.35rem 0 3px;">Expand coverage</div>
<div class="gm-rec-card" style="background:rgba(5,150,105,0.05);border-left:3px solid #059669;">
<div class="gm-rec-body" style="color:#065f46;">Explore <b>Ethology</b> -- untested, falls under 9. Ethology</div>
</div>
<div style="font-size:0.72rem;font-weight:600;color:#8965c4;margin:0.55rem 0 0.2rem;">Subject mastery</div>
<div class="gm-section-label">1. Cell and Molecular Biology</div>
<div class="gm-bar"><span class="gm-bar-name">Enzyme Kinetics</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:25%;background:#dc2626"></div></div><span class="gm-bar-pct" style="color:#dc2626">25%</span></div>
<div class="gm-bar"><span class="gm-bar-name">Membrane Transport</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:38%;background:#f97316"></div></div><span class="gm-bar-pct" style="color:#f97316">38%</span></div>
<div class="gm-bar"><span class="gm-bar-name">Protein Structure</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:58%;background:#f59e0b"></div></div><span class="gm-bar-pct" style="color:#f59e0b">58%</span></div>
<div class="gm-section-label">4. Genetics and Evolution</div>
<div class="gm-bar"><span class="gm-bar-name">Pedigree Analysis</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:100%;background:#16a34a"></div></div><span class="gm-bar-pct" style="color:#16a34a">100%</span></div>
<div class="gm-bar"><span class="gm-bar-name">Natural Selection</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:85%;background:#22c55e"></div></div><span class="gm-bar-pct" style="color:#22c55e">85%</span></div>
<div class="gm-section-label">7. Ecology and Conservation</div>
<div class="gm-bar"><span class="gm-bar-name">Ecology</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:92%;background:#16a34a"></div></div><span class="gm-bar-pct" style="color:#16a34a">92%</span></div>
</div>
<div class="guide-mockup-caption">Bhavyaa's dashboard after 1 attempt</div>
</div>

### 3. She visits the Dashboard

Bhavyaa clicks through to [her Dashboard](/dashboard/). Here is what she sees:

**Summary stats at the top** -- 1 attempt, 55% average score, 3 strong subjects, 5 weak subjects.

**Study Recommendations** -- 10 ranked cards, grouped into buckets:

- **Priority Study**: "Focus on Enzyme Kinetics" (25% accuracy, critical), "Focus on Membrane Transport" (38%, weak), and three more of her worst subjects. These are the topics where her score is lowest and where study time will have the biggest impact.
- **Prerequisite Gaps**: "Cover prerequisites first -- before tackling Signal Transduction, strengthen Membrane Transport and Protein Structure." The engine walked the prerequisite chain in the topic graph and found that Bhavyaa has not mastered the foundations yet. Instead of sending her straight to a topic she is not ready for, it redirects her to the building blocks.
- **Expand Coverage**: "Expand into Ethology -- you have not been tested on this yet. It falls under 9. Ethology." These are syllabus sections Bhavyaa has zero data on, so the engine nudges her to explore them.
- **Revisit Soon**: Empty for now. This bucket will activate later when older attempts start aging past 30 days.

**Subject Mastery** -- colored bars for every subject she was tested on, grouped by syllabus section. Enzyme Kinetics shows a red "Critical" badge at 25%. Genetics shows a green "Strong" badge at 87%. Each subject name links to its topic page.

**Section Coverage** -- "1. Cell & Molecular Biology: 8/15 topics tested, avg mastery 52%". She can see which sections she has barely touched.

**Recent Attempts** -- her one submission: IBO 2022 Theoretical 1, 55%, today's date.

(Finally, Don't be mad at me!)

<div style="clear:both"></div>

<div class="guide-visual">
<div class="guide-mockup">
<div style="font-size:0.78rem;font-weight:600;margin-bottom:0.3rem;">Enzyme Kinetics & Regulation</div>
<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:0.5rem;">
<span style="background:#fef3c7;color:#92400e;padding:1px 7px;border-radius:99px;font-size:0.62rem;font-weight:600;">Advanced</span>
<span style="background:rgba(137,101,196,0.12);color:#6d4fa3;padding:1px 7px;border-radius:99px;font-size:0.62rem;font-weight:600;">IBO</span>
<span style="background:rgba(137,101,196,0.12);color:#6d4fa3;padding:1px 7px;border-radius:99px;font-size:0.62rem;font-weight:600;">USABO</span>
<span style="background:rgba(220,38,38,0.1);color:#dc2626;padding:1px 7px;border-radius:99px;font-size:0.62rem;font-weight:600;">Critical 25%</span>
</div>
<div style="font-size:0.68rem;color:#64748b;">Based on 12 statements across 1 attempt</div>
<div style="border-top:1px solid #e9e9f0;margin-top:0.5rem;padding-top:0.5rem;font-size:0.68rem;color:#64748b;">
<div style="font-weight:600;color:#1a1a2e;margin-bottom:3px;">Prerequisites</div>
Protein Structure, Folding and Function
</div>
</div>
<div class="guide-mockup-caption">Topic page mastery badge</div>
</div>

### 4. She studies a topic page

Bhavyaa clicks on Enzyme Kinetics from the dashboard. On the topic page, she sees the usual metadata badges (Intermediate difficulty, Prerequisites: Protein Structure, Syllabus: IBO/USABO) plus a new small inline badge: **"Critical 25%"** in red, with a tooltip reading "Based on 12 statements across 1 attempt". This comes from the cached profile the dashboard built earlier -- no extra loading, it just appears.

She reads the topic, works through the examples, and feels more confident.

<div style="clear:both"></div>

<div class="guide-visual">
<div class="guide-mockup">
<div style="font-size:0.78rem;font-weight:600;margin-bottom:0.4rem;">Question Bank</div>
<div style="display:flex;align-items:center;gap:6px;margin-bottom:0.5rem;flex-wrap:wrap;">
<span style="background:#f0f0f0;color:#374151;padding:2px 8px;border-radius:6px;font-size:0.65rem;">IBO</span>
<span style="background:#f0f0f0;color:#374151;padding:2px 8px;border-radius:6px;font-size:0.65rem;">Medium</span>
<span style="background:#8965c4;color:#fff;padding:2px 8px;border-radius:6px;font-size:0.65rem;font-weight:600;">Weak areas first</span>
</div>
<div style="border:1px solid #e9e9f0;border-radius:8px;overflow:hidden;">
<div style="display:flex;padding:4px 8px;background:#f9fafb;border-bottom:1px solid #e9e9f0;font-size:0.62rem;color:#64748b;font-weight:600;">
<span style="flex:1;">Question</span><span style="width:80px;">Subject</span><span style="width:45px;text-align:right;">Your %</span>
</div>
<div style="display:flex;padding:5px 8px;border-bottom:1px solid #f0f0f0;font-size:0.68rem;background:rgba(220,38,38,0.03);">
<span style="flex:1;">IBO 2022 T1 Q2</span><span style="width:80px;color:#dc2626;font-weight:500;">Enz. Kinetics</span><span style="width:45px;text-align:right;color:#dc2626;font-weight:600;">25%</span>
</div>
<div style="display:flex;padding:5px 8px;border-bottom:1px solid #f0f0f0;font-size:0.68rem;background:rgba(220,38,38,0.03);">
<span style="flex:1;">IBO 2022 T1 Q3</span><span style="width:80px;color:#dc2626;font-weight:500;">Enz. Kinetics</span><span style="width:45px;text-align:right;color:#dc2626;font-weight:600;">25%</span>
</div>
<div style="display:flex;padding:5px 8px;border-bottom:1px solid #f0f0f0;font-size:0.68rem;background:rgba(249,115,22,0.03);">
<span style="flex:1;">IBO 2022 T1 Q6</span><span style="width:80px;color:#f97316;font-weight:500;">Memb. Trans.</span><span style="width:45px;text-align:right;color:#f97316;font-weight:600;">25%</span>
</div>
<div style="display:flex;padding:5px 8px;font-size:0.68rem;">
<span style="flex:1;color:#9ca3af;">+ 47 more questions</span>
</div>
</div>
</div>
<div class="guide-mockup-caption">Question bank with weak areas toggle</div>
</div>

### 5. She drills weak areas in the Question Bank

Bhavyaa visits the [Question Bank](/papers/question-bank/) to practice targeted questions. Because she has a cached knowledge profile, a **"Weak areas first"** toggle button is now visible in the filter bar. She clicks it.

The entire table reorders: questions tagged with Enzyme Kinetics, Membrane Transport, and her other weak subjects float to the top. She combines this with the "IBO" olympiad filter and "Medium" difficulty to build a focused drill session on exactly the questions that will help her most.

<div style="clear:both"></div>

<div class="guide-visual">
<div class="guide-mockup">
<div style="font-size:0.72rem;font-weight:600;color:#8965c4;margin-bottom:0.3rem;">After IBO 2023 Theoretical 2 -- 68%</div>
<div style="font-size:0.68rem;color:#64748b;margin-bottom:0.5rem;">Knowledge enrichment cards:</div>
<div class="gm-rec-card" style="background:rgba(220,38,38,0.06);border-left:3px solid #dc2626;margin-bottom:6px;">
<div class="gm-rec-title" style="color:#991b1b;">Persistent weakness across attempts</div>
<div class="gm-rec-body">Enzyme Kinetics (32%), Membrane Transport (45%) -- weak across 2+ attempts. Targeted study before your next round should help.</div>
</div>
<div class="gm-rec-card" style="background:rgba(137,101,196,0.06);border-left:3px solid #8965c4;">
<div class="gm-rec-title" style="color:#5b3d8f;">View your study dashboard</div>
<div class="gm-rec-body">Your full knowledge profile is built from 2 attempts. See all your strengths, weaknesses, and personalized recommendations.</div>
</div>
<div style="border-top:1px solid #e9e9f0;margin-top:0.5rem;padding-top:0.45rem;">
<div style="font-size:0.65rem;color:#64748b;margin-bottom:3px;">If a subject declines instead:</div>
<div class="gm-rec-card" style="background:rgba(220,38,38,0.06);border-left:3px solid #dc2626;">
<div class="gm-rec-title" style="color:#991b1b;">Declining in 1 subject</div>
<div class="gm-rec-body">Enzyme Kinetics (22%, 2 attempts) -- trending downward. Consider a different study approach.</div>
</div>
</div>
</div>
<div class="guide-mockup-caption">Post-attempt enrichment cards</div>
</div>

### 6. Two weeks later, she takes a second attempt

Bhavyaa does IBO 2023 Theoretical 2. This time she scores 68% -- a solid improvement. After submitting, her report shows the usual single-attempt recommendations, but now extra cards appear at the bottom:

- **"Persistent weakness across attempts"**: "Enzyme Kinetics (32%), Membrane Transport (45%) -- weak across 2+ attempts. Targeted study before your next round should help." These subjects were weak in her first attempt and are still weak now. The engine highlights them specifically because the pattern has persisted.
- **"View your study dashboard"**: "Your full knowledge profile is built from 2 attempts. See all your strengths, weaknesses, and personalized recommendations in one place."

If Enzyme Kinetics had actually gotten worse (say 20% this time vs 25% last time), she would see a sharper warning: **"Declining in 1 subject"** -- "Enzyme Kinetics (22%, 2 attempts) -- this has been trending downward. Consider a different study approach or resource."

<div style="clear:both"></div>

<div class="guide-visual">
<div class="guide-mockup">
<div class="gm-head">Updated dashboard</div>
<div class="gm-stat-grid">
<div class="gm-stat"><div class="gm-stat-num">2</div><div class="gm-stat-lbl">Attempts</div></div>
<div class="gm-stat"><div class="gm-stat-num">62%</div><div class="gm-stat-lbl">Average</div></div>
<div class="gm-stat"><div class="gm-stat-num" style="color:#22c55e;">5</div><div class="gm-stat-lbl">Strong</div></div>
<div class="gm-stat"><div class="gm-stat-num" style="color:#dc2626;">3</div><div class="gm-stat-lbl">Weak</div></div>
</div>
<div style="font-size:0.72rem;font-weight:600;color:#8965c4;margin-bottom:0.2rem;">Subject mastery</div>
<div class="gm-section-label">1. Cell and Molecular Biology</div>
<div class="gm-bar"><span class="gm-bar-name">Enzyme Kinetics</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:30%;background:#dc2626"></div></div><span class="gm-bar-pct" style="color:#dc2626">30%</span><span class="gm-trend" style="color:#f97316;">&#8594;</span></div>
<div class="gm-bar"><span class="gm-bar-name">Membrane Transport</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:45%;background:#f97316"></div></div><span class="gm-bar-pct" style="color:#f97316">45%</span><span class="gm-trend" style="color:#22c55e;">&#8593;</span></div>
<div class="gm-bar"><span class="gm-bar-name">Protein Structure</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:62%;background:#f59e0b"></div></div><span class="gm-bar-pct" style="color:#f59e0b">62%</span><span class="gm-trend" style="color:#22c55e;">&#8593;</span></div>
<div class="gm-section-label">4. Genetics and Evolution</div>
<div class="gm-bar"><span class="gm-bar-name">Pedigree Analysis</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:95%;background:#16a34a"></div></div><span class="gm-bar-pct" style="color:#16a34a">95%</span><span class="gm-trend" style="color:#22c55e;">&#8593;</span></div>
<div class="gm-bar"><span class="gm-bar-name">Natural Selection</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:88%;background:#22c55e"></div></div><span class="gm-bar-pct" style="color:#22c55e">88%</span><span class="gm-trend" style="color:#22c55e;">&#8593;</span></div>
<div class="gm-section-label">7. Ecology and Conservation</div>
<div class="gm-bar"><span class="gm-bar-name">Ecology</span><div class="gm-bar-track"><div class="gm-bar-fill" style="width:92%;background:#16a34a"></div></div><span class="gm-bar-pct" style="color:#16a34a">92%</span><span class="gm-trend" style="color:#f97316;">&#8594;</span></div>
<div style="margin-top:0.5rem;font-size:0.72rem;font-weight:600;color:#8965c4;">Recent attempts</div>
<div style="display:flex;align-items:center;gap:6px;padding:4px 0;font-size:0.68rem;border-bottom:1px solid #f0f0f0;">
<span style="flex:1;font-weight:500;">IBO 2023 T2</span><span style="color:#22c55e;font-weight:600;">68%</span><span style="color:#64748b;font-size:0.62rem;">Today</span>
</div>
<div style="display:flex;align-items:center;gap:6px;padding:4px 0;font-size:0.68rem;">
<span style="flex:1;font-weight:500;">IBO 2022 T1</span><span style="color:#f97316;font-weight:600;">55%</span><span style="color:#64748b;font-size:0.62rem;">2 wks ago</span>
</div>
</div>
<div class="guide-mockup-caption">Dashboard after 2 attempts with trends</div>
</div>

### 7. The Dashboard updates

Back on the Dashboard, everything has recalculated. The mastery scores now use time-decay weighting: the two-week-old first attempt gets weight 0.8 while the fresh second attempt gets full weight 1.0. So her current performance counts more than the older result.

Trend arrows appear next to subjects: an upward arrow on topics she improved on (maybe Ecology went from 85% to 92%), stable arrows where nothing changed much, and a downward arrow if anything slipped.

The recommendations reshuffle. Subjects she improved on drop in priority. Enzyme Kinetics, still critical after two attempts, stays at the top. Topics she has not touched in a while will start getting "Revisit Soon" cards once they age past 30 days.

Over time, as Bhavyaa takes more papers, the profile gets richer, the trends get more reliable, and the recommendations get sharper. The system learns what she knows and what she does not, and keeps pointing her toward the highest-impact study sessions.

<div style="clear:both"></div>

---

## How the scoring works

**Time-decay weighting**: Recent attempts count more than old ones. An attempt from yesterday gets full weight; one from 3 months ago gets half weight. This means your dashboard reflects where you are now, not where you were months ago.

| Age of attempt | Weight |
|---|---|
| Less than 7 days | 1.0 |
| 7 to 30 days | 0.8 |
| 30 to 90 days | 0.5 |
| Over 90 days | 0.3 |

**Sample confidence**: A subject tested with only 2 statements is not as reliable as one tested with 20. The engine scales down the mastery score for small samples until you have at least 12 statements (about 3 questions) worth of data.

**Mastery levels** are determined by the combination of weighted accuracy and sample confidence:

| Level | Score range |
|---|---|
| Untested | Too few statements to judge |
| Critical | Below 35% |
| Weak | 35% to 55% |
| Developing | 55% to 75% |
| Strong | 75% to 90% |
| Mastered | 90% and above |

**Trend detection**: The engine compares your most recent attempt's accuracy on each subject against the average of all your earlier attempts. A difference of more than 10 percentage points triggers an "improving" or "declining" trend arrow.

---

## How recommendations are ranked

Each topic in the syllabus gets a priority score from 0 to 1, calculated as:

| Factor | Weight | What it measures |
|---|---|---|
| Weakness signal | 40% | How badly you need this topic (critical = 1.0, mastered = 0.0) |
| Prerequisite readiness | 25% | Are the prerequisites covered? (all met = 1.0, blockers = 0.1) |
| Exam relevance | 15% | Does it match your target olympiad's syllabus? |
| Coverage gap | 10% | Is this in a section you have barely touched? |
| Recency boost | 10% | Has it been a long time since you last practiced this? |

The engine then sorts all topics by priority, assigns them to the four recommendation buckets, and shows you the top 10.

---

## Privacy and data

- All computation happens in your browser. Your attempt data is fetched from your BiOGuide account (stored in Supabase) and crunched locally -- nothing is sent to any third-party analytics service.
- The knowledge profile is cached in your browser's sessionStorage for the current tab session, so topic pages and the question bank can display your mastery without extra network calls. It clears when you close the tab.
- Only you can see your dashboard. Other users cannot view your mastery data.

---

## Getting started

<div style="display:flex;flex-wrap:wrap;gap:1rem;margin-top:1rem;">
  <a href="/account/" class="btn-primary">Create an Account</a>
  <a href="/papers/" class="btn-outline">Take a Practice Paper</a>
  <a href="/dashboard/" class="btn-outline">Go to Dashboard</a>
</div>

</div>
