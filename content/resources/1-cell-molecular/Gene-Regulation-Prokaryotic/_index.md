---
title: "Gene Regulation: Prokaryotic"
weight: 13
description: "The operon model, negative and positive control, the lac and trp operons as contrasting case studies, attenuation, and riboswitches — how bacteria regulate gene expression without a nucleus or chromatin."
difficulty: "advanced"
prerequisites: ["Transcription-RNA-Processing"]
syllabus_tags: ["IBO", "USABO", "molecular-biology"]
---

{{< topic-meta >}}

## Overview

Bacteria regulate gene expression almost entirely at the level of transcription initiation, using a compact and efficient organisational unit — the **operon** — that groups functionally related genes under shared regulatory control. This page covers the operon model through its two classic case studies (lac and trp), which illustrate contrasting regulatory logic (inducible vs. repressible, negative vs. positive control), plus two additional layers of prokaryotic regulation below the level of transcription initiation itself.

## Key Concepts

### The operon: shared regulation for functionally linked genes

An **operon** is a cluster of genes transcribed together as a single polycistronic mRNA (one transcript encoding multiple proteins), under the control of one shared **promoter** and (usually) one or more **operator** sequences — regulatory DNA sites where a repressor protein can bind to block transcription. Grouping functionally related genes (e.g. all enzymes of one metabolic pathway) under shared control lets the cell switch the entire pathway on or off with a single regulatory event, rather than independently regulating each gene.

### The lac operon: inducible, negative control

The *lac* operon encodes enzymes for lactose metabolism (including β-galactosidase, which cleaves lactose). In the **absence** of lactose, the **lac repressor** protein binds the operator, physically blocking RNA polymerase from transcribing the operon — the default state is **off**. When lactose is present, a lactose metabolite (allolactose) binds the repressor, causing a conformational change that releases it from the operator, allowing transcription to proceed — the operon is **induced** by the presence of its substrate. This is **negative control**: the regulatory protein (repressor) actively *represses* transcription in the absence of the appropriate signal, and its removal permits transcription.

The lac operon also integrates a **second**, independent layer of regulation reflecting overall cell energy status: when glucose (the preferred carbon source) is scarce, **cAMP** levels rise, and cAMP-bound **CAP (catabolite activator protein)** binds a separate site near the promoter, enhancing RNA polymerase binding — this is **positive control**, since CAP actively promotes rather than merely permits transcription. Full lac operon expression therefore requires **both** conditions simultaneously: lactose present (repressor released) *and* glucose absent (CAP active) — a classic example of combinatorial (AND-gate-like) regulatory logic ensuring the cell only invests in lactose metabolism when lactose is available *and* glucose (the more efficient preferred fuel) is not.

### The trp operon: repressible, negative control

The *trp* operon encodes enzymes for tryptophan **biosynthesis** — the opposite metabolic direction from lac's catabolic (breakdown) role, and correspondingly opposite regulatory logic. In the **absence** of tryptophan, the trp repressor is inactive and unable to bind the operator, so the operon is transcribed by default (**on**) — the cell synthesises tryptophan because it needs to. When tryptophan is abundant, it acts as a **co-repressor**, binding the trp repressor and activating it, allowing it to bind the operator and shut transcription **off** — the cell stops making an amino acid it no longer needs to synthesise. This is still negative control (a repressor blocks transcription), but the operon's *default* state and its response to the regulatory molecule are inverted relative to lac — worth stating explicitly, since this contrast (inducible/catabolic vs. repressible/biosynthetic) is the single most common comparative exam framing for this topic.

### Attenuation: a second, finer regulatory layer on the trp operon

Beyond repressor-mediated on/off control, the trp operon carries an additional regulatory mechanism unique to bacteria's lack of a nuclear envelope: **attenuation**, which fine-tunes transcription *after* it has already begun, exploiting the fact that transcription and translation are physically coupled in bacteria (a ribosome can begin translating an mRNA while RNA polymerase is still transcribing further downstream — impossible in eukaryotes, where transcription and translation are separated by the nuclear envelope, see [Transcription & RNA Processing](../transcription-rna-processing/)). A leader sequence upstream of the trp structural genes encodes a short peptide containing two consecutive tryptophan codons; when Trp is scarce, the ribosome stalls at these codons (waiting for scarce charged Trp-tRNA), and this stalling alters the folding of the nascent mRNA in a way that permits RNA polymerase to continue transcribing; when Trp is abundant, the ribosome translates through smoothly without stalling, and the resulting alternative mRNA fold instead forms a terminator hairpin, prematurely halting transcription. Attenuation thus provides graded, rapid, translation-coupled fine-tuning layered directly on top of the coarser repressor-based on/off switch.

