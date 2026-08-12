---
title: "Carbohydrate Chemistry & Biology"
weight: 19
description: "Monosaccharide stereochemistry and ring forms, glycosidic bond formation, the structural logic distinguishing starch, glycogen, and cellulose, and the biological roles of glycosylation and glycosaminoglycans."
difficulty: "intermediate"
prerequisites: ["Amino-Acids-Protein-Chemistry"]
syllabus_tags: ["IBO", "USABO", "biochemistry"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

Carbohydrates are built from one simple repeating chemical idea, the glycosidic bond, yet that single linkage, varied in stereochemistry and branching pattern, produces molecules as different as the rigid, indigestible cellulose of a plant cell wall and the readily mobilised glucose reserve of glycogen. This page covers monosaccharide chemistry, how glycosidic bonds form and are named, and why storage/structural polysaccharides differ so sharply in physical properties despite near-identical monomer composition.

## Key Concepts

### Monosaccharide stereochemistry

Monosaccharides are polyhydroxy aldehydes (**aldoses**, e.g. glucose) or ketones (**ketoses**, e.g. fructose). Each chiral carbon doubles the number of possible stereoisomers, so glucose (4 chiral centres in its open-chain form) has 16 possible stereoisomers, of which **D-glucose** is the biologically overwhelming default.

**D/L designation** is assigned by the configuration at the chiral carbon farthest from the carbonyl group (compared to D/L-glyceraldehyde as the reference); nearly all biologically relevant sugars are D-sugars, mirroring the near-universal use of L-amino acids in proteins; both conventions reflect that the enzymes handling these molecules are themselves chiral and only accept one stereoisomeric family efficiently.

In aqueous solution, 5- and 6-carbon sugars predominantly exist as **cyclic hemiacetals/hemiketals** (furanose or pyranose rings), not open chains. Ring closure creates a *new* chiral centre at C1 (the **anomeric carbon**), giving rise to **α and β anomers** — e.g. α-D-glucopyranose vs. β-D-glucopyranose, which interconvert in solution (**mutarotation**) but are locked into one form once incorporated into a glycosidic bond. This α/β distinction is the single most consequential fact in this page: it is the entire reason starch/glycogen and cellulose behave so differently (see below).

![Open-chain fructose interconverting with its cyclic β-D-fructopyranose (68.2%) and β-D-fructofuranose (22.4%) ring forms via the trans-oxygen (β-anomer) open-chain intermediate, carbons numbered 1-6](/MCBBPICS/glucose-open-chain-vs-cyclic.jpg)
*Source: chem.libretexts.org (Cyclic Structures of Monosaccharides — Anomers)*

### Glycosidic bonds

A **glycosidic bond** forms between the anomeric carbon of one sugar and a hydroxyl group of another, releasing water (condensation): the carbohydrate equivalent of a peptide bond. Bonds are named by the two carbons joined and the anomeric configuration, e.g. **α(1→4)** links C1 of one glucose to C4 of the next in an α configuration.

### Storage vs. structural polysaccharides: the same monomer, opposite function

**Starch** (plants) and **glycogen** (animals) are both glucose polymers linked almost entirely by **α(1→4)** bonds, with **α(1→6)** branch points (more frequent in glycogen than in amylopectin, giving glycogen a more densely branched, "bushier" structure with more non-reducing ends for rapid simultaneous mobilisation by glycogen phosphorylase). The α linkage puts a consistent kink at every bond, so the chain naturally coils into a helix, a shape enzymes (amylase, phosphorylase) can access easily from the outside, which is exactly what a rapidly mobilised energy store needs.

![Chair-structure and schematic bead-chain diagrams of glycogen branching: linear α(1→4)-linked glucose chains with an α(1→6) branch point, multiple non-reducing ends, and one reducing end](/MCBBPICS/glycogen-branching-diagram1.jpg)
*Source: ScienceDirect Topics ("glycogenin")*

![Enzymatic mechanism of glycogen branch formation: transglycosylase acts on a linear glucose chain attached to the glycogen core, creating a new α(1→6) branch point (numbered 1 and 6) with the arrows marking sites for further glucosyl unit addition](/MCBBPICS/glycogen-branching-diagram2.png)
*Source: ScienceDirect Topics ("glycogenesis")*

**Cellulose**, by contrast, links glucose exclusively by **β(1→4)** bonds. The β linkage forces each successive glucose to rotate 180° relative to its neighbour, producing a straight, extended chain rather than a helix. These straight chains pack side-by-side into extensive inter-chain hydrogen-bonded sheets (microfibrils), which is what gives cellulose its tensile strength and near-total resistance to digestion by animal enzymes (which recognise only α-glycosidic geometry; only specialised **cellulase**-producing organisms, often microbial symbionts, can hydrolyse β(1→4) bonds).

This is the highest-yield single comparison in carbohydrate biochemistry: **identical monomer, only the anomeric configuration of the linkage differs, and that alone explains storage-vs-structural function.**

![Starch structure diagram: unbranched amylose chain with an α1→4 glycosidic bond labelled, and branched amylopectin with both an α1→4 backbone bond and an α1→6 branch-point bond labelled](/MCBBPICS/amylose-vs-cellulose-chain.webp)
*Source: easybiologyclass.com*

### Glycosaminoglycans and the extracellular matrix

Beyond glucose homopolymers, **glycosaminoglycans (GAGs)**, long, unbranched, highly negatively charged polymers of repeating disaccharide units (e.g. hyaluronic acid, chondroitin sulfate, heparin), are a distinct structural carbohydrate class central to the extracellular matrix (see [Cell Junctions, Extracellular Matrix & Cell Death](../cell-junctions-ecm-cell-death/)). Their dense negative charge draws in water and cations, giving connective tissue its resistance to compression.

### Glycosylation, revisited

[Amino Acids & Protein Chemistry Fundamentals](../amino-acids-protein-chemistry/) introduced N- and O-glycosylation as protein modifications; from the carbohydrate side, the attached glycan itself is built by sequential glycosyltransferase reactions in the ER and Golgi, each adding one sugar via a new glycosidic bond, and each enzyme recognising both the specific sugar donor and the specific acceptor hydroxyl. This stepwise, enzyme-templated (rather than nucleic-acid-templated) assembly is why glycan structures are far more heterogeneous between individual protein molecules than a directly gene-encoded sequence like a polypeptide chain.

## Comparative Structures

| Polysaccharide | Monomer linkage | Chain shape | Branching | Biological role |
|---|---|---|---|---|
| Starch (amylose) | α(1→4) | Helical | None | Plant energy storage |
| Starch (amylopectin) | α(1→4), α(1→6) branches | Helical with branches | Moderate | Plant energy storage |
| Glycogen | α(1→4), α(1→6) branches | Helical with branches | Dense (more than amylopectin) | Animal energy storage, rapid mobilisation |
| Cellulose | β(1→4) | Extended, straight | None | Plant cell wall structure |
| Chitin | β(1→4) of N-acetylglucosamine | Extended, straight | None | Fungal cell wall, arthropod exoskeleton structure |

## Common Exam Questions

- "Why can't humans digest cellulose?": the correct answer names the *β(1→4) linkage geometry*, not simply "we lack the enzyme," since the follow-up ("why don't we have that enzyme?") is really asking about substrate specificity for α- vs. β-glycosidases.
- "Compare glycogen and amylopectin structurally": degree of branching (glycogen denser) is the testable distinction, since both use the same α(1→4)/α(1→6) linkage chemistry.
- Anomeric carbon identification (which carbon is C1, why ring closure creates a new stereocentre there) is a frequent structure-drawing question.

## Visual Reference

**Interactive**

- An α vs. β glycosidic bond builder: click two monosaccharide ring diagrams together in either configuration and see the resulting chain shape (helical vs. extended) render automatically, making the single-cause structural argument of this page directly visible.

{{< iframe src="/glycosidic-bond-builder.html" title="Glycosidic Bond Builder" height="440px" >}}

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. Two items ended up with content-mismatched sourced images — see the inline notes: the "glucose" ring-form image is actually fructose, and the "amylose vs. cellulose" image is actually amylose vs. amylopectin. Neither a glucose-specific ring-form image nor a genuine amylose-vs-cellulose comparison is currently placed.)*

## Practice Problems

**1.** A polysaccharide is found to be completely resistant to human salivary amylase but readily digested by a specific bacterial enzyme. Propose the most likely glycosidic linkage type, and justify your reasoning.

<details>
<summary>Show answer</summary>

Most likely a β-glycosidic linkage (e.g. β(1→4), as in cellulose). Human amylase is specific for α-glycosidic bonds; resistance to it but susceptibility to a specialised bacterial enzyme (a cellulase-type glycosidase) is the classic signature of β-linked polysaccharides, which only organisms with the appropriate β-glycosidase machinery can hydrolyse.
</details>

**2.** Explain, at the level of glycosidic bond geometry, why glycogen is well-suited to be rapidly mobilised for energy but cellulose could never function as a usable energy reserve for the organism that makes it (independent of enzyme availability).

**3.** If a mutation eliminated all α(1→6) branch points from glycogen synthesis (converting it to a linear α(1→4) chain only, like amylose), predict the effect on the rate of glucose mobilisation from a glycogen granule of the same total mass, and explain why.
