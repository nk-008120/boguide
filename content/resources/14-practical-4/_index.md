---  
title: "✅ P4-Plant Computational Biology"  
weight: 1  
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

## Description 

As announced in IBO 2026 circulars <a href="https://drive.google.com/file/d/11tgdFoMk5hL3PVoncpNxFYcHglHSawyM/view">1</a> and <a href="https://drive.google.com/file/d/15qHvk9HFPSiwTTAIO-MHcct-tKfEG5gp/view">2</a> The plant computational biology section will be composed of **ImageJ** and **Streamlit** softwares respectively.<br>

## Streamlit Interactive
Streamlit is an open-source Python framework that allows you to build interactive, data-driven web applications with minimal code<br>
It is not a software that directly involves working on the content (as in ImageJ), instead it is simply an interface.<br>
But nevertheless, it is important that you try out the major features of streamlit plots and interactive graphs and check out what typical questions look like, and how to deal with 3-D interactive graphs, something that is not usually used by us high schoolers preparing for the biology olympiad
<br><br>

Here is a sample website , which is our own creation, for practice for streamlit plant computational biology
<a href="https://practicepcmb4boguide.streamlit.app/" target="_blank" rel="noopener noreferrer" class="streamlit-app-badge">
  <span>🌐</span> Launch Interactive App
</a>

## ImageJ(Fiji)
General resources for ImageJ introduction:
*Note that from the reference provided by the OC, it seems they are using ImageJ (older) than Fiji (newer ImageJ), hence i shall also only refer ImageJ resources here, however the difference between the two is not felt in lengths at the level we aim to familiarize ourselves with.*
1. <a href="https://imagej.net/ij/features.html">Features of Image J from official site</a>
2. There are two good video resources, suit yourself :<br>
    A) Runtime 109 minutes : https://www.youtube.com/watch?v=QayCPKRVLV0<br>
    B) 15 video detailed playlist (123 minutes): https://www.youtube.com/playlist?list=PL4qrjj3jZ6i568ToiUV-DvAsQ0Gyb30hK
3. <a href="https://www.bu.edu/tech/files/2017/10/Introduction-to-ImageJ.pdf">Boston university introductory pdf;</a><br>
4. <a href="https://www.southampton.ac.uk/~assets/doc/Image%20Analysis.pdf">University of Southampton advanced pdf;</a><br>

---

## ImageJ (Fiji), A Detailed Guide

This page explains the core features of ImageJ at the level required for the plant computational biology practical. Where relevant, I have also explained the basic principles behind the tools, so you understand *why* you are using them, not just *how*.

### 🤔 What is the Difference Between ImageJ and Fiji?

This is a common point of confusion. **Fiji** (which stands for **F**iji **i**s **j**ust **I**mageJ) is a special distribution of ImageJ. Think of it this way: if ImageJ is a basic toolkit, Fiji is the same toolkit, but with all the most useful extra tools already added and organised.

- **ImageJ** is the core, open-source platform, small and fast.
- **Fiji** comes with a large collection of pre-installed plugins, better support for multi-dimensional images, and an automatic updater. It's the recommended version to use.

### 🖥️ Core Features and Menus You Need to Know

The following features are accessible via ImageJ's menu bar. We'll go through each menu, explaining what the important commands do and why they are used.

#### File Menu
This is for opening and saving images. The most important point is that the **Open...** command is for single images, while **Import** is for opening image sequences (e.g., a time-lapse or a z-stack) or multi-layer files like multi-image TIFFs.

#### Image Menu (Adjust, Type, Stacks)
This menu contains commands that change the image itself.

