---
title: "✅ Bioinformatics"
weight: 10
description: "Complete bioinformatics guide for IBO: databases, BLAST, alignments, phylogenetics, genome analysis, protein structure, and interactive simulation. Includes worked examples from IBO practicals and lab manuals."
---

<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" id="MathJax-script" async></script>
<script>
  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      processEscapes: true
    }
  };
</script>

<span class="badge-exploration">🌐 IBO 2020–2024 Practicals</span> Bioinformatics tasks appear in almost every IBO exam in the recent years. This guide teaches you **why** and **how** to use each tool, with **worked examples** taken directly from past IBO tasks and standard lab manuals. General Resources for this purpose are : 
<br>1. Good for acquainted people who want to brush up : <a href="https://www.srmist.edu.in/wp-content/uploads/2022/05/Bioinformatics-Lab.pdf" target="_blank">Here</a>
<br>2. Good for beginners to understand role of each tool: <a href="https://vvvcollege.org/dbt/LabManual-Bioinformatics.pdf" target="_blank">Here</a> 
<br>3.People who like to learn form videos: <a href="https://www.youtube.com/@BIOPATHWAY">Here</a>
<br>4. A really recommended resource is our own IBO 2022 Practicals tab (scroll right in tabs section just below and click on IBO Practical 2022)
<br>5. Official IBO reference pdf : <a href="https://www.ibo-info.org/files/downloads/Educational%20Conference%20documents/2024/3.Bioinformatics-in-IBO.pdf"> Here</a>

{{< tabs items="Introduction,Databases &amp; Tools,Sequence Alignment,Phylogenetics,Genome Analysis,Protein Structure,IBO Practical 2022,Lab Manual Examples,Worked Examples,Appendix" >}}

{{< tab name="Introduction" >}}
## What is bioinformatics and why do people test it?

Bioinformatics is the use of computers to store, analyse, and interpret biological data – primarily **DNA, RNA, and protein sequences**. In a typical practical, you will be given access to a custom web application with:

- Pre‑loaded sequence databases (e.g. human genome fragments, bacterial genomes, protein sequences)
- Tools like BLAST, sequence alignment, ORF finder, GC‑skew calculator, and tree builder
- Real biological questions (e.g. “Where is the replication origin of *B. burgdorferi*?” or “Which protein domains are present in HOXA5?”)

**You are not expected to memorise command lines.** Instead, you must understand:

- What each tool does
- How to choose the right tool for a given task
- How to interpret the output (e‑values, alignments, trees, scores)

This guide covers every concept that has appeared in Olympiad bioinformatics at national and international biology olympiads.

{{< badge "Key concept" "info" >}} Bioinformatics problems test **logical thinking and familiarity with common biological databases** – not programming skill.

<!-- VIDEO: Introduction to Bioinformatics (e.g., "Bioinformatics in 10 minutes" from NHGRI) – place link here -->
<!-- IMAGE: Flowchart showing data flow from experiment → database → analysis → interpretation -->

{{< /tab >}}

{{< tab name="Databases &amp; Tools" >}}
## 🧬 Major biological databases – with worked retrieval examples

### Why multiple databases?
Biological data is huge and noisy. Different databases specialise in different types of information. Some are **curated** (manually checked, like Swiss‑Prot), others are **automated** (like TrEMBL). Knowing which one to use saves time and avoids errors.

<!-- IMAGE: A table comparing Swiss‑Prot (reviewed) vs. TrEMBL (unreviewed) with examples -->

### 1. NCBI (National Center for Biotechnology Information)
- **URL**: https://www.ncbi.nlm.nih.gov
- **Contains**: GenBank (nucleotide), RefSeq (curated), Protein, PubMed, SRA
- **Search tool**: Entrez – cross‑database search
- **Concept**: NCBI is the world’s largest molecular biology database. Most sequence retrieval tasks start here.

**Worked Example: Retrieve the FASTA sequence of human beta‑globin (HBB) from NCBI.**
- **Step 1:** Go to NCBI homepage → select “Protein” from the dropdown.
- **Step 2:** In the search box, type `HBB Homo sapiens` and press Enter.
- **Step 3:** Click on the first result (usually NP_000509, hemoglobin subunit beta [Homo sapiens]).
- **Step 4:** On the record page, click the “FASTA” link at the top right.
- **Step 5:** Copy the entire FASTA format (starting with `>NP_000509...`).  
- **Step 6:** (Optional) Save the file as .fasta in notepad.
  *Why?* FASTA is the standard format for sequence input in BLAST, alignment tools, and tree builders.

<a href="https://www.youtube.com/watch?v=QLcmEqBayr0">For fellow video-cers (not recommended)</a>
![FASTA](/BIOINFOPICS/FASTAPROTEIN.png)

### 2. UniProt (Universal Protein Resource)
- **URL**: https://www.uniprot.org
- **Contains**: Swiss‑Prot (reviewed) and TrEMBL (automated)
- **Concept**: UniProt gives functional information (domains, PTMs, subcellular location) that you cannot get from raw sequence alone.

**Worked Example: Find post‑translational modifications (PTMs) of P53355 (Death‑associated protein kinase 1).**
- **Step 1:** Open UniProt, enter `P53355` in the search box.
- **Step 2:** Click on the entry “Death‑associated protein kinase 1”.
- **Step 3:** Scroll down to “PTM / Processing” section.  
  *Result:* The protein is ubiquitinated (lysine residues) and phosphorylated (serine/threonine/tyrosine).  
  *Why?* Understanding PTMs helps predict protein function and regulation.

![UNIPROTPTM](/BIOINFOPICS/UNIPROTPTM.png)

### 3. Expasy – Compute pI/Mw
- **URL**: https://web.expasy.org/compute_pi/
- **Use**: Predict isoelectric point and molecular weight of a protein – important for 2D gel electrophoresis.
- **Concept**: pI is the pH where a protein has net zero charge – it stops moving in an electric field. Mw helps identify bands on a gel.

