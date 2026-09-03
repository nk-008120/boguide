---
title: "GIC 2026 Blog, Three days at the Dr Babu Rajendra Prasad International conference center Bengaluru"
description: "Long-form articles and quick bites from our Instagram — exam-technique tips, lab guides, and behind-the-scenes posts from the BiOGuide team."
layout: "wide"
aliases:
  - /bioinsights/
  - /articles/
cascade:
  - target:
      path: "/biobytes/articles/**"
    layout: "gated-article"
---
## DAY 1 (Genotypic NGS AI Based Data Analysis):<br>
### L1 -  Assembling the Puzzle : From Sequencing Reads to GenomeAnnotation 
*~ Nihar Bachan Das*

The first lecture of the first day at the GIC 2026, Bengaluru started with an introductory class on assembly and annotation of genomes from raw reads. It was the theoretical basis of the computationally challenging methods that followed. In the lecture, we got to know a lot about:
- Sequencing tech differences; How SRS and LRS techniques like Illumina and Nanopore function to cover the final aim of Whole Genome Sequencing (WGS)
- How are Quality Checks (QCs) conducted on the reads. The technical algorithms that work behind reading and correcting our raw FASTQ files.
- Genome Assembly algorithms; Core k-mers and String graphs as fundamental Computational Biology methods
    1.de Bruijn Graphs (DBG): core k-mers serve as a sequence-based foundation for defining shared genomic information across multiple samples or species
    2. String graphs represent a structural architecture for reconstructing genomes from raw sequence reads without fracturing them into isolated, fixed-length tokens
- SPAdes and Velvet:
Mr. Nihar explained how SPAdes and Velvet differ while being de Bruijn Graphs and hence. He mathematically devised an explanation for us commonfolk on how SPAdes generally outperforms Velvet in modern bioinformatics workflows by handling variable coverage, performing built-in read error correction, and utilizing multiple iterative k-mer sizes automatically.
- Post processing steps: (transforming fragmented continuous sequences (contigs) into longer, chromosome-level genomic structures)
    1. Scaffolding: Scaffolding orders and orients independent contigs and links them together by introducing estimated spacer regions—typically represented by stretches of ambiguous base pairs or "N"s, when the exact intervening sequence is initially unknown.Data types used: Relies on long-read sequencing, mate-pair libraries, optical mapping, or chromatin conformation capture (Hi-C) data to span repetitive regions that break short-read assemblies.
    Common tools: Includes RaGOO for reference-guided ordering, as well as SSPACE and RAILS.
    2. Gap filling (or gap closure) replaces the unknown "N" spacer regions in scaffolds with actual nucleotide sequences.Mechanisms: Uses overlapping short reads, high-accuracy long reads (like PacBio HiFi or Oxford Nanopore), or syntenic reference sequences to resolve the missing segments.
    Common tools: Specialized programs like GapCloser or Gapfiller map reads back to scaffold boundaries to extend contig ends until they meet.Community consensus: Researchers on ResearchGate generally agree that hybrid approaches—combining long-read data to bridge repeats with short-read data for base-pair accuracy—yield the most complete and robust genome closure
- Another interesting technical differentiation discused by Mr. Nihar in his talk was about how Normal and T2T Genome Assemblies difer:
    He explained how Normal assembly leaves out contromeric and telomeric datasets and how telomeric assemblies uses LRS technologies like Oxford Nanopore. 
Mr. Nihar then concluded his speech with informing us on how Genotypic keeps working on new techniques to improve the technological applications of these intriguing and complex theoretical bioinformatical principles.

### The Transcriptome chapter Bulk and Single cell RNA analysis
*~Praddyumna Rahate*

The first theoretical lecture was followed by a brief turnaround into the novice world of Single Cell Transcriptome Analysis RNA-Seq:

- Mrs. Praddyumna started her speech with explaining how bulk RNA-Seq is limited by the absence of tags and the presence of cDNA, and how it has restricted applications outside of treated vs untreated samples and whole tissue analyses.
- Then she started touching upon the main topic:
        Advantanges of technical adaptations of SC-RNASeq:
        1. The presence of a Barcode and UMI. Unlike a normal RNA-Seq analysis which only uses cDNA, SCRNA-Seq is structure in the following way :<br>
        **P5 - Barcode - UMI - cDNA - i7 Index - P7** <br>
        The presence of the barcode and the UMI(Unique Molecular I.D.) help in tagging the individual cell and the individual molecule respectively.
