---
title: "Study Resources"
weight: 1
---

## Books & Graded Resources

The grading (S/A/B) isn't a strict ranking. S doesn't automatically mean "better than" A or B. It reflects relevance and recommendation for a given purpose more than raw quality. We no longer host the PDFs directly (see note below): this is a reference list so you know what to look for. If you'd like to help with grading resources, or collecting them, contact at resourcerepository4boguide@gmail.com and we'll be in touch.

<div class="book-filter" role="group" aria-label="Filter books by category">
  <button type="button" class="book-filter-btn is-active" data-cat="all">All</button>
  <button type="button" class="book-filter-btn" data-cat="general">General</button>
  <button type="button" class="book-filter-btn" data-cat="cell">Cell &amp; Molecular</button>
  <button type="button" class="book-filter-btn" data-cat="biochem">Biochemistry</button>
  <button type="button" class="book-filter-btn" data-cat="physio">Physiology &amp; Anatomy</button>
  <button type="button" class="book-filter-btn" data-cat="plants">Plant Biology</button>
  <button type="button" class="book-filter-btn" data-cat="practical">Practical</button>
</div>

### Grade S

<table class="book-table">
  <thead><tr><th>Category</th><th>Title</th><th>Author(s)</th><th>Edition</th></tr></thead>
  <tbody>
    <tr data-cat="physio"><td>Animal Anatomy &amp; Physiology</td><td>Human Physiology: An Integrated Approach</td><td>Dee Unglaub Silverthorn</td><td>8th (Pearson, 2018)</td></tr>
    <tr data-cat="physio"><td>Animal Anatomy &amp; Physiology</td><td>Integrated Principles of Zoology</td><td>Hickman, Roberts &amp; Larson</td><td>18th</td></tr>
    <tr data-cat="physio"><td>Animal Anatomy &amp; Physiology</td><td>Animal Physiology</td><td>Hill, Wyse &amp; Anderson</td><td>4th</td></tr>
    <tr data-cat="physio"><td>Animal Anatomy &amp; Physiology</td><td>Human Physiology: The Mechanisms of Body Function</td><td>Vander et al.</td><td>17th</td></tr>
    <tr data-cat="biochem"><td>Biochemistry</td><td>Lehninger Principles of Biochemistry</td><td>Nelson &amp; Cox</td><td>6th</td></tr>
    <tr data-cat="general"><td>General Biology</td><td>Campbell Biology</td><td>Jane B. Reece et al.</td><td>16th</td></tr>
    <tr data-cat="cell"><td>Molecular Biology of the Cell</td><td>Molecular Biology of the Cell</td><td>Alberts et al.</td><td>7th</td></tr>
    <tr data-cat="plants"><td>Plant Biology</td><td>Plant Physiology and Development</td><td>Taiz, Møller, Murphy &amp; Zeiger</td><td>7th</td></tr>
    <tr data-cat="plants"><td>Plant Biology</td><td>Biology of Plants</td><td>Raven, Evert &amp; Eichhorn</td><td>8th (2012)</td></tr>
  </tbody>
</table>

### Grade A

<table class="book-table">
  <thead><tr><th>Category</th><th>Title</th><th>Author(s)</th><th>Edition</th></tr></thead>
  <tbody>
    <tr data-cat="physio"><td>Animal Anatomy &amp; Physiology</td><td>Human Physiology: From Cells to Systems</td><td>Lauralee Sherwood</td><td>8th</td></tr>
    <tr data-cat="physio"><td>Animal Anatomy &amp; Physiology</td><td>Anatomy &amp; Physiology</td><td>Gerard J. Tortora</td><td>15th (2017)</td></tr>
    <tr data-cat="biochem"><td>Biochemistry</td><td>Color Atlas of Biochemistry</td><td>Jan Koolman</td><td>3rd</td></tr>
    <tr data-cat="physio"><td>Biomedical Sciences</td><td>Textbook of Medical Physiology</td><td>Guyton &amp; Hall</td><td>14th</td></tr>
    <tr data-cat="general"><td>General Biology</td><td>Biology</td><td>Raven &amp; Johnson</td><td>6th</td></tr>
    <tr data-cat="cell"><td>Molecular Biology</td><td>Molecular Cell Biology</td><td>Lodish Et Al.</td><td>9th</td></tr>
    <tr data-cat="plants"><td>Plant Biology</td><td>Introductory Plant Biology</td><td>Stern</td><td>15th</td></tr>
  </tbody>
</table>

### Grade B

