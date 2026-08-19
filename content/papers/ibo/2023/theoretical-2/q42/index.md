---
title: "Q42 - Variant Call Format Genomics"
---

{{< problem-meta category="Theoretical 2" note="Real exam question - full text reproduced under IBO's CC BY-NC-SA 4.0 license" >}}

<div class="papers-subject-tags" style="margin-bottom:1.5rem;">
  <a class="papers-subject-tag" href="/resources/1-cell-molecular/recombinant-dna-biotechnology-techniques/">Recombinant DNA & Biotechnology</a>
</div>

As more and more human genomes are being sequenced, storing this information has become an issue.

One way to reduce the size of the files containing sequence data is to store only the information about the differences between the sequenced genomes and a "reference genome". (The reference genome is haploid).

Such file format is called Variant Call Format (vcf), and is in essence a table like the one below. In this example there is information about the genomes of 2 individuals, but any number of genomes (from 1 to many thousands) can be stored in one file.

| Chromosome | Position | Reference allele | Alternative alleles | Individual 1 | Individual 2 |
|------------|----------|-----------------|--------------------:|:------------:|:------------:|
| 1          | 5897     | G               | A                   | 0/1          | 0/0          |
| 1          | 6908     | C               | T                   | 0/0          | 1/1          |
| 1          | 7100     | A               | C,T                 | 0/2          | 1/2          |
| ...        | ...      | ...             | ...                 | ...          | ...          |

In the columns "Genotypes" 0 stands for the nucleotide being the same as the reference allele, while other numbers stand for the nucleotide being the same as alternative alleles in the order they appear in the "Alternative alleles" column.

Note: In this question ONLY consider single nucleotide variants (SNVs, SNPs, switches of a single base) and consider the genomes of all people to be exactly equal length.

True or false?

{{< papers-quiz olympiad="ibo" year="2023" round="theoretical-2" problem="q42" >}}

{{< papers-problem-nav olympiad="ibo" year="2023" round="theoretical-2" problem="q42" >}}

---

Question reproduced from **IBO 2023, Theoretical Paper 2**, licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) - attributed to the International Biology Olympiad. [Open the full exam PDF](/papers/ibo/2023/theoretical-2-exam.pdf#page=72)
