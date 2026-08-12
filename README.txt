## AI Usage Policy
This codebase is certified human-crafted with minimal, disclosed AI assistance. Read our full [AI Attestation Statement](./AI-ATTESTATION.md).


NOTE - PRUNED ALL 132 COMMITS BEFORE 12th of August 2026 due to commit history overload and git repo cleanup. ALL COMMITS SQUASHED AS WEBSITE SET INTO PRODUCTION.
HISTORY AVAILABLE IN BRANCH backup-unwanted-state.
STAY CLEAN!


# BioGuide — Biology Olympiad Preparation Hub


[![Built with Hugo](https://img.shields.io/badge/Built%20with-Hugo-ff4088?style=flat&logo=hugo)](https://gohugo.io/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Hextra Theme](https://img.shields.io/badge/Theme-Hextra-3b82f6?style=flat)](https://github.com/imfing/hextra)

**BioGuide** is a free, open-core study guide for IBO (International Biology Olympiad), USABO, and other biology olympiad aspirants. It's built with **Hugo** and the **Hextra** theme, designed to be fast, accessible, and comprehensive.

**Live site:** [boguide.vercel.app](https://boguide.vercel.app)

---

## 📚 What BioGuide Covers

BioGuide follows the full IBO/USABO syllabus, organized into 15+ major sections:

| Section | Topics | Status |
|---------|--------|--------|
| **1. Cell & Molecular Biology** | Cell structure, organelles, membranes, cytoskeleton, cell cycle, DNA replication, transcription, translation, gene regulation, metabolism, biotechnology techniques, analytical methods | ✅ Content Complete (23 pages) |
| **2. Animal Anatomy** | Comparative anatomy across vertebrates: skeletal, muscular, nervous, circulatory, respiratory, digestive, excretory, reproductive, endocrine systems | ✅ Content Complete (16 pages) |
| **3. Animal Physiology** | Homeostasis, thermoregulation, osmoregulation, gas exchange, circulation, digestion, immunity, nervous signaling, endocrine signaling, muscle contraction, comparative respiration | ✅ Content Complete (13 pages) |
| **4. Biosystematics** | Classification, phylogenetics, evolutionary relationships, cladistics | ✅ Content Complete (7 pages) |
| **5. Plant Physiology** | Water transport, mineral nutrition, photosynthesis, respiration, growth, hormone signaling, stress responses | ✅ Content Complete |
| **6. Plant Anatomy** | Tissues, roots, stems, leaves, flowers, fruits, seeds, monocot vs. dicot | ✅ Content Complete (10 pages) |
| **7. Genetics** | Mendelian inheritance, linkage, population genetics, molecular genetics | 📝 Old TOC page — to be rewritten |
| **8. Ecology** | Population ecology, community ecology, ecosystem dynamics | ✅ Content Complete |
| **9. Ethology** | Animal behavior, learning, communication, social behavior | ✅ Content Complete (9 pages) |
| **10. Bioinformatics** | Sequence alignment, phylogenetics, computational biology | ✅ Content Complete |
| **11. Evolution** | Mechanisms of evolution, speciation, adaptation | ✅ Content Complete (11 pages) |
| **12-14. Practicals** | Lab techniques, data analysis, experimental design | ✅ Content Complete |
| **15. Evolution** | Synthesis/deferral section | ✅ Content Complete |

*Each section follows a consistent template:* Overview → Key Concepts → Comparative Structures → Common Exam Questions → Visual Reference → Practice Problems.

---

## 🎨 Design Identity

BioGuide has a custom visual identity built on top of Hextra:

- **Palette:** Lilac (`#8965c4`) + Sage (`#5c7a58`), with a custom gradient background
- **Typography:** Fraunces (display serif) for headings, Inter for body text
- **Theme system:** Light / Dark / System / **Favourite** (a 4th custom theme, now the default)
- **Difficulty badges:** Beginner (green), Intermediate (amber), Advanced (purple)

See [`aesthetics-context.md`](./aesthetics-context.md) for full design documentation.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Static Site Generator** | Hugo (v0.162+) |
| **Theme** | Hextra (customized) |
| **Styling** | Tailwind CSS + Custom CSS (~1020 lines) |
| **Math Rendering** | MathJax (client-side, via `{{< mathjax >}}` shortcode) |
| **Interactive Widgets** | Plotly + Vanilla JS + SVG (standalone HTML files under `static/`) |
| **Hosting** | Vercel |
| **Version Control** | Git + GitHub |

---

## 🚀 Getting Started (Development)

### Prerequisites

- [Hugo (extended)](https://gohugo.io/installation/) — v0.162 or later
- Git
- (Optional) Node.js + npm for theme asset builds

### Clone & Run Locally

```bash
# Clone the repo
git clone https://github.com/your-username/bioguide.git
cd bioguide

# Start the Hugo dev server
hugo server --disableFastRender

# Visit http://localhost:1313