<table class="book-table">
  <thead><tr><th>Category</th><th>Title</th><th>Author(s)</th><th>Edition</th></tr></thead>
  <tbody>
    <tr data-cat="biochem"><td>Biochemistry</td><td>Lippincott's Illustrated Reviews: Biochemistry</td><td>&mdash;</td><td>6th</td></tr>
    <tr data-cat="general"><td>General Biology</td><td>Biological Science</td><td>D.J. Taylor (Taylor, Green &amp; Stout)</td><td>&mdash;</td></tr>
  </tbody>
</table>

### Practical Books

<table class="book-table">
  <thead><tr><th>Category</th><th>Title</th><th>Author(s)</th></tr></thead>
  <tbody>
    <tr data-cat="physio practical"><td>Animal Anatomy</td><td>Practical Zoology: Vertebrate</td><td>Dr. SS Lal</td></tr>
    <tr data-cat="physio practical"><td>Animal Anatomy</td><td>Practical Zoology: Invertebrate</td><td>Dr. SS Lal</td></tr>
    <tr data-cat="cell practical"><td>Biomolecular Science</td><td>Brock Biology of Microorganisms</td><td>Michael T. Madigan, Kelly S. Bender, Daniel H. Buckley, W. Matthew Sattley, and David A. Stahl</td></tr>
    <tr data-cat="cell practical"><td>Biomolecular Science</td><td>Practical Skills in Biomolecular Science</td><td>Rob Reed, Jonathan Weyers, David A. Holmes, and Allan Jones</td></tr>
    <tr data-cat="plants practical"><td>Plant Biology</td><td>Anatomy of Seed Plants</td><td>Katherine Esau</td></tr>
  </tbody>
</table>

<p class="book-empty" hidden>No books match this category yet.</p>

<script>
(function() {
  var buttons = document.querySelectorAll('.book-filter-btn');
  var rows = document.querySelectorAll('.book-table tbody tr');
  var tables = document.querySelectorAll('.book-table');
  var empty = document.querySelector('.book-empty');
  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var cat = btn.getAttribute('data-cat');
      buttons.forEach(function(b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var visibleCount = 0;
      rows.forEach(function(row) {
        var cats = (row.getAttribute('data-cat') || '').split(/\s+/);
        var show = cat === 'all' || cats.indexOf(cat) !== -1;
        row.hidden = !show;
        if (show) visibleCount++;
      });
      tables.forEach(function(table) {
        var anyVisible = table.querySelectorAll('tbody tr:not([hidden])').length > 0;
        var heading = table.previousElementSibling;
        while (heading && heading.tagName !== 'H3') {
          heading = heading.previousElementSibling;
        }
        table.hidden = !anyVisible;
        if (heading) heading.hidden = !anyVisible;
      });
      if (empty) empty.hidden = visibleCount > 0;
    });
  });
})();
</script>

## Browse All Subjects

Sections marked **✅ Verified** have gone through our full review workflow (see [About](../about/)) and are considered complete; the rest are still in progress.

{{< cards cols="3" >}}
  {{< card link="1-cell-molecular/" title="1. Molecular, Cell Biology & Biochemistry" subtitle="Cell structure, biomolecules, enzymes, membrane transport, and core biochemical pathways." tag="✅ Verified" tagColor="green" >}}
  {{< card link="2-animal-anatomy/" title="2. Animal Anatomy" subtitle="Structural anatomy for IBO/USABO, from human systems to comparative vertebrate and invertebrate body plans." tag="✅ Verified" tagColor="green" >}}
  {{< card link="3-animal-physiology/" title="3. Animal Physiology" subtitle="The function-side complement to Animal Anatomy: regulatory and organ-system mechanisms across taxa." tag="✅ Verified" tagColor="green" >}}
  {{< card link="4-biosystematics/" title="4. Biosystematics" subtitle="Classification and phylogenetics: taxonomic hierarchy, species concepts, cladistics, molecular systematics." >}}
  {{< card link="5-plant-physiology/" title="5. Plant Physiology" subtitle="Water/nutrient transport, photosynthetic biochemistry, hormone-driven growth, and stress physiology." tag="✅ Verified" tagColor="green" >}}
  {{< card link="6-plant-anatomy/" title="6. Plant Anatomy" subtitle="Plant tissue systems, root/stem/leaf structure, and reproductive anatomy." tag="✅ Verified" tagColor="green" >}}
  {{< card link="7-genetics/" title="7. Genetics" subtitle="Mendelian inheritance and its extensions, sex linkage and pedigree analysis, chromosomal linkage/mapping and aberrations, and quantitative/non-Mendelian inheritance." tag="✅ Verified" tagColor="green" >}}
  {{< card link="8-ecology/" title="8. Ecology" subtitle="Population dynamics, community ecology, ecosystems, biogeography, and conservation biology." tag="✅ Verified" tagColor="green" >}}
  {{< card link="9-ethology/" title="9. Ethology" subtitle="Animal behavior: proximate/ultimate causation, learning, communication, and social structure." tag="✅ Verified" tagColor="green" >}}
  {{< card link="10-bioinformatics/" title="10. Bioinformatics" subtitle="Databases, BLAST, alignments, phylogenetics, genome analysis, and protein structure." tag="✅ Verified" tagColor="green" >}}
  {{< card link="11-practical-1/" title="11. Practical I" subtitle="Coming soon." >}}
  {{< card link="12-practical-2/" title="12. Practical II" subtitle="Coming soon." >}}
  {{< card link="13-practical-3/" title="13. Practical III" subtitle="Coming soon." >}}
  {{< card link="14-practical-4/" title="14. Plant Computational Biology" subtitle="ImageJ/Fiji image analysis and Streamlit interactive plotting for the IBO practical." tag="✅ Verified" tagColor="green" >}}
  {{< card link="15-evolution/" title="15. Evolution" subtitle="Evidence for evolution, population genetics, speciation, macroevolution, and evo-devo." tag="✅ Verified" tagColor="green" >}}
{{< /cards >}}