| Submenu | Key Commands | What It Does | Conceptual Reason |
| :--- | :--- | :--- | :--- |
| **Type** | `8-bit`, `16-bit`, `32-bit`, `RGB Color` | Converts the image to a different bit-depth. | Digital images are grids of numbers (pixels). The bit-depth determines the range of possible values (e.g., 0-255 for 8-bit). You often convert to 8-bit for simple thresholding. Note that here, the grid depth of color is inversely related with the numerical value, 255 translates to being completely blank at a particular color (none of that color present). |
| **Adjust** | `Brightness/Contrast...` | Changes how the image is displayed on screen without altering the underlying pixel values. | This is a *display* enhancement. It remaps the range of pixel values to the monitor's range. Useful for visualising faint features. |
| **Stacks** | `Images to Stack`, `Stack to Images`, `Z Project...` | Combines multiple images into a single multi-dimensional stack, or splits a stack into single images. 'Z Project...' collapses a stack into a single image by taking the average, max, or sum intensity of all slices. | A stack is essential for working with 3D (z-stack) or time-series data. Z-projection creates a 2D summary of a 3D object, which is often required for measurement. |
| **Stacks** | `Make Substack...` | Extracts a range of slices from a large stack. | Useful when you only need a portion of a time-lapse or a specific z-range for analysis. |
| **Stacks** | `Orthogonal Views` | Displays a stack as three orthogonal views (XY, XZ, YZ) for 3D visualisation. | Useful for examining the 3D structure of a sample before analysis. |
| **Color** | `Split Channels`, `Merge Channels` | Separates a multi-channel image into individual grayscale channels, and merges separate grayscale images into a single colour image. | Fluorescence microscopy often captures different probes (e.g., DAPI, GFP) in separate channels. Splitting allows you to analyse each signal independently. |

#### Process Menu (Filters, Math)
These commands modify the pixel values of an image.

| Submenu | Key Commands | What It Does | Conceptual Reason |
| :--- | :--- | :--- | :--- |
| **Filters** | `Smooth`, `Sharpen`, `Edge Detection`, `Median...` | Apply a mathematical operation (convolution) to every pixel based on its neighbours. | These are used for image **pre-processing**: 'Smooth' reduces noise, 'Edge Detect' highlights boundaries, 'Median' is excellent for removing 'salt-and-pepper' noise. |
| `Math` | `Subtract Background...` | Removes uneven illumination or background fluorescence by subtracting a calculated background image. | Essential for correcting images before measuring intensities, ensuring your measurements are from the signal of interest, not background noise. |

#### Analyze Menu (The Most Important for the subject)
This menu is for taking quantitative measurements. This is the main event for most tasks.

| Submenu | Key Commands | What It Does | Conceptual Reason |
| :--- | :--- | :--- | :--- |
| `Set Scale...` | Defines the real-world distance per pixel. | ImageJ only knows pixels. If you know a known distance in the image (e.g., a scale bar is 100 µm long and is 500 pixels), you can set a global scale. All subsequent measurements will then be in real-world units (µm, mm, etc.). |
| **Set Measurements...** | Opens a window to select which measurements you want to record. | By default, ImageJ measures a few things (like Area). Here you can enable a wide range of measurements: **Area**, **Mean Gray Value** (average pixel intensity), **Standard Deviation**, **Integrated Density** (sum of pixel intensities), **Min & Max Gray Value**, **Perimeter**, **Fit Ellipse**, and more. You can also tick "**Limit to Threshold**". |
| **Calibrate...** | Creates a custom calibration curve to convert pixel intensity into a physical quantity (e.g., protein concentration). | Used for quantitative densitometry, like analysing Western blots to estimate protein amounts. |
| `Histogram` | Displays a histogram of pixel intensities in the current selection or the whole image. | A histogram is a bar chart showing how many pixels have each possible intensity value. It's crucial for understanding an image's brightness distribution and selecting a good threshold. |
| `Plot Profile` | Plots a graph of pixel intensities along a line selection. | This is very useful for measuring the intensity profile of a fluorescent object, a band on a gel, or a cell membrane, giving you quantitative data about spatial intensity changes. |
| **Surface Plot** | Generates a 3D "landscape" of an image where the height of the terrain represents pixel intensity. | A great way to visualise the intensity distribution of a complex image. |
| **Measure** | (Shortcut: `M`) Takes measurements of the current selection based on the options you've set in the 'Set Measurements...' window. Results appear in a new 'Results' window. | This is the command you will use most often to extract quantitative data. |
| **Analyze Particles...** | Detects and measures distinct objects in a binary (mask) image. You can set size and circularity limits. | This is the power tool for **segmentation**: counting cells, measuring their area, and obtaining statistics for hundreds of objects automatically. The image must be prepared (e.g., with a threshold) to create a mask where objects are white and background is black. |
| `Summarize` | (Only appears when the 'Results' window is active) Calculates summary statistics (mean, standard deviation, min, max, etc.) for all measurements in the 'Results' table. | Essential for reporting your findings (e.g., "the mean cell area was 125 µm² with a standard deviation of 8 µm²"). |
| `Distribution...` | Creates a frequency distribution (histogram) of your measurement data. | Useful for visualising the distribution of a measured feature (e.g., particle sizes) across your sample. |