### Riboswitches: regulation without any protein at all

**Riboswitches** are regulatory RNA elements, typically located in an mRNA's 5′ untranslated region, that directly bind a small metabolite ligand (no protein intermediary required) — ligand binding changes the RNA's secondary structure, which in turn affects either transcription termination or translation initiation. Riboswitches represent regulation occurring entirely at the RNA level, and are considered strong supporting evidence for the "RNA world" hypothesis of early evolution, since they demonstrate RNA's independent capacity for both ligand recognition and structural regulatory switching, without requiring any protein component.

## Comparative Structures

| Feature | lac operon | trp operon |
|---|---|---|
| Metabolic direction | Catabolic (breakdown) | Biosynthetic (synthesis) |
| Default state (no regulatory molecule) | Off (repressor bound) | On (repressor inactive) |
| Effect of regulatory molecule (lactose/tryptophan) | Induces (turns on) | Represses (turns off) |
| Control type | Negative (repressor) + positive (CAP) | Negative (repressor) only, plus attenuation |
| Regulatory molecule role | Inducer (releases repressor) | Co-repressor (activates repressor) |

## Common Exam Questions

- "Compare the regulatory logic of the lac and trp operons" — the expected answer contrasts catabolic/inducible vs. biosynthetic/repressible directly, and correctly identifies that both use negative control (via a repressor) despite having opposite default states and opposite responses to their regulatory molecule.
- "Why does the lac operon require both lactose presence and glucose absence for full expression?" — tests understanding of the combined negative (repressor/lactose) and positive (CAP/cAMP/glucose) control layers operating together.
- "How is attenuation possible in bacteria but not eukaryotes?" — the correct answer must cite the physical coupling of transcription and translation in bacteria (no nuclear envelope separating them), which is structurally impossible in eukaryotes.
- Riboswitch questions often test recognition that regulation is occurring with **no protein involved at all** — a frequently missed detail when a question describes a metabolite directly altering an mRNA's own structure.

## Visual Reference

**Interactive**

- *(built later — see project workflow)* A lac operon state simulator: toggle lactose and glucose presence/absence independently and see the repressor/CAP binding states and resulting transcription output (on/off) update live — directly visualises the AND-gate combinatorial logic.

**Static**

- lac operon diagram in both repressed (no lactose) and induced (lactose present, glucose absent, CAP bound) states
- trp operon diagram in both active (no Trp) and repressed (Trp abundant, co-repressor bound) states
- Attenuation mechanism diagram showing ribosome stalling vs. read-through and the resulting alternative mRNA hairpin structures

## Practice Problems

**1.** A bacterial cell is grown in a medium containing abundant glucose and abundant lactose simultaneously. Predict the expression level of the lac operon, and explain using both regulatory layers.

<details>
<summary>Show answer</summary>

Lac operon expression remains **low**, despite lactose being present. Lactose presence does release the lac repressor from the operator (satisfying the negative-control requirement), but abundant glucose keeps cAMP levels low, so CAP remains largely inactive and fails to enhance RNA polymerase binding at the promoter (the positive-control requirement is not met). Both conditions — inducer present AND CAP active — are required for strong expression; satisfying only one is insufficient for high-level transcription.
</details>

**2.** A mutation eliminates the trp operon's attenuation mechanism entirely, while the repressor-based on/off control remains fully functional. Predict the effect on the operon's regulatory behaviour, particularly its sensitivity to intermediate (neither scarce nor abundant) tryptophan levels.

**3.** Explain why attenuation, as a regulatory mechanism, could not function in a eukaryotic cell even if the exact same leader-sequence/ribosome-stalling logic were somehow present, referencing the physical organisation of eukaryotic transcription and translation.
