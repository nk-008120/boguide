---
title: "BioGuide"
description: "Biology Olympiad Preparation Hub — Free study guides, interactive simulators, and practice for IBO, USABO, and INBO."
layout: "wide"
---

{{< hero >}}

<div class="homepage-wrapper">

## 🧬 Why BioGuide?

BioGuide is the only free, comprehensive study guide for biology olympiads that combines:

- **Depth-first content** — IBO targeted depth, Not just name-dropping, not too deep into the rabbitholes.
- **Interactive simulators** — Plotly-powered visualizations that clarify hard concepts, Simulating tests and a lot more to come!
- **Practice problems** — IBO/USABO-style questions with fully explained answers
- **Open contributions** — Anyone can help fix errors or add new topics. Just follow the rules below!

We cover the full IBO syllabus — 15+ sections, 150+ topic pages,666+ Static files, 208+ Interactive widgets, growing every week.

---

## 📖 Syllabus Format Covered: 

{{< section-grid >}}

---

## 🎯 Where to Start

**If you're completely new to olympiad biology:**

1. **[Cell Biology & Biochemistry](/resources/1-cell-molecular/)** — The foundation
2. **[Genetics](/resources/7-genetics/)** — Core concepts for every exam
3. **[Animal Anatomy](/resources/2-animal-anatomy/)** — Systematic approach to anatomy

**If you have a weak spot:** Use the search bar (top right) or browse sections by topic.

**If you're preparing for a specific exam:**
- **USABO:** Focus on Cell Biology, Genetics, and Physiology (heavily tested)
- **IBO:** Expect broad coverage across all sections, with emphasis on data analysis
- **Practical exams:** See the Bioinformatics and Practical sections for hands-on simulations

---

## 🧪 What Makes BioGuide stand Out

{{< interactive-showcase >}}

---

## 🤝 Contribute to BioGuide

BioGuide follows AOGuide's open contribution model:

- **Found an error?** Open a GitHub Issue or submit a PR
- **Want to add a topic?** Follow the template in `handoff.md`
- **Have a better diagram?** Source it and we'll add it

**We need help with:**
- **Expanding our Current BiOrchive** - Send an email to resourcerepository4boguide@gmail.com for this purpose.
- More and improved interactive widgets (especially for Cell/Molecular Biology)
- Adding diagrams to pages that still have placeholders

**[Contribute on GitHub →](https://github.com/nk-008120/boguide)**

---

## 📊 Recent Updates

{{< recent-updates >}}

---

## 💬 Join the Community

- **Discord:** Chat with other students, ask questions, share resources
- **GitHub Issues:** Report typos, request features, discuss content

---

## 📄 License

Content (text) is licensed under **CC BY-NC-SA 4.0** — free to share and adapt for non-commercial purposes, with attribution.

Images: See `image-sources.md` for per-image licensing status. A full licensing audit is pending.

</div>

<style>
/* Homepage-specific styles — extend the existing custom.css */
.homepage-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.homepage-wrapper h2 {
  margin-top: 3rem;
  margin-bottom: 0.75rem;
  font-family: 'Fraunces', serif;
  font-weight: 500;
  font-size: 1.75rem;
  color: #8965c4;
}

.homepage-wrapper h2:first-of-type {
  margin-top: 1rem;
}

.homepage-wrapper p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #334155;
}

.homepage-wrapper ul {
  margin: 0.5rem 0 1.5rem 1.5rem;
  padding: 0;
  list-style: none;
}

.homepage-wrapper ul li {
  padding: 0.4rem 0 0.4rem 1.5rem;
  position: relative;
  font-size: 1.05rem;
}

.homepage-wrapper ul li::before {
  content: "→";
  position: absolute;
  left: 0;
  color: #8965c4;
  font-weight: 600;
}

/* Section grid — used by the {{< section-grid >}} shortcode */
.section-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 2rem;
  margin: 1rem 0 1.5rem;
  padding: 0;
  list-style: none;
}

.section-grid li {
  padding: 0.3rem 0 0.3rem 1.2rem;
  position: relative;
  font-size: 0.95rem;
  list-style: none;
}

.section-grid li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #8965c4;
  font-weight: 700;
}

.section-grid .status-complete {
  color: #16a34a;
}

.section-grid .status-progress {
  color: #f59e0b;
}

.section-grid .status-planned {
  color: #94a3b8;
}

/* Interactive showcase */
.interactive-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.interactive-card {
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e9e9f0;
}

.interactive-card h4 {
  margin: 0 0 0.4rem 0;
  font-family: 'Fraunces', serif;
  font-weight: 500;
  font-size: 1.1rem;
  color: #8965c4;
}

.interactive-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
}

/* Hero styles (moved from hero shortcode to site-wide) */
.hero-wrapper {
  text-align: center;
  padding: 3rem 1.5rem 2rem;
  margin-bottom: 2rem;
}

.hero-title {
  font-family: 'Fraunces', serif;
  font-size: 3.5rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem 0;
  color: #1a1a2e;
}

.hero-title .highlight {
  background: linear-gradient(135deg, #8965c4, #5c7a58);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: #475569;
  margin: 0;
  font-weight: 400;
}

/* Recent updates styling */
.recent-updates ul {
  margin: 0.5rem 0 0;
  padding: 0;
}

.recent-updates li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.95rem;
}

.recent-updates li:last-child {
  border-bottom: none;
}

/* Responsive */
@media (max-width: 640px) {
  .homepage-wrapper {
    padding: 1rem 1rem 3rem;
  }

  .section-grid {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }

  .interactive-showcase {
    grid-template-columns: 1fr;
  }

  .homepage-wrapper h2 {
    font-size: 1.4rem;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1.05rem;
  }
}
</style>