- The workflow pertaining to this technique, as stated by Mrs. Praddyumna, can be summarized as:
        Raw Read -> Alignment and Counting -> Cellular and Gene MATRIX -> QC Filtering -> Polishing _> Assembly.
- She also briefly touched upon the use of Genotypic product Cell ranger as a tool to convert FASTQ files into a count matrix, which can even accomodate individual and multi cell protocols.
- Providing her opinions on how people should use the mentioned software, she eplained how reading output HTML reports from commander, and setting up the configuration file with Reg, Probe Set Ref, FASTQ Sample Barcode etc. helps.
- Reaching the end of her talk, she explained how analysis of these files should be conducted and how PCA Markers and Phenotypic filtering is a great help in data analysis.

## DAY 2 (Health Tech: Genomics in the Clinic):<br>
### L1 - Long-Read Genome Sequencing in Clinical Practice: Solving the Unsolved
*~ Dr Usha Dutta, BRIC-CDFD*

The Health Tech session on the main conference floor picked up right where our workshop had left off the previous evening, this time trading theory for the clinic. Dr Usha Dutta walked us through why Long-Read Sequencing (LRS) is increasingly being pulled into diagnostic pipelines for cases that Short-Read Sequencing (SRS) simply cannot resolve. Catching only the back half of her talk, we still got the full weight of her closing arguments:
- LRS overcomes several of the fundamental limitations that SRS runs into, especially around repetitive and structurally complex regions of the genome.
- It enables far more accurate detection of complex Structural Variants (SVs) that short reads tend to either miss or fragment across multiple ambiguous alignments.
- Long-read sequencing was shown to pin down the exact size of repeat expansions- a detail that is often clinically decisive (think trinucleotide repeat disorders) but that short reads can only estimate.
- LRS technologies were also able to directly identify hypomethylation at target loci, since platforms like Nanopore read base modifications natively off the raw signal instead of requiring a separate bisulfite step.
- Her strongest recommendation was for integrative approaches- pairing LRS with Optical Genome Mapping (OGM) and transcriptome data- since no single modality captures the full picture of genomic variation on its own.

Dr Dutta closed by reinforcing that LRS is now mature enough to detect essentially every class of genomic variant- SVs, CNVs, and SNVs alike- making it, in her words, a genuinely promising technology for identifying the full spectrum of genomic variation in a single clinical workflow.

### L2 - Accelerated, Interpretable and Energy-Efficient Genome Informatics: A Unified Framework
*~ Dr Santhi Natarajan, Shiv Nadar University*

If Dr Dutta's talk was about what long reads can do biologically, Dr Natarajan's session was about what it costs computationally to keep up with them- and how we might pay that cost more intelligently. Her talk built a case, piece by piece, for why the short-read mapping (SRM) tools the field has relied on for over a decade are starting to buckle:
- She opened with a set of benchmark plots showing how BWA-MEM, Bowtie2, FAISSe, and SCAP2 all suffer sharp accuracy and sensitivity degradation once sequencing error rates climb past the ~2% mark- the point where BWT-based algorithms structurally lose their footing. Beyond that threshold (squarely inside long-read error ranges), computational cost explodes on a log scale for most of these aligners.
- She then framed the "lacunae" plainly: existing short-read aligners are simply not built for the accuracy, indel handling, multi-mapping ambiguity, and speed demands of a high-error, long-read world.
- From there she walked through a comparative table of hardware platforms- CPU (Xeon), GPU (V100/A100), FPGA (U55), Quantum (NISQ), and Reversible FPGA- scored on Power, Energy, and Energy-Delay Product (EDP). CPUs remain the general-purpose, mature-tooling choice but tolerate error poorly; GPUs are strong for high-throughput dynamic programming but are memory-bandwidth bound; Quantum (NISQ) computing, despite the hype, was flagged as "not practical yet" once realistic cooling overheads are factored in. FPGAs came out on top for overall EDP, with Reversible FPGA architectures close behind- promising, but still an immature ecosystem with limited tool support.
- The highlight of her talk was "Reversible Adaptation"- an algorithm she called RCK, which reformulates sequence alignment (essentially a Needleman-Wunsch-style dynamic programming alignment) so that every step is logically reversible, with a history stack standing in for irreversible overwrites and backtracking achieved simply by applying the inverse operation to unwind that stack.
- Benchmarked against a conventional FPGA implementation, her reversible design held onto full logical reversibility while cutting dynamic power meaningfully- she quoted an approximate 29% drop in power draw for the alignment core, alongside garbage-output and constant-input overheads that were nearly eliminated compared to the conventional design.