{{< badge "Exploration" "EXtraaa!" >}}

#### Plugins Menu
You can skip this. While many powerful tools are here, the practical will likely provide you with the exact plugins you need or you will not be expected to use them. For now, just **"Explore for that"** as you indicated.

### 🛠️ Essential Tools in the ImageJ Toolbar (The "Toolkit")

This floating palette is where you find the tools for manual and interactive image inspection. The most important ones are listed below.

- **Point Tool**: Measures the intensity of single pixels (shown in the status bar).
- **Line Tool**: Draws a straight line. Double-clicking it opens a dialogue to set line width. Used with `Analyze > Plot Profile` to measure intensity profiles and with `Analyze > Measure` to measure lengths.
- **Segmented Line Tool**: Draws a line of connected segments. Useful for measuring curved structures.
- **Freehand Line Tool**: Allows you to draw any free-form curve.
- **Rectangle/Ellipse/Polygon Tool**: Creates area selections for measuring regions of interest (ROIs). Double-clicking the Rectangle tool allows you to set a fixed aspect ratio or size.
- **Freehand Selection Tool**: (The lasso) Enables you to draw an irregular area by hand, perfect for outlining an organelle or an irregularly shaped cell.
- **Wand Tool**: Automatically finds and selects contiguous regions of the same intensity. A very powerful tool for quickly outlining a blob or an area of homogeneous intensity after thresholding.
- **Angle Tool**: Measures the angle between two lines or three points.
- **Magnifying Glass (`+` / `-`)**: Zooms in and out. You can click to zoom, right-click to zoom out. Crucially, *all analysis and processing functions work regardless of zoom level*.
- **Hand (Scrolling) Tool**: Allows you to navigate around a zoomed-in image.
- **Text Tool**: Adds text annotations to your image.
- **Colour Picker**: Sets the colour for drawing, text, and selections.

### 📊 Essential Concepts You Must Understand

These concepts are the foundation of the quantitative analysis you will perform.

#### Digital Images Are Data
A digital image is not just a picture; it's a dataset. Each pixel has a number (its "intensity" or "gray value"). For an 8‑bit image, this number ranges from 0 (black) to 255 (white). All measurements are based on these numbers.

#### Selections (ROIs)
Selections are the areas you define on an image before measuring. To measure something, you must first select it (using a selection tool like Rectangle, Ellipse, Freehand, or the Wand). This selected area is called a Region of Interest (ROI). You can save and load ROIs to apply the same measurement to multiple images.

#### Thresholding
This is a technique to create a binary image (black and white) by separating an image into "objects" (foreground) and "background" based on pixel intensity. For example, if you set a threshold from 100 to 255, all pixels with a value ≥100 become white (selected), and all others become black.

**Why is this so important?** It allows you to automate the analysis of complex or numerous features. After thresholding, you can use `Analyze > Analyze Particles...` to instantly measure the size, shape, and number of every white object (like cells or colonies) in the image.

### 💡 Summary: Your Workflow for the Plant Practical

1. **Load** the image (`File > Open` or `File > Import` for stacks).
2. **Calibrate** the scale: If a scale bar is present, use a line selection to draw its exact length and then `Analyze > Set Scale` to convert pixels to known units (e.g., µm). *Note: Actual papers may provide pre‑calibrated images.*
3. **Pre‑process** if needed: Adjust brightness/contrast for visual inspection, subtract background, or apply a filter (e.g., `Median`) to reduce noise.
4. **Isolate your feature**: Use the appropriate selection tool (Wand, Rectangle, Freehand, or a threshold) to create a selection that exactly outlines the plant part you need to measure.
5. **Set your measurements**: Go to `Analyze > Set Measurements` and tick the parameters you need (e.g., `Area`, `Mean Gray Value`, `Integrated Density`).
6. **Measure**: Click `Analyze > Measure` (or press `M`). The results will appear in a new window.
7. **Analyse multiple features**: If you have many similar objects (like several leaves or cells), use `Analyze > Analyze Particles...` after creating a binary mask with thresholding.
8. **Interpret and report**: The final step is to take the quantitative data from the `Results` window, summarise it (using `Analyze > Summarize`), and interpret it in the context of the biological question.

By understanding these core concepts and features, you will be well-prepared for the ImageJ section of the plant computational biology practical.

---

## Plant Computational Biology – Practice Problems

