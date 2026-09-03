---
title: "BiOBytes: Experience at GIC 2026 Day 1  - Workshop on Genotypic AI  based NGS Data Analysis."
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