**Worked Example: For protein Q8N423 (Leukocyte immunoglobulin‑like receptor B2).**
- **Step 1:** Paste the accession number `Q8N423` into the text field.
- **Step 2:** Click “Compute pI/Mw”.
- **Output:** Theoretical pI = 6.79, Mw = 65038.65 Da.  
  *Why?* On a 2D gel (pH 3‑10), this protein will appear near pH 6.8, around 65 kDa.

<!-- VIDEO: 2D gel electrophoresis explained – link -->

### 4. PDB (Protein Data Bank)
- **URL**: https://www.rcsb.org
- **Use**: Download template structures for homology modelling.
- **Concept**: If you know the 3D structure of a similar protein, you can model your protein’s structure.

**Example:** Search for `1OHV` (pig GABA transaminase) → download the `.pdb` file – it will be used as a template to model the human enzyme.

<!-- IMAGE: PDB entry page for 1OHV -->

### 5. Pfam / HMMER
- **URL**: https://www.ebi.ac.uk/interpro/
- **Use**: Identify conserved domains using hmmscan.
- **Concept**: A domain is a region of a protein that folds independently and has a specific function (e.g., DNA binding, catalysis). Pfam collects hidden Markov models (HMMs) of these domains.

## 🔧 Core tools and their applications

| Tool | Purpose | Problem example |
|------|---------|----------------------|
| **BLAST** | Find similar sequences | “Which human protein is most similar to HOXA6?” |
| **ORF Finder** | Locate open reading frames | “Extract Cas9 coding sequence from genomic DNA” |
| **ClustalW / MUSCLE** | Multiple sequence alignment | “Align 16S rRNA sequences of 10 species” |
| **PhyML** | Build phylogenetic tree | “Produce a Newick tree from the alignment” |
| **Window search** | Sliding window analysis | “Find 100 bp window with highest GC content in *B. burgdorferi*” |
| **hmmscan** | Domain search (Pfam) | “Which Pfam domain is repeated in cadherin proteins?” |
| **GENSCAN** | Gene prediction | “Predict exons and introns in a human genomic DNA sequence” |
| **Swiss‑Model** | Homology modelling | “Build 3D model of human GABA transaminase using pig template” |

{{< badge "IBO tip" "info" >}} In the exam, you will never have to **install** software – all tools are provided in a browser interface. Practice with the interactive lab below.

{{< /tab >}}

{{< tab name="Sequence Alignment" >}}
## Why align sequences?

Alignment reveals evolutionary relationships, conserved domains, and functional residues. You will align both **nucleotide** and **protein** sequences.

### Dot plot (graphical method)
- One sequence on X‑axis, the other on Y‑axis. A dot is placed when residues match.
- **Diagonal line** → similarity; **gaps in diagonal** → insertion/deletion; **reverse diagonal** → inversion.
- **Why dot plots?** They give you a visual, intuitive feel for similarities before you run complex algorithms.

For the purpose of teaching Dot-Plot methods, we shall use an exemplary problem from practical 3 of the selection camp of taiwanese biology olympiad programme. Find it in <a href="/dotplot.pdf" target="_blank">here</a>

<a href="#" onclick="switchToTabAndScroll(9, 'Solution-dotplot'); return false;">*Click here after trying it out*</a>

You must note that using the first dotplot (no lines) in the solution (answer for Q1), you should be able to make some intuitive decisions:<br>
1. You should note the largest diagonal line ,and imagine how a permutation would look like, if you shifted it by some insertion or deletion in the sequences. So you should be able to see that the permutation shown in the sample is the best possible score.<br>
2. You should draw the lines as in the second image of the solution. these will help you imagine how different permutations would perform. for example, unintuitively so, if we give a weightage of 1 to an inversion, the inverted line, then becomes second most parsimonious in the dot plot.<br>
3. You should be able to see basics like substitution, and shifts and splices and so on.
If you are able to look through these in suitable time, you are good to go!<br><br>
<!-- VIDEO: Dot plot tutorial (e.g., "Dot matrix method for sequence comparison" from BiotechLekh) -->
<!-- IMAGE: Annotated dot plot showing diagonals, gaps, inversions -->

### Dynamic programming (Needleman‑Wunsch & Smith‑Waterman)
- **Global alignment** (Needleman‑Wunsch): aligns entire sequences. Used for similar length sequences. <a href="https://bioboot.github.io/bimm143_W20/class-material/nw/" target="_blank">Here is an interactive simulator</a>
- **Local alignment** (Smith‑Waterman): finds best matching sub‑region. Used for gene vs. genome. <a href="https://rna.informatik.uni-freiburg.de/Teaching/index.jsp?toolName=Smith-Waterman" target="_blank">Here is an interactive simulator</a>
- **Concept**: Dynamic programming breaks the problem into small sub‑problems (comparing prefixes) and builds up the optimal solution. It guarantees the best alignment under the given scoring scheme.

**Worked Example (from manual)**: Global alignment of AGTAC vs GCAC.
- **Step 1:** Build a scoring matrix (match=+1, mismatch=0, gap=-1).
- **Step 2:** Fill the DP table by taking maximum of three possible moves (left, up, diagonal).
- **Step 3:** Traceback from bottom‑right cell to get the alignment.
- **Result:** Score = 2, alignment = AGTAC‑GCAC.  
  *Why?* This algorithm guarantees the optimal alignment under the chosen scoring scheme.

