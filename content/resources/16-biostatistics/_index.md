---
title: "Biostatistics & Data Analysis"
weight: 16
description: "A practical guide to the statistics a biology olympiad student actually needs: graphing, mean, median, standard deviation, standard error, confidence intervals, the t-test, chi-square, correlation and regression, Hardy-Weinberg, probability, rates and standard curves, with worked examples and practice questions."
difficulty: "intermediate"
syllabus_tags: ["IBO", "practical", "biostatistics", "data-analysis"]
---

{{< topic-meta >}}
{{< mathjax >}}
{{< page-rating >}}

<div class="article-gate-root" id="article-gate-root" data-next="/resources/16-biostatistics/">

<div class="article-gate-body" id="article-gate-body">

> **Credit:** Biostatistics was brought into Notes@BiOGuide by **Ruslanbekov Ulukbek**, IBO 2026 bronze medallist from Kyrgyzstan ([read his story](/biobytes/testimonials/kyrgyzstan-ulukbek-bronze/)), who also provided the source reference material this section is built from.

## Overview

Almost every olympiad practical, and a good share of the theory papers, hands you numbers and asks what they mean. A table of absorbances, a count of offspring, a set of measurements from two treatments, a graph with error bars. The biology is the easy part; the part that costs marks is knowing which calculation to run, running it without a slip, and saying in one sentence what the result means.

This section is a working toolkit, not a statistics course. It is built around the handful of methods that come up again and again, each with the formula, a fully worked example, the usual exam trap, and practice questions with model answers.

Statistics in biology rests on one idea: **you almost never measure the whole population**. You measure a sample and use it to say something about everything you did not measure. Every method below is a way of doing that honestly: describing the sample, stating how uncertain the estimate is, and deciding whether a difference you see is real or just chance.

---

## What to Use When

Start here whenever you meet a data set and are unsure what to do with it.

<table>
<thead><tr><th>Your question</th><th>Type of data</th><th>Tool</th><th>Where</th></tr></thead>
<tbody>
<tr><td>What is the typical value?</td><td>Numbers</td><td>Mean (or median if skewed or has outliers)</td><td>Descriptive statistics</td></tr>
<tr><td>How spread out are the values?</td><td>Numbers</td><td>Range, standard deviation</td><td>Descriptive statistics</td></tr>
<tr><td>How well do I know the mean?</td><td>Numbers</td><td>Standard error, 95% confidence interval</td><td>Descriptive statistics</td></tr>
<tr><td>Are two group means different?</td><td>Numbers, two groups</td><td>t-test</td><td>Inferential tests</td></tr>
<tr><td>Do counts match a predicted ratio?</td><td>Counts in categories</td><td>Chi-square test</td><td>Inferential tests</td></tr>
<tr><td>Do two variables move together?</td><td>Pairs of numbers</td><td>Correlation (r), regression line</td><td>Inferential tests</td></tr>
<tr><td>Is a population in Hardy-Weinberg equilibrium? How does selection change allele frequency?</td><td>Genotype counts</td><td>Allele frequencies, chi-square, recurrence model</td><td>Biological calculations</td></tr>
<tr><td>What is the concentration of my unknown?</td><td>Absorbance or signal</td><td>Standard curve</td><td>Biological calculations</td></tr>
</tbody>
</table>

---

## The Three Pages

{{< cards cols="1" >}}
  {{< card link="descriptive-statistics/" title="Descriptive Statistics & Graphing" subtitle="Choosing the right graph and labelling it properly, mean, median and mode, range, variance and standard deviation, degrees of freedom, standard error and 95% confidence intervals, what error bars really show, and calculator habits that save time." >}}
  {{< card link="inferential-tests/" title="Inferential Tests" subtitle="Null and alternative hypotheses, the significance level, the two-sample t-test, chi-square for genetic ratios and choice experiments, correlation, the coefficient of determination and the line of best fit, each with critical-value tables and worked examples." >}}
  {{< card link="biological-calculations/" title="Calculations & Modelling" subtitle="Relative frequency, probability rules, Hardy-Weinberg and a simple model of natural selection, rates and percentage change, dilutions, and standard curves for unknown concentrations." >}}
{{< /cards >}}

---

## Five Habits That Win Marks

1. **Say what the number means.** "t = 5.2" earns little; "t = 5.2 exceeds the critical value of 2.14, so we reject the null hypothesis: the two treatments differ" earns the mark.
2. **Check the type of data before choosing the test.** Counts go to chi-square, measurements go to a t-test. Never feed percentages or proportions into a chi-square test; use the raw counts.
3. **Report units and sensible precision.** Keep extra digits during the calculation and round only at the end, to the precision of the original data.
4. **Never claim a hypothesis is proven.** A test can reject the null hypothesis or fail to reject it. It does not prove the alternative, and "fail to reject" is not the same as "no difference exists".
5. **Look at the graph first.** A scatter plot or histogram in the first minute tells you whether a mean, a test or a line of best fit is even appropriate.

Know your calculator before any exam: standard deviation, mean, regression and correcting a mistyped entry are all built in, and using them saves many minutes. The preparation advice from IBO medallists on the [roadmap article](/biobytes/articles/zero-to-ibo-bronze/) puts this near the top of the list for a reason.

---

## Sources and Further Reading

These pages are written independently, with our own worked examples and data. The topics follow the standard core of biology data analysis. If you want more practice, two well-known sources are worth your time:

- HHMI BioInteractive, *Using BioInteractive Resources to Teach Mathematics and Statistics in Biology* (Strode and Brokaw, 2014 draft), a teacher guide covering descriptive statistics, the t-test, chi-square, correlation, Hardy-Weinberg and standard curves. Find it at [biointeractive.org](https://www.biointeractive.org/).
- The College Board's AP Biology quantitative skills materials and student worksheets on mathematical modelling, graphing, standard deviation and standard error, chi-square and the t-test.

The figures on these pages were drawn for BiOGuide from the worked examples.

</div>

<div class="article-gate-cta" id="article-gate-cta" hidden>
  <p>Log in to keep reading - free, and takes a few seconds.</p>
  <a class="papers-nav-btn papers-nav-next" id="article-gate-cta-link" href="/account/">Log in to keep reading</a>
</div>

</div>

<script src="/js/papers-article-gate.js" defer></script>