She wrapped up by positioning reversible computing not as a replacement for existing aligners but as a genomics-specific hardware direction worth taking seriously as error-tolerant, energy-efficient sequence alignment becomes a bottleneck of its own.

## DAY 3 (Genome Biology, Omics Tech Updates & AI in Genomics):<br>
### L1 - Population-Scale Landscape of Mobile Element Insertions Across 82 Diverse Indian Populations
*~ Dr Shweta Ramdas, Centre for Brain Research (CBR), IISc*

The final day opened with what turned out to be one of the most data-dense talks of the conference- Dr Shweta Ramdas presenting on Transposable Elements (TEs), or "mobile elements," as population-specific players in Indian genomic diversity. She grounded the talk in why TEs matter at all, citing recent literature on TEs as evolutionary drivers- from the genetic basis of tail-loss in humans and apes to young transposable elements rewiring gene regulatory networks in human and chimpanzee hippocampal progenitors- before zooming into the Indian-specific angle via the GenomeIndia dataset:
- Working off 7,478 GenomeIndia samples sequenced at ~37x, her team catalogued non-reference TEs making up roughly 300kb per genome, identifying 7,075 unique LINE1 (L1) insertions and a striking 26,977 unique Alu insertions, with insertion counts per sample forming clean, near-normal distributions across every linguistic/geographic group sampled (AASI/AAA, DR_NT, DR_T, IE_NT, IE_T, TB_NT, TB_T, CAO).
- Benchmarked against global TE databases- HMEID (5,675 samples, ~26.2x), IndiGen (1,021 samples), and 1KGP (2,677 samples via HMEID, ~7.4x)- the GenomeIndia Alu/LINE1 counts held up well, with about 26.2% of the Alus identified overlapping the 21,981 Alus already catalogued in IndiGen.
- Remarkably, when she ran PCA on TE variation alone, the resulting PC1-PC2 and PC3-PC4 plots recapitulated Indian population structure almost as cleanly as SNP-based PCA does- clustering samples by linguistic group (Dravidian, Indo-European, Tibeto-Burman, Austroasiatic)- and top TE-derived PCs correlated strongly with the corresponding SNP-based PCs, confirming TEs aren't just noise riding along the genome but a genuine, independent signal of ancestry.
- As context for why this population structure looks the way it does, she walked through a quick ancestral timeline of the subcontinent- from the AASI (South Asian Hunter-Gatherers, indigenous since ~45,000 BCE) through waves of Iranian farmer admixture (ASI), Steppe pastoralist gene flow forming the ANI, Austroasiatic ancestry from Southeast Asia, Tibeto-Burman migration from the eastern Himalayas, and Proto-Dravidian ancestry via Elam- all of which continuously admixed to produce the modern South Asian population structure her TE data was now independently reconstructing.
- Functionally, most TEs- both Alu and LINE1- landed in intergenic and intronic regions as expected, but a meaningful minority sat in regulatory or coding contexts. Her team found TEs act as population-specific regulators of gene expression (TE-eQTLs), with an estimated 23-39% of TE-eQTLs discovered in European cohorts simply not being polymorphic in the Genome India population- a TE variant driving a European eQTL may not even exist as a variant in Indian genomes, and vice versa.
- She also showed common LINE1 and Alu insertions sitting in linkage disequilibrium with GWAS SNPs (12 LINE1 and 119 Alu insertions in total), including a chromatin-interaction-mapped example connecting an insertion to a nearby drug-metabolism gene.
- The standout case study was a truncating exonic LINE1 insertion in CYP2J2- a ubiquitous 2,066bp insertion sitting in exon 2 of this Cytochrome P450 family gene, truncating roughly 429 amino acids while leaving ~73 (about 14.5%) conserved. CYP2J2 is involved in drug metabolism and cholesterol synthesis and has been linked to cardiovascular disease risk, making this one of the clearer examples of a mobile element insertion with plausible clinical relevance in Indian populations specifically.