<span class="badge-challenge">⚡ Practice Problems</span> This set of five problems simulates the ImageJ section of the  Plant computational biology practical. Use them to familiarise yourself with scale calibration, segmentation, colour thresholding, fluorescence quantification, and automated particle analysis.

{{< tabs items="Problem 1,Problem 2,Problem 3,Problem 4,Problem 5,Solutions" >}}

{{< tab name="Problem 1" >}}
## Root System Architecture and Scale Calibration

An *Arabidopsis thaliana* seedling was grown on agar. You are provided with a high‑resolution scan. The image metadata indicates a resolution of 300 DPI, but a physical ruler is present in the frame where **10 mm corresponds to 118 pixels**.

**Tasks:**

1. Calibrate the spatial scale.
2. Using the **Segmented Line Tool**, measure the primary root length.
3. Calculate the root growth rate given the seedling is 5 days old.

<img src="/imagejps/imagejp1.png" alt="Root image with ruler" style="max-width:100%;">

### Protocol

1. `Analyze > Set Scale`: Distance in pixels = 118, Known distance = 10, Unit = `mm`.  
   *Result:* A scale of 11.8 px/mm is set.

2. Select **Segmented Line** tool. Trace from the hypocotyl‑root junction to the root tip.  
   (Double‑click the tool to adjust line width if needed.)

3. `Analyze > Measure` (or `Ctrl+M`). Record the measured length.

{{< badge "Tip" "info" >}} The measured length in pixels will be automatically converted to mm because the scale is set. Growth rate = total length / (5 days × 24 h/day).
{{< /tab >}}

{{< tab name="Problem 2" >}}
## Stomatal Phenotyping via Automated Segmentation

Identify stomatal density of an abaxial leaf epidermis from a DIC micrograph (**500 µm × 500 µm** field of view).

**Tasks:**

1. Pre‑process the image to reduce noise.
2. Apply **thresholding** to isolate stomatal apertures.
3. Use **Analyze Particles** to count stomata and exclude noise (size filter: 50–500 µm²).

<img src="/imagejps/imagejp2.png" alt="DIC micrograph of stomata" style="max-width:100%;">

### Protocol

1. `Process > Filters > Median...` – set radius to **2 pixels** (reduces salt‑and‑pepper noise while preserving edges).

2. `Image > Adjust > Threshold` – choose method **Otsu** or **Li** to automatically separate stomata (dark) from background (light).  
   *Adjust manually if needed.*

3. `Process > Binary > Watershed` – separates touching stomata.

4. `Analyze > Analyze Particles...`  
   - Size: `50‑500` (µm² – ensure scale is set)  
   - Circularity: `0.3‑1.0`  
   - Show: `Outlines` (to visualise detections)  
   - Tick `Summarize`

The `Summary` table gives the total count, average area, and area fraction.

{{< badge "Important" "warning" >}} Always check the outlines against the original image to avoid counting false positives (e.g., dirt or air bubbles).
{{< /tab >}}

{{< tab name="Problem 3" >}}
## Pigment Spatial Distribution using HSB Color Space

In a senescence study, a leaf displays chlorotic (yellow) and healthy (green) zones. You must quantify the ratio of chlorotic area to total leaf area.

**Tasks:**

1. Convert the RGB image to **HSB Stack**.
2. Determine which channel (Hue, Saturation, Brightness) best differentiates yellow from green.
3. Threshold the Hue channel: Green is typically ≈75/255, Yellow ≈45/255.

<img src="/imagejps/imagejp3.png" alt="Leaf with yellow chlorotic spots" style="max-width:100%;">

### Protocol

1. `Image > Type > HSB Stack` – splits the image into Hue, Saturation, and Brightness slices.

2. Select the **Hue** slice (window title often “Hue”).  
   *Observation:* Yellow and green have distinct hue values.

3. `Image > Adjust > Color Threshold` – from the dropdown choose **Hue**. Set the range to capture only the yellow pixels (e.g., 30–50 on a 0‑255 scale).  
   *Tick “Threshold” to see the mask.*

4. Measure the **Area Fraction** (`Analyze > Measure` with “Area Fraction” selected in `Set Measurements`).  
   Alternatively, use the `Wand` tool on the thresholded mask and measure the area.

The result is the percentage of leaf surface that is chlorotic.

{{< badge "Exploration" "info" >}} Try the same with Saturation and Brightness – are they also useful? Why or why not?
{{< /tab >}}

{{< tab name="Problem 4" >}}
## Fluorescence Quantification and Background Subtraction