<a href="https://www.youtube.com/watch?v=VWzXQhHoepI">video-cers (medium recommendation)</a>
<!-- INTERACTIVE: Link to an online DP simulator (e.g., https://biopython.org/Documentation/tutorial/chapter_algorithms.html) -->

### BLAST – heuristic similarity search
- **blastn**: nucleotide vs. nucleotide
- **blastp**: protein vs. protein
- **blastx**: DNA (translated) vs. protein
- **tblastn**: protein vs. translated DNA
- **Concept**: BLAST is fast because it doesn’t try every possible alignment – it first finds short “words” (k‑mers) in common and extends them. It sacrifices exact optimality for speed, which is fine for database searches.

**Worked Example (from manual)**: Find mouse genes similar to human U80226.1.
- **Step 1:** Retrieve the sequence of U80226.1 (human ABAT gene).
- **Step 2:** Run blastn against “Mouse genome+transcript” database.
- **Output:** Top hit NM_172961.3 (mouse Abat gene) with E‑value = 0.0.  
  *Why?* A perfect E‑value (0.0) means the match is highly significant – the two genes are orthologs. Generally, significance threshold is <=1e-05

<!-- VIDEO: How BLAST works (NCBI’s official BLAST tutorial) -->
<!-- IMAGE: BLAST results page with E‑values highlighted -->

### Multiple sequence alignment (MSA)
- Aligns ≥3 sequences. Output format **CLUSTAL** uses `*` (identical), `:` (conserved), `.` (semi‑conserved).
- **Concept**: MSA helps identify conserved positions across a protein family – these are often active site residues or structural anchors.
### Multiple Sequence Alignment (MSA) – Olympiad practice problem

MSA is the foundation of phylogenetic analysis and conserved motif discovery. In this problem, you will analyse five short protein sequences from a zinc‑finger family.

📥 **Download the complete problem statement**: <a href="/msa_problem.pdf" target="_blank">msa_problem.pdf</a>

After you have tried to answer the questions, click below to see the **full solution** (alignment, conserved positions, and cladogram).

<a href="#" onclick="switchToTabAndScroll(9, 'msa-solution'); return false;">🔍 Click here to reveal the solution</a>

{{< badge "IBO tip" "ESSENTIAL!" >}} In the real exam, you will use the provided alignment tool (e.g., ClustalW). Pay attention to the conservation symbols: `*` = identical, `:` = conserved substitution, `.` = semi‑conserved.

**Example**: 16S rRNA of 10 species aligned with MUSCLE. Gaps (`-`) indicate insertions/deletions. The alignment is used as input for tree building.

<!-- VIDEO: Multiple sequence alignment (e.g., from BiotechLekh) -->
<!-- IMAGE: A Clustal alignment snippet with colour-coded conservation -->

{{< badge "Worked example" "success" >}} Always check the E‑value! A value < 1e‑5 is considered significant for most tasks.

{{< /tab >}}

{{< tab name="Phylogenetics" >}}
## How to build and interpret a phylogenetic tree

A tree represents evolutionary relationships. In bioinformatics, trees are built from **aligned sequences** (DNA or protein).

### Types of trees
- **Cladogram**: Branch lengths have no meaning; only branching order.
- **Phylogram**: Branch lengths proportional to genetic distance.

### Methods used most often
(short videos, better to watch)
1. <a href="https://www.youtube.com/watch?v=mgU5aioDGqk">**Neighbour‑joining (NJ)**</a> : distance‑based, fast. Constructs a tree by repeatedly joining the closest pair of taxa.
2. <a href="https://www.youtube.com/watch?v=YJUicKHbWr4">**Maximum Likelihood (ML)**</a> : more accurate, slower (PhyML). Searches for the tree that makes the observed data most probable.
3. <a href="https://www.youtube.com/watch?v=09eD4A_HxVQ">**Unweighted Pair Group Method with Arithmetic Mean (UPGMA)**</a>: No distance, most basic form.
<br>
### 🌲 Exemplary problems: UPGMA, Neighbor‑Joining, and Maximum Likelihood

These problems test your understanding of phylogenetic tree building methods. Download the PDF, solve on paper, then check the solution.

#### Problem 1 – UPGMA (Ultrametric tree from a distance matrix)

📥 <a href="/upgma_problem.pdf" target="_blank">upgma_problem.pdf</a>

<a href="#" onclick="switchToTabAndScroll(9, 'upgma-solution'); return false;">🔍 Click here for the solution (step‑by‑step UPGMA clustering, tree, and common mistakes)</a>

#### Problem 2 – Neighbor‑Joining (Additive tree reconstruction)

📥 <a href="/nj_problem.pdf" target="_blank">nj_problem.pdf</a>

<a href="#" onclick="switchToTabAndScroll(9, 'nj-solution'); return false;">🔍 Click here for the solution (Q‑matrix, selection of neighbors, final tree)</a>

#### Problem 3 – Maximum Likelihood (Conceptual – interpreting likelihood scores and models)

📥 <a href="/ml_problem.pdf" target="_blank">ml_problem.pdf</a>

<a href="#" onclick="switchToTabAndScroll(9, 'ml-solution'); return false;">🔍 Click here for the solution (explanation of likelihood, model selection, and pitfalls)</a>

{{< badge "IBO tip" "warning" >}} In the exam, you will rarely build an NJ or UPGMA tree by hand – but you **must** understand how they work to interpret output and detect errors.

### Newick format (tree representation)
Example: `((Human:0.12, Chimp:0.12):0.05, Mouse:0.17);`

- Parentheses group clades.
- Colon separates node label (optional) from branch length.
- Semicolon ends the tree.

To visualize this tree, go to <a href="https://itol.embl.de/upload.cgi">iTOL tree visualizer</a> <br>
You should obtain these results: ![Results](/BIOINFOPICS/iTOLdemo.png)<BR>
Experiment with various trees to see your results. (Try out the sample tree of IBO 2023 Bioinformatics practical: "(A:0.3,(B:0.4,(C:0.3,D:0.2):0.2):0.1);")

- **Monophyletic group**: common ancestor + **all** descendants.
- **Paraphyletic**: common ancestor but **not all** descendants (e.g. Reptiles excluding birds).
- **Polyphyletic**: no recent common ancestor.
{{< badge "Important" "warning" >}} Always check if the tree is **rooted** or **unrooted** before answering relatedness questions.<BR>
- **Roots**: Always remember to see whether tree is rooted or unrooted. it is very important to decide relative positions and absolute positions and plays a trick in true/false questions.

### NUANCES OF IBO 2023
- Align 16S rRNA → build tree with PhyML.
- Unrooted tree → cannot determine if Archaea is closer to Eukarya or Bacteria without an outgroup.
- Adding a viral sequence does not root the tree because viruses do not share the common ancestor of cellular life.

**Hands‑on**: Use the “Tree Builder” in the interactive lab to generate a Newick tree from your alignment.

{{< /tab >}}

{{< tab name="Genome Analysis" >}}
## Analysing long DNA sequences with sliding windows

When you have a long DNA molecule (e.g. a bacterial chromosome or a 10 kb human genome fragment), properties like GC content can vary locally. **Window search** allows you to calculate a property over a moving window.

### Parameters
- **Window size** (e.g. 100 bp): length of each fragment.
- **Step size** (e.g. 100 bp): shift between windows.
- **Bin size** (e.g. 10%): grouping for histogram.

### GC content
\[
\mathrm{GC\%} = 100 \times \frac{\#G + \#C}{\#A + \#T + \#G + \#C}
\]

- In vertebrates, GC‑rich regions contain more genes, stain lighter with Giemsa (G‑bands), and denature at **higher temperature**.
- **Why GC content matters**: It affects DNA stability, gene density, and chromatin structure.

### GC‑skew
\[
\mathrm{GC\text{-}skew} = \frac{[C] - [G]}{[C] + [G]}
\]

For **circular bacterial genomes**, the replication origin (OriC) and terminus cause a switch in GC‑skew.  
**Reason**: Leading strand synthesis uses more C than G in many bacteria (due to deamination bias).

**Worked Example (*B. burgdorferi*)**
- **Step 1:** Set window size = 200 bp, step = 200 bp, skew = ([C]-[G])/([C]+[G]).
- **Step 2:** Plot GC‑skew along the genome (circular, 910 724 bp).
- **Observation:** Two sharp switching points – one near 50 kb, another near 900 kb (wrap‑around).
- **Step 3:** Use tblastn with DnaA protein sequence to find OriC → region 200–300 kb.  
  *Why?* The switch at 50 kb is the terminus; the switch near 200 kb is the origin (OriC).

<!-- VIDEO: GC-skew and replication origin (e.g., from GOBLET) -->
<!-- IMAGE: GC‑skew plot of *B. burgdorferi* showing two switches -->

### CpG islands and CpG score
- CpG dinucleotides are often methylated in vertebrates (5‑methylcytosine).
- CpG islands are regions with high CpG density, typically near gene promoters.
- CpG score formula: \(\frac{[CpG]}{[C] \times [G]} \times \text{window size}\).
- **Why important**: Promoter methylation silences genes; CpG islands are usually unmethylated in active promoters.

**Worked Example**: For HoxA5, first exon lies under a CpG island. Window search (100 bp, step 100) shows highest CpG score overlapping exon boundaries.

<!-- VIDEO: CpG islands and gene regulation (e.g., from Khan Academy) -->

{{< badge "Challenge" "error" >}} In IBO 2020, you also had to find the **region containing DnaA** (replication initiator) by BLASTing the DnaA protein against the *B. burgdorferi* genome.

{{< /tab >}}

{{< tab name="Protein Structure" >}}
## From sequence to 3D structure

Any discussion on protein structure prediction is incomplete without it's amazing history, with major reakthroughs very recently, resulting in being called the "Fermat's last theorem of biology". Here is a great video on it by the one and only, <a href="https://www.youtube.com/watch?v=P_fHJIYENdI">Veritasium</a>
### Secondary structure prediction
- **α‑helix**: stabilised by backbone hydrogen bonds (i → i+4). Proline and glycine are helix breakers.
- **β‑sheet**: extended, stabilised by inter‑strand hydrogen bonds. Branched/aromatic residues (Ile, Val, Thr, Phe, Tyr, Trp) favour β‑strands.
- **Turns & loops**: connect secondary elements.
- **Concept**: Prediction uses known preferences of amino acids (e.g., Glu and Lys prefer helices). It’s not 100% accurate but useful for quick fold classification.

**Worked Example (from manual)**: Predict secondary structure of P68871 (human beta‑globin).
- **Step 1:** Get FASTA sequence from NCBI.
- **Step 2:** Go to <a href="http://www.compbio.dundee.ac.uk/jpred/">JPred</a> OR <a href="https://alphafoldserver.com"> Alpha fold</a> (Alpha fold is harder to understand, and more time demanding), paste sequence, submit.
- **Output:** Jnet prediction shows α‑helix rich regions (e.g. residues 6–16, 24–35, 102–119). Turn residues at 21–23, 78–80. No β‑strands.  
  *Why?* Globin fold is predominantly α‑helical.

<!-- VIDEO: Secondary structure prediction (e.g., "How JPred works") -->

### 🧬 Homology modelling (comparative modelling)

When the experimental 3D structure of your protein is unknown, but a **homologous protein** with known structure exists, you can build a reliable model.  
**Core idea**: Protein structure evolves slower than sequence. If two proteins share ≥30% sequence identity, they almost certainly have the same overall fold.

#### Step‑by‑step workflow (using free online tools)

1. **Find a template**  
   - Run **BLASTp** (protein‑protein) against the **PDB** database.  
   - Look for a hit with **high identity (>30%)**, low E‑value, and good coverage.  
   - Example: For human GABA transaminase (P80404), BLASTp returns pig 1OHV at 96% identity.

2. **Align target and template**  
   - Use **ClustalW** (or MUSCLE) to align the query (your protein) and the template sequence.  
   - The alignment must be accurate – errors here ruin the model.  
   - 🔗 [ClustalW online](https://www.genome.jp/tools-bin/clustalw)

3. **Build the 3D model**  
   - Upload the alignment to **Swiss‑Model** (fully automated) or **MODELLER** (more control).  
   - Swiss‑Model will automatically generate a model and give you a quality estimate.  
   - 🔗 [Swiss‑Model](https://swissmodel.expasy.org/)

4. **Evaluate model quality** – never trust a model blindly! You should know only how to read the results, even that is a little extreme
   - **Ramachandran plot**: shows whether backbone angles are realistic. >90% residues in “favoured” regions = good.  
   - **QMEAN score**: a composite score where ~0 is ideal, slightly negative is acceptable.  
   - **DOPE score** (MODELLER): more negative = better. Compare with the template’s DOPE score.  
   - **RMSD** (root‑mean‑square deviation) between model and template: <1 Å is excellent.

#### Worked example (from the lab manual)

**Target**: Human 4‑aminobutyrate aminotransferase (P80404, 500 aa)  
**Template**: Pig GABA transaminase (PDB: 1OHV, 472 aa, 96% identity)

- **BLASTp result**: 1OHV, E‑value = 0.0, identities = 453/472 (96%), gaps = 0%.  
- **Alignment**: ClustalW (no gaps needed – trivial).  
- **Model building**: Swiss‑Model (one‑click).  
- **Quality evaluation**:  
  - Ramachandran plot: 99.5% residues in favoured regions → excellent.  
  - QMEAN = –1.13 (acceptable, well within the range of reliable models).  
  - DOPE score (MODELLER): model –55550, template –56652 (both good; model slightly worse but still reliable).  
  - RMSD = 0.07 Å → almost identical backbone.

**Why homology modelling works**: Even if two sequences diverge, their 3D folds are constrained by the same physical forces (hydrophobic collapse, hydrogen bonds, disulfide bridges). A 30% identity threshold is empirical – below that, modelling becomes risky.

{{< badge "Exploration" "info" >}} Practice with Swiss‑Model using any protein of interest. Try a low‑identity template (>30%) and see how the QMEAN score warns you about low reliability.

### Quality indicators
- **Ramachandran plot**: Shows allowed φ, ψ angles. >90% residues in “favoured” regions = good.
- **QMEAN score**: ~0 is ideal, negative acceptable if not too low.
- **DOPE score**: more negative = better (compare with template).

<!-- VIDEO: Homology modelling with Swiss‑Model (official tutorial) -->
<!-- IMAGE: Ramachandran plot example -->

{{< badge "Exploration" "info" >}} Use Swiss‑PDB Viewer (free) to visualise models, superimpose structures, and measure distances (RMSD < 1 Å is excellent).

{{< /tab >}}


{{< tab name="Interactive - IBO 2022" >}}
<div style="border: 1px solid #ccc; border-radius: 12px; overflow: hidden;">
  {{< iframe src="/ibo2022-sim.html" height="90vh" >}}
</div>

<strong><a href="/ibo2022bioinfo.pdf">Please refer to IBO 2022 bioinformatics practical pdf</strong></a>
*The above interactive simulation reproduces the **IBO 2022 Bioinformatics Practical** (chemokine signalling pathway, KEGG expression mapping, alignment tasks). Click the tabs to explore. This is a static HTML/JS version – the full exam would be inside a secure browser.*

**How to use this simulation:**
- **Network Construction**: Click a node, then another to add an edge. Choose interaction type and state. Click on an edge to delete it. Submit to see your score.
- **KEGG**: Map control/case expression, calculate PSF, edit FC values to simulate compound effects.
- **Exam Questions**: Test your knowledge with multiple‑choice questions (answers validated against official key).

{{< /tab >}}

{{< tab name="Worked Examples" >}}
## 📚 Additional worked examples from bioinformatics lab manual

Each example below includes a short **explanation** of what the step accomplishes.

### Worked Example 1: Finding conserved domains with Pfam / hmmscan
**Protein**: HOXA5 (NP_061975.2)  
**Task**: Identify the homeodomain and its amino acid range.

- **Step 1 (retrieve sequence)**: Go to NCBI Protein, search `NP_061975.2`, click FASTA – we need the raw sequence for analysis.
- **Step 2 (run hmmscan)**: In the app (or InterProScan), paste the FASTA, select Pfam‑A database, set E‑value threshold 1e‑5 (high significance).
- **Step 3 (interpret output)**: The result shows “Homeodomain (PF00046)” from residue 199 to 251.  
  *Why?* Domains are functional units; identifying them helps predict protein function (here: DNA binding).

<!-- IMAGE: HMMSCAN output screenshot -->

### Worked Example 2: ORF finding and translation (Cas9)
**Input**: *S. pyogenes* Cas9 coding DNA (provided as “Cas9‑locus.fasta”).  
**Task**: Extract the open reading frame and translate to protein.

- **Step 1 (ORF Finder)**: Open tool, paste DNA sequence, set minimum ORF length = 1000 aa (Cas9 > 1000 aa), genetic code = 1 (standard).
- **Step 2 (select the correct ORF)**: The tool lists all possible ORFs; choose the longest one starting with ATG and ending with a stop codon.
- **Step 3 (copy protein sequence)**: The translated protein sequence is used for alignment and homology modelling.  
  *Why?* ORF finding is essential to obtain the coding region from genomic DNA.

<!-- VIDEO: ORF finder tutorial -->

### Worked Example 3: BLAST to find homologous proteins
**Query**: Human GABA transaminase (P80404).  
**Task**: Find the most similar protein from pig.

- **Step 1 (blastp)**: Paste the human FASTA into blastp, select “Swiss‑Prot” database (curated).
- **Step 2 (examine top hit)**: The best hit is P80147 (pig GABA transaminase) with E‑value = 0.0, 96% identity.
- **Step 3 (interpret)**: High identity (>90%) means the two proteins are almost identical – excellent for homology modelling.  
  *Why?* BLAST quickly identifies orthologs across species.

### Worked Example 4: Global alignment using Needleman‑Wunsch
**Sequences**: Two nearly identical protein fragments (from manual).  
**Task**: Perform global alignment and interpret gaps.

- **Step 1 (set scoring)**: match = +1, mismatch = 0, gap = –1 (typical for simple exercises).
- **Step 2 (build DP table)**: Fill cell by cell using max of left+gap, up+gap, diagonal+(match/mismatch).
- **Step 3 (traceback)**: Follow arrows from bottom‑right to top‑left to reconstruct alignment.
- **Result**: Score 260, 56% identity, gaps due to length difference.  
  *Why?* The algorithm guarantees the optimal alignment under the given scoring scheme – used when sequences are similar in length.

<!-- INTERACTIVE: Link to an online DP simulator -->

### Worked Example 5: GC‑skew and replication origin
**Genome**: *B. burgdorferi* B31 (circular, 910 724 bp).  
**Task**: Locate OriC by GC‑skew window search.

- **Step 1 (window parameters)**: window = 200 bp, step = 200 bp, skew = ([C]-[G])/([C]+[G]).
- **Step 2 (plot)**: Observe two sharp switching points (50 kb and 900 kb).
- **Step 3 (confirm with DnaA)**: tblastn with DnaA protein sequence → hit at 200–300 kb.  
  *Why?* The replication origin is where GC‑skew changes from negative to positive (or vice versa) and contains the initiator protein DnaA.

### Worked Example 6: Secondary structure prediction (JPred)
**Sequence**: Human myoglobin (P02144).  
**Task**: Predict α‑helices and β‑strands.

- **Step 1 (input)**: Paste FASTA into JPred, run prediction.
- **Step 2 (interpret)**: Jnet output shows “HHHHHH” for most residues → all‑α protein.
- **Step 3 (confidence)**: Reliability scores >8 indicate high confidence.  
  *Why?* Secondary structure prediction helps understand protein fold before 3D structure is known.

### Worked Example 7: Homology modelling with Swiss‑Model
**Target**: Human 4‑aminobutyrate aminotransferase (P80404).  
**Template**: Pig 1OHV (96% identity).

- **Step 1 (template search)**: Swiss‑Model automatically finds 1OHV as the best template.
- **Step 2 (model building)**: One‑click generates a 3D model.
- **Step 3 (quality evaluation)**: QMEAN = –1.13 (acceptable), Ramachandran plot 99.5% in favoured regions.
- **Step 4 (validation)**: RMSD to template = 0.07 Å – extremely close.  
  *Why?* A reliable model can be used for further computational studies (docking, mutation analysis).

---

*These worked examples correspond to experiments 1–10 of the standard bioinformatics lab manual. Use them to practise before the exam.*

{{< /tab >}}

{{< tab name="Appendix" >}}
<div id="Solution-dotplot"><strong>Solution:</strong></div>

Answer for Q1: ![Dot plot solution](/BIOINFOPICS/dotplot1q1.png)

![Dot plot step 2](/BIOINFOPICS/dotplot1q12.png)

Please note that the inverted line shows, well, **possible** inversions.

Please proceed with permutations as you wish, here is a sample:

![Dot plot permutation example](/BIOINFOPICS/dotplot1q13.png)
Note here that using D=s+wg
Here, s is the number of substitutions; w is the gap weight (here 1 as blank space is 1); g is the number of gaps which is 2:
Hence D = 1 + 1*2 = 3<br><br>
<div id="msa-solution">
  <strong>✅ Solution to MSA problem (zinc‑finger proteins)</strong><br><br>

  <strong>1. Multiple sequence alignment (Clustal Omega, default settings)</strong><br>
  <img src="/BIOINFOPICS/msa_alignment.png" alt="MSA alignment output" style="max-width:100%;"><br><br>

  <strong>a) 100% identical positions</strong><br>
  All residues are identical except at two positions:<br>
  - Position 20: R (Arg) in Sp1, Sp2, Sp5   vs   Q (Gln) in Sp3, Sp4<br>
  - Position 24: T (Thr) in Sp1, Sp2, Sp5   vs   Q (Gln) in Sp3, Sp4<br>
  Therefore, the conserved positions are: <strong>1–19, 21–23, 25–27</strong>.<br><br>

  <strong>b) Conservative substitutions</strong><br>
  - Position 24: Thr → Gln. Both are polar uncharged → <strong>conservative</strong>.<br>
  - Position 20: Arg → Gln. Arg is basic (+), Gln is polar neutral → <strong>not conservative</strong>.<br>
  Hence only one conservative substitution (position 24).<br><br>

  <strong>c) CXXC motif (zinc‑finger signature)</strong><br>
  Residues 3‑6 form: <strong>Cys‑Pro‑Glu‑Cys</strong> → CPEC, a canonical CXXC motif.<br><br>

  <strong>2. Cladogram (most parsimonious tree)</strong><br>
  <img src="/BIOINFOPICS/msa_tree.png" alt="Phylogenetic tree" style="max-width:100%;"><br>
  Explanation: Sp1, Sp2, Sp5 are identical → they form one clade. Sp3 and Sp4 are identical to each other but differ from the first group at two positions → they branch together as a separate clade.<br><br>

  <strong>3. Alignment quality assessment</strong><br>
  The sequences are extremely similar (no gaps, only two mismatches). Any standard alignment algorithm (Clustal, MUSCLE) with default parameters will produce exactly the same alignment as shown. Changing gap penalties (e.g., gap opening = 10 or 20) has no effect because no gaps are introduced.<br><br>

  {{< badge "IBO insight" "info" >}} In a real practical, you would use the exam’s built‑in alignment tool. Always check the conservation line (`*`, `:`, `.`) to identify functionally important residues.
</div><br><br>
<div id="upgma-solution">
  <strong>✅ UPGMA solution</strong></div>
  <strong>Step 1:</strong> Smallest distance = 8 (A‑B, A‑C, B‑C). Join A and B.<br>
  New node AB. Branch lengths: A→AB = 4, B→AB = 4.<br>
  Distances from AB to others: d(AB)C = (8+8)/2 = 8; d(AB)D = (10+10)/2 = 10.<br>

  <strong>Step 2:</strong> Smallest distance = 8 (AB‑C). Join AB and C.<br>
  New node ABC. Branch lengths: AB→ABC = 4, C→ABC = 4.<br>
  Distances from ABC to D: (10+10+10)/3 = 10.<br>

  <strong>Step 3:</strong> Join ABC and D. Branch lengths: ABC→root = 5, D→root = 5.<br>

  <strong>Final tree (Newick format):</strong>
  <pre>((A:4,B:4):4,C:4):5,D:5;</pre>

  <img src="/BIOINFOPICS/upgma_tree.png" alt="UPGMA tree" style="max-width:100%;"><br>

  <strong>Note:</strong> The matrix is not ultrametric, so the tree does not reproduce the original distances (e.g., A‑C distance in the tree is 12, not 8). This illustrates a common mistake of applying UPGMA when the molecular clock does not hold.
<br><br>

<div id="nj-solution">
  <strong>✅ Neighbor‑Joining solution</strong></div>

  <strong>First iteration (n=5):</strong><br>
  Row sums: r_A=54, r_B=57, r_C=61, r_D=66, r_E=78.<br>
  Q_AB = 3*10 – 54 – 57 = –81 (smallest). Join A and B.<br>
  New node u. Branch lengths: d_Au = 4.5, d_Bu = 5.5.<br>
  New distances: d_uC = 7.5, d_uD = 9.5, d_uE = 13.5.<br>

  <strong>Full tree (after completing all iterations):</strong>
  <pre>((((A:4.5,B:5.5):0.5,C:7.0):0.5,D:8.5):6.25,E:6.25);</pre>

  <img src="/BIOINFOPICS/nj_tree.png" alt="NJ tree" style="max-width:100%;"><br>

  <strong>Advantage of NJ:</strong> Does not assume a molecular clock; correctly reconstructs additive trees even with unequal rates.<br>
  <strong>Common mistake:</strong> Using UPGMA on non‑ultrametric data leads to long‑branch attraction and incorrect topologies.
<br><br>
<div id="ml-solution">
  <strong>✅ Maximum Likelihood solution</strong></div>

  <strong>1.</strong> GTR+G has the highest log‑likelihood (–2395.2), but it also has more parameters. A formal test is needed.<br>

  <strong>2.</strong> Likelihood ratio test (LRT) between HKY85 and GTR+G:<br>
  ΔlnL = (–2395.2) – (–2401.7) = 6.5<br>
  Test statistic = 2 × ΔlnL = 13.0<br>
  Degrees of freedom = 3 (extra parameters in GTR).<br>
  Critical χ²(3) at α=0.05 = 7.815.<br>
  Since 13.0 > 7.815, the improvement is significant → GTR+G fits significantly better.<br>

  <strong>3.</strong> Gamma shape parameter α estimates rate heterogeneity among sites. α < 1 indicates strong rate variation (some sites evolve fast, others slow).<br>

  <strong>4.</strong> Despite significance, for a short alignment (100 bp) GTR+G may be over‑parameterised. A conservative choice would be HKY85 if the tree topology does not change.<br>

  <strong>5.</strong> Bootstrap support (e.g., 95%) means that the clade appears in 95% of resampled datasets; it is a measure of confidence, not the probability that the clade is correct.

 Although no tree was requested in this problem, here is the final tree:
 ![ML TREE](/BIOINFOPICS/ml_tree.png)


### 📚 Recommended External Resources

#### 🎥 YouTube channels for bioinformatics concepts
- **[BiotechLekh](https://www.youtube.com/@BiotechLekh)** – detailed explanations of BLAST, DP, trees.
- **[Bioinformagician](https://www.youtube.com/@Bioinformagician)** – algorithm visualisations.
- **[NCBI’s official channel](https://www.youtube.com/user/NCBINLM)** – tutorials on GenBank, BLAST.
- **[iBiology](https://www.youtube.com/@iBiology)** – high‑quality lectures on protein structure and evolution.

#### 📖 Free online textbooks
- [Bioinformatics Algorithms (Compeau & Pevzner)](https://www.bioinformaticsalgorithms.org/) – interactive.
- [NCBI Handbook](https://www.ncbi.nlm.nih.gov/books/NBK21101/) – official reference.

#### 🛠️ Interactive tools to practice
- [BLAST on the web](https://blast.ncbi.nlm.nih.gov/)
- [Clustal Omega](https://www.ebi.ac.uk/Tools/msa/clustalo/)
- [PhyML online](http://www.atgc-montpellier.fr/phyml/)
- [Swiss‑Model](https://swissmodel.expasy.org/)

<!-- IMAGE: Cheat sheet for sequence alignment scoring matrices (BLOSUM, PAM) -->
<!-- VIDEO: Quick recap of all key concepts (maybe a 10‑minute summary) -->

{{< /tab >}}

{{< /tabs >}}

<script>
/* BOGuide Dynamic TOC v3 — rewrites from scratch
   Key fixes vs previous versions:
   1. Panel detection: maps tab button index → panel index, no reliance on [hidden]
   2. Links: onclick-based, activates the right tab then scrolls — no bare href anchors
   3. Change detection: MutationObserver on aria-selected attribute changes, not click events
   4. Works whether Hextra uses display:none, visibility, or [hidden] to hide panels
*/
(function () {
  'use strict';

  var TAB_DELAY = 80; // ms to wait after tab switch before scanning headings

  /* ── slugify ─────────────────────────────────────────────────────────── */
  function slugify(t) {
    return t.toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim();
  }

  /* ── Get the currently active panel by matching button → panel index ─── */
  function getActivePanel() {
    var buttons = Array.from(document.querySelectorAll('[role="tab"]'));
    var panels  = Array.from(document.querySelectorAll('[role="tabpanel"]'));
    if (!buttons.length || !panels.length) return panels[0] || null;

    // Find the selected button
    var idx = buttons.findIndex(function(b) {
      return b.getAttribute('aria-selected') === 'true'
          || b.classList.contains('active')
          || b.getAttribute('data-state') === 'active';
    });
    if (idx === -1) idx = 0;
    return panels[idx] || panels[0] || null;
  }

  /* ── Get or create the TOC nav element ──────────────────────────────── */
  function getTocEl() {
  var el = document.getElementById('boguide-toc');
  if (el) return el;
  el = document.createElement('nav');
  el.id = 'boguide-toc';
  el.style.cssText = [
    'position:fixed',
    'top:72px',
    'right:12px',
    'width:216px',
    'max-height:calc(100vh - 84px)',
    'overflow-y:auto',
    'border-radius:10px',
    'padding:12px 14px 14px',
    'z-index:9999',
    'font-family:inherit',
    'font-size:13px',
    'line-height:1.5',
    'display:none'
  ].join(';');
  document.body.appendChild(el);
  return el;
}

  /* ── Build (or rebuild) the TOC ─────────────────────────────────────── */
  function buildToc() {
    var panel = getActivePanel();
    var tocEl = getTocEl();

    if (!panel) { tocEl.style.display = 'none'; return; }

    // Stamp IDs on every h2/h3 in ALL panels (needed for cross-tab anchor nav)
    document.querySelectorAll('[role="tabpanel"]').forEach(function(p, panelIdx) {
      p.querySelectorAll('h2,h3').forEach(function(h) {
        if (!h.id) h.id = 'bg-' + panelIdx + '-' + slugify(h.textContent);
      });
    });

    var headings = Array.from(panel.querySelectorAll('h2, h3'));
    if (!headings.length) { tocEl.style.display = 'none'; return; }

    // Tab label
    var buttons   = Array.from(document.querySelectorAll('[role="tab"]'));
    var panels    = Array.from(document.querySelectorAll('[role="tabpanel"]'));
    var panelIdx  = panels.indexOf(panel);
    var activeBtn = buttons[panelIdx] || null;
    var tabLabel  = activeBtn ? activeBtn.textContent.trim() : '';

    // Render
    var html = '<p style="font-weight:700;font-size:11px;text-transform:uppercase;'
             + 'letter-spacing:.07em;margin:0 0 6px;color:var(--color-text-secondary,#6b7280)">'
             + 'On this page</p>';
    if (tabLabel) {
      html += '<p style="font-size:11px;color:var(--color-text-secondary,#9ca3af);'
            + 'margin:0 0 8px;padding-bottom:6px;'
            + 'border-bottom:1px solid var(--border-color,#e2e8f0)">'
            + '&#8627; ' + tabLabel + '</p>';
    }
    html += '<ul style="list-style:none;margin:0;padding:0">';
    headings.forEach(function(h) {
      var isH3   = h.tagName === 'H3';
      var indent = isH3 ? 'padding-left:12px' : '';
      var weight = isH3 ? 'normal' : '600';
      var size   = isH3 ? '12px' : '13px';
      var opacity= isH3 ? '.72' : '1';
      var pid    = panelIdx; // captured for onclick closure
      var hid    = h.id;
      html += '<li style="margin:1px 0;' + indent + '">'
           + '<a href="javascript:void(0)"'
           + ' data-panel="' + pid + '" data-hid="' + hid + '"'
           + ' style="display:block;padding:4px 6px;border-radius:5px;'
           + 'font-size:' + size + ';font-weight:' + weight + ';opacity:' + opacity + ';'
           + 'color:inherit;text-decoration:none;cursor:pointer;'
           + 'transition:background .12s,color .12s"'
           + ' onmouseover="this.style.background=\'var(--color-primary-100,rgba(22,163,74,.08))\';this.style.color=\'var(--color-primary-600,#16a34a)\';this.style.opacity=\'1\'"'
           + ' onmouseout="this.style.background=\'\';this.style.color=\'\';this.style.opacity=\'' + opacity + '\'"'
           + ' onclick="boGuideTocNav(this)">'
           + h.textContent.replace(/^[#\s]+/,'').trim()
           + '</a></li>';
    });
    html += '</ul>';
    tocEl.innerHTML = html;
    tocEl.style.display = 'block';
  }

  /* ── TOC link click handler — activate panel then scroll ─────────────── */
  window.boGuideTocNav = function(link) {
    var panelIdx = parseInt(link.getAttribute('data-panel'), 10);
    var hid      = link.getAttribute('data-hid');
    var buttons  = Array.from(document.querySelectorAll('[role="tab"]'));
    var btn      = buttons[panelIdx];

    function scrollToHeading() {
      var el = document.getElementById(hid);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (btn) {
      // Check if this panel is already active
      var alreadyActive = btn.getAttribute('aria-selected') === 'true'
                       || btn.classList.contains('active')
                       || btn.getAttribute('data-state') === 'active';
      if (alreadyActive) {
        scrollToHeading();
      } else {
        btn.click();
        setTimeout(scrollToHeading, 120);
      }
    } else {
      scrollToHeading();
    }
  };

  /* ── Watch for tab changes via MutationObserver on aria-selected ─────── */
  function attachObserver() {
    var tablist = document.querySelector('[role="tablist"]');
    if (!tablist) return;

    // Watch attribute mutations on all tab buttons
    var obs = new MutationObserver(function(mutations) {
      var changed = mutations.some(function(m) {
        return m.type === 'attributes'
            && (m.attributeName === 'aria-selected'
             || m.attributeName === 'class'
             || m.attributeName === 'data-state');
      });
      if (changed) setTimeout(buildToc, TAB_DELAY);
    });

    tablist.querySelectorAll('[role="tab"]').forEach(function(btn) {
      obs.observe(btn, { attributes: true, attributeFilter: ['aria-selected','class','data-state'] });
    });

    // Also observe tablist itself for class changes
    obs.observe(tablist, { attributes: true, subtree: true,
                           attributeFilter: ['aria-selected','class','data-state'] });
  }

  /* ── MathJax re-render on tab switch ─────────────────────────────────── */
  function attachMathJax() {
    var tablist = document.querySelector('[role="tablist"]');
    if (!tablist) return;
    tablist.querySelectorAll('[role="tab"]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        setTimeout(function() {
          if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise();
        }, 150);
      });
    });
  }

  /* ── Init ────────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      buildToc();
      attachObserver();
      attachMathJax();
    }, 400);
  });

})();
</script>
<footer style="margin-top: 4rem; padding: 1rem; text-align: center; border-top: 1px solid #ccc;">
  <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
    <img alt="Creative Commons License" style="border-width:0" 
         src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
  </a><br />
  <span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">
    BioGuide
  </span> by 
  <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">
    N
  </span> is licensed under a 
  <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
    Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
  </a>.
</footer>