She closed by making the case that TE cataloguing at this scale isn't just an academic exercise- Indian-specific TE-eQTL and TE-GWAS maps are necessary because so much of the existing structural variant literature is built on European reference cohorts that simply don't capture this population's mobile element landscape.

### L2 - Talk Beyond Sequencing: From Biological Questions to Scientific Discovery with Meril Genomics and the MGL Bioinformatics Workbench
*~ Dr Pradip V Fulmali, AGM, Meril Genomics, Meril Life Sciences*

A short, sharp industry update slotted into the Omics Tech Updates session. Dr Fulmali's pitch centred on a single idea: that integration- not just raw throughput- is what protects the original biological question all the way from sample to interpretation. He walked through Meril's sample-to-answer pipeline (Sample → Library → Sequence → QC → Analyze → Interpret → Report) as one continuous, controlled workflow rather than a chain of handoffs between disconnected tools, quoting platform numbers of up to 2.2TB of output per run, up to 3.6 billion reads per run, and 50-300 cycle flexibility, all sitting inside what he called an "integrated genomics ecosystem" built around the MGL Bioinformatics Workbench.

### L3 - Salus NGS Platforms: Sequencing Quality and Robustness in Tumor Mutation Testing for Precision Oncology
*~ Dr Ravi Kumar Chilukoti, Director - SA BD & Technical Support, Salus BioMed Co. Ltd.*

The last technical talk we caught circled back to oncology, this time from the immunotherapy side. Dr Chilukoti used Salus's CGP and pan-cancer amplicon panels as the entry point into a broader walkthrough of cancer immunotherapy checkpoint biology- the actual molecular targets that tumor mutation testing panels are ultimately trying to inform decisions about:
- He mapped out the major T-cell checkpoint axes: PD-1/PD-L1-PD-L2, CD28 and CTLA-4 competing for CD80/86, TCR-MHC-II engagement, LAG-3 binding Galectin-3 and FGL1, and the CD226/TIGIT/CD96 trio competing for CD112 and CD155- alongside less-characterised checkpoints like B7-H3 and VISTA, whose binding partners on the tumour/APC side are still being worked out.
- On the therapeutic side, he traced how the checkpoint-inhibitor (ICI) landscape has expanded since ipilimumab's 2013 approval to a 2023 landscape covering CTLA-4, LAG-3, and PD-1/PD-L1-targeted antibodies across a long list of FDA-approved indications- lymphomas, MSI-high/TMB-high solid tumours, and specific approvals across head & neck, oesophageal, lung, breast, gastric, kidney, bile duct, colorectal, liver, melanoma, cervical, endometrial, and skin cancers, among others.
- He noted that response rates to ICIs typically range from just 10-30% depending on tumour type- lymphoma sees the best response, while sarcoma and ovarian cancer lag at the bottom- which is precisely the gap that better biomarker/tumor-mutation testing is meant to close.
- He closed with the scale of where the field is headed: over 1,336 new clinical studies were initiated globally in 2022 alone testing PD-1/PD-L1-targeted checkpoint inhibitors (a 54% jump from 2021), with more than 1,000 ongoing trials testing these agents in combination- collectively targeting over 300 distinct pathways.

### The Closing Stretch
By the time the Salus talk wrapped, poster session fatigue had well and truly set in, and we didn't manage to hold onto our notebook for the rest of the afternoon. So rather than skip it, here's the back half of Day 3 straight off the official program- the panel, the AI-in-health run, the closing keynote, and the valedictory- for the record, even without our usual play-by-play:

<div class="gic-schedule">
  <div class="gic-slot">
    <div class="gic-slot-time">3:00 – 4:00 PM</div>
    <div class="gic-slot-body">
      <h4>Panel Discussion: Genomics Education in the AI Era</h4>
      <p class="gic-slot-people">Moderator: Prof Samir K Brahmachari, AcSIR &middot; Dr Manjari Kiran, UoH &middot; Dr Anurag Agrawal, Ashoka University &middot; Dr Asha Subramanian, Semantic WebTech &middot; Dr D Sundar, IBAB</p>
      <p>With AI tools now doing a lot of the heavy lifting in sequence analysis, this panel took on the harder question of how genomics education itself needs to change- what a curriculum should still insist students learn by hand versus what's fair game to hand off to a model.</p>
    </div>
  </div>
  <div class="gic-slot">
    <div class="gic-slot-time">4:00 – 4:20 PM</div>
    <div class="gic-slot-body">
      <h4>Building Real World AI Solutions for Tackling Infectious Diseases</h4>
      <p class="gic-slot-people">Dr Tavpritesh Sethi, IIIT Delhi</p>
      <p>On deploying AI/ML pipelines against infectious disease problems outside the controlled conditions of a benchmark dataset.</p>
    </div>
  </div>
  <div class="gic-slot">
    <div class="gic-slot-time">4:20 – 4:40 PM</div>
    <div class="gic-slot-body">
      <h4>A Genomic Approach Towards Unravelling Probiotic Enigmas</h4>
      <p class="gic-slot-people">Dr Tulika Prakash Srivastava, IIT Mandi</p>
      <p>Using genomic and computational methods to dig into open questions around how probiotic strains actually function.</p>
    </div>
  </div>
  <div class="gic-slot">
    <div class="gic-slot-time">4:40 – 5:00 PM</div>
    <div class="gic-slot-body">
      <h4>Learning the Language of the Gut: Machine Learning Meets Microbial Ecology</h4>
      <p class="gic-slot-people">Dr Tarini Shankar Ghosh, IIIT Delhi</p>
      <p>Applying machine learning to model gut microbial ecology and community-level behaviour.</p>
    </div>
  </div>
  <div class="gic-slot">
    <div class="gic-slot-time">5:00 – 5:20 PM</div>
    <div class="gic-slot-body">
      <h4>Target and Biomarker Exploration Portal for Drug Discovery</h4>
      <p class="gic-slot-people">Dr Gyan Srivastava, Alexion Pharmaceuticals</p>
      <p>An industry look at a computational portal built to help identify drug targets and biomarkers faster.</p>
    </div>
  </div>
  <div class="gic-slot">
    <div class="gic-slot-time">5:20 – 5:40 PM</div>
    <div class="gic-slot-body">
      <h4>Beyond AI: From Algorithms to Action</h4>
      <p class="gic-slot-people">Kabita Dash, CARPL.ai</p>
      <p>On what it actually takes to get a validated AI algorithm out of the lab and into routine clinical decision-making.</p>
    </div>
  </div>
  <div class="gic-slot">
    <div class="gic-slot-time">5:40 – 6:20 PM</div>
    <div class="gic-slot-body">
      <h4>Keynote: The Human Genome Project After 40 Years- How We Got Here and Where Do We Go Next</h4>
      <p class="gic-slot-people">Prof Charles Cantor, Boston University &middot; Chair: Prof Samir K Brahmachari, AcSIR</p>
      <p>A closing keynote from one of the Human Genome Project's own pioneers, looking back at four decades of genomics and ahead to where the field goes from here- a fitting note to end a conference themed around "Genome to Bioeconomy" on.</p>
    </div>
  </div>
  <div class="gic-slot">
    <div class="gic-slot-time">6:20 – 6:50 PM</div>
    <div class="gic-slot-body">
      <h4>Valedictory</h4>
      <p class="gic-slot-people">Dr Rakesh Mishra, TIGS &middot; Dr Sudha Rao, Genotypic Technology</p>
      <p>Closing remarks bringing the sixth edition of GIC to an end.</p>
    </div>
  </div>
</div>