Calculate the **Corrected Total Cell Fluorescence (CTCF)** of a GFP‑tagged protein in a tobacco pavement cell.

**Tasks:**

1. Define the cell boundary (ROI). (Use top left image)
2. Measure **Integrated Density** and **Area** of the cell.
3. Select three small neutral areas for background mean fluorescence.

<img src="/imagejps/imagejp4.png" alt="GFP fluorescence image of pavement cell" style="max-width:100%;">

### Protocol

1. Trace the cell using the **Polygon Selection** tool. Add the ROI to the ROI Manager (`T` key).

2. `Analyze > Set Measurements`: Tick `Area`, `Integrated Density`, `Mean Gray Value`.

3. Measure the cell: `Analyze > Measure` – record `Area_cell` and `IntDen_cell`.

4. Select **three background spots** (no cell fluorescence) using small circular selections. Measure each (`Ctrl+M`).  
   Compute the average of their **Mean** values → `Mean_bg`.

### Formula

$$ \text{CTCF} = \text{IntDen}_{\text{cell}} - (\text{Area}_{\text{cell}} \times \text{Mean}_{\text{bg}}) $$

{{< badge "Challenge" "error" >}} Why do we subtract `Area × Mean_bg` instead of just `IntDen_bg`? Think about the units.
{{< /tab >}}

{{< tab name="Problem 5" >}}
## Optional: Combined Practice

Use the attached <a href="/problem5.pdf">PDF</a> and the attached image
<img src="/imagejps/imagejp5.png" alt="C3 vs C4 plants" style="max-width:100%;">
Upper row is for C3 and lower row is for C4 plants.

Compare your results with the solution in the **Solutions** tab.

{{< /tab >}}

{{< tab name="Solutions" >}}
## Solutions to Problems

### Problem 1 – Root growth rate

**Scale calibration:**  
10 mm = 118 px → 1 mm = 11.8 px  
Measured root length (example) = 472 px.

$$ L_{\text{mm}} = \frac{472\ \text{px}}{11.8\ \text{px/mm}} = 40.0\ \text{mm} $$

Growth over 5 days = 5 × 24 h = 120 h.

$$ R = \frac{40.0\ \text{mm}}{120\ \text{h}} = 0.333\ \text{mm·h}^{-1} $$

$$ \boxed{0.333\ \text{mm·h}^{-1}} $$

---

### Problem 2 – Stomatal density

Example data: Total field area = 0.25 mm², detected stomata count = 42.

$$ \text{Density} = \frac{42}{0.25} = 168\ \text{stomata·mm}^{-2} $$

$$ \boxed{168\ \text{stomata·mm}^{-2}} $$

---

### Problem 3 – Chlorotic area fraction

Example: Total leaf area = 1200 mm², thresholded yellow area = 360 mm².

$$ \text{Chlorosis \%} = \frac{360}{1200} \times 100 = 30.0\% $$

$$ \boxed{30.0\%} $$

---

### Problem 4 – CTCF calculation

Given:  
`IntDen_cell` = 1,500,000 A.U.  
`Area_cell` = 5,000 pixels²  
`Mean_bg` (average of three background spots) = 40 A.U.

$$ \begin{aligned} \text{CTCF} &= 1{,}500{,}000 - (5{,}000 \times 40) \\ &= 1{,}500{,}000 - 200{,}000 \\ &= 1{,}300{,}000\ \text{A.U.} \end{aligned} $$

$$ \boxed{1.3 \times 10^{6}\ \text{A.U.}} $$

---

### Problem 5 – C3 vs C4 comparison

Your answers should be as mentioned in the PDF. The expected differences include:

- C4 plants typically have higher photosynthetic rates at high temperature and light.
- Stomatal density may differ.
- Chlorophyll fluorescence parameters (Fv/Fm) are more stable in C4 under stress.

{{< badge "Note" "info" >}} If your numbers differ but the workflow was correct, that's fine – what matters is consistency and understanding of the steps.
{{< /tab >}}

{{< /tabs >}}

<script>
// Re-run MathJax when a tab becomes visible (to render equations inside hidden tabs)
document.addEventListener('DOMContentLoaded', function() {
  const tablist = document.querySelector('[role="tablist"]');
  if (tablist) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          setTimeout(function() {
            if (window.MathJax) {
              MathJax.typesetPromise();
            }
          }, 100);
        }
      });
    });
    observer.observe(tablist, { attributes: true, childList: true, subtree: true });
  }
});
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