---

## How This Guide Approaches Teaching

Biology olympiads test comprehensive logical reasoning rather than pure rote memorisation, but that's a double-edged sword. Lean too heavily on working things out from the question context alone, without solid concept familiarity underneath, and your accuracy *and* your time management both suffer. So while you don't need to memorise everything, genuine familiarity with the core concepts and ideas matters more here than in most exams.

This guide leans on interactive material, static diagrams, and dense text over video. That's deliberate: we want you to build understanding through words and images/graphs first, since that's closer to how you'll actually need to reason during the exam. Most students using this guide aren't aiming for the international stage or a research career either, so the notes are written to be useful at every level of Biology Olympiad preparation, not just for students chasing IBO qualification.

For material this guide doesn't cover in enough depth, the [USABO Handouts](https://www.bioly.guide/handouts) are a good beginner-friendly supplement (though a little thin for more advanced students).

## Recommended Video Creators

Video isn't the primary format here, but these creators are worth a look when a topic isn't clicking from text alone:

- **[Bozeman Science](https://www.bozemanscience.com/)**, Paul Anderson's clear, concise instructional videos, widely used to help students master complex science topics.
- **[Professor Dave Explains](https://www.youtube.com/@ProfessorDaveExplains)** (YouTube)
- **[The Organic Chemistry Tutor](https://www.youtube.com/@theorganicchemistrytutor)** (YouTube): strong on the two common biostatistics standards (great playlist on this specifically), biochemistry, and select biology topics.
- **[Amoeba Sisters](https://www.youtube.com/@AmoebaSisters)** (YouTube), cartoon biology, a lighter way to review.
- **[AK Lectures](https://aklectures.com/)**, a library of lectures with simple explanations for difficult topics.
- **[The Bumbling Biochemist](https://www.youtube.com/@thebumblingbiochemist)** (YouTube), sharp takes on biochemistry and molecular biology lab practice; good as background listening for retention.
- **[Khan Academy](https://www.youtube.com/@khanacademy)** (YouTube), needs no introduction.
- **[LibreTexts Chemistry](https://chem.libretexts.org/)**

## Practice Papers & Solutions

- **Practice papers** from biology competitions worldwide are collected in [this Drive folder](https://drive.google.com/drive/folders/1ZErb3YopEleXaGFlu_BZN2LtaYWj637P?usp=drive_link) (still being filled in). The password for past IBO papers is available [here](https://www.reddit.com/r/biologyolympiads/comments/13pp7hi/does_anyone_knows_the_password_to_past_pappers_of/), use at your own discretion, for legal reasons we can't host it directly. If you have papers we're missing, email them to [resourcerepository4boguide@gmail.com](mailto:resourcerepository4boguide@gmail.com).
- **Solutions** to past olympiad papers are collected [here](https://drive.google.com/drive/folders/1j-qbzGLBW3l4IWUYWRF5RP-Xx8oBevTB?usp=sharing), currently just sample IBO 2022 solutions, with more to come.

## A Note on Devices

This site is best used on a laptop, PC, or equivalent. During testing, a few features, the 3D graphs (Streamlit/Plotly) and the mock IBO 2022 practical, weren't available on mobile. The written notes themselves are fully accessible on any device. Sorry for the inconvenience in the meantime.
