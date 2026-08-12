"""
Low-level PDF helpers shared by every papers_ingest script. Pure PyMuPDF
(fitz) — no subprocess calls to pdftotext/pdfimages/pdftoppm, so there's
nothing Windows-quoting-fragile here (see the old ENAMETOOLONG/heredoc
gotchas in context/papers-ingestion-workflow.md, none of which apply to a
real Python file).
"""
import hashlib
from pathlib import Path

import fitz

def open_pdf(pdf_path):
    return fitz.open(pdf_path)

def page_text(doc, page_num):
    """1-indexed page number, plain reading-order text (pdftotext -layout equivalent)."""
    return doc[page_num - 1].get_text("text")

def page_lines(doc, page_num):
    """
    1-indexed page number. Returns text lines with bounding boxes, sorted by
    vertical position — used for text-anchor figure cropping (see
    find_figure_crop_region below). Each item: {text, top, bottom, x0, x1}.
    """
    page = doc[page_num - 1]
    lines = []
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            spans = line.get("spans", [])
            if not spans:
                continue
            text = "".join(s["text"] for s in spans).strip()
            if not text:
                continue
            x0 = min(s["bbox"][0] for s in spans)
            x1 = max(s["bbox"][2] for s in spans)
            top = min(s["bbox"][1] for s in spans)
            bottom = max(s["bbox"][3] for s in spans)
            lines.append({"text": text, "top": top, "bottom": bottom, "x0": x0, "x1": x1})
    lines.sort(key=lambda l: l["top"])
    return lines

def find_logo_hashes(doc, start_page, end_page, min_occurrences=3, min_fraction=0.4):
    """
    Any embedded image whose raw bytes repeat across many pages in the range
    is almost certainly a header/footer logo, not a real figure — hash-based,
    so it works regardless of the logo's pixel dimensions (more robust than
    the dimension-based filtering the manual workflow used, which only works
    if you already know the one logo size for that specific exam PDF).
    """
    counts = {}
    n_pages = end_page - start_page + 1
    for p in range(start_page, end_page + 1):
        page = doc[p - 1]
        seen_this_page = set()
        for img in page.get_images(full=True):
            xref = img[0]
            try:
                data = doc.extract_image(xref)["image"]
            except Exception:
                continue
            h = hashlib.md5(data).hexdigest()
            if h in seen_this_page:
                continue
            seen_this_page.add(h)
            counts[h] = counts.get(h, 0) + 1
    threshold = max(min_occurrences, int(n_pages * min_fraction))
    return {h for h, c in counts.items() if c >= threshold}

def extract_raster_images(doc, page_num, out_dir, prefix, logo_hashes):
    """
    Extracts every non-logo embedded raster image on a page. Returns a list
    of {path, width, height, top_y} for real figure candidates (logo/
    watermark images, per find_logo_hashes, are silently skipped). top_y is
    the image's vertical position on the page (PDF points, top-down) via
    get_image_rects — needed to split figures correctly when two adjacent
    questions share a page (see extract.py's position-based assignment).
    """
    page = doc[page_num - 1]
    out = []
    seen = set()
    idx = 0
    for img in page.get_images(full=True):
        xref = img[0]
        try:
            info = doc.extract_image(xref)
        except Exception:
            continue
        data, ext = info["image"], info["ext"]
        h = hashlib.md5(data).hexdigest()
        if h in logo_hashes or h in seen:
            continue
        seen.add(h)
        idx += 1
        out_path = Path(out_dir) / f"{prefix}-img{idx:02d}.{ext}"
        out_path.write_bytes(data)
        rects = page.get_image_rects(xref)
        top_y = min((r.y0 for r in rects), default=0.0)
        out.append({"path": str(out_path), "width": info["width"], "height": info["height"], "top_y": top_y})
    return out

def find_boilerplate_lines(pages_lines, min_occurrences=3, min_fraction=0.3):
    """
    pages_lines: {page_num: [line dicts]}. A running page header/footer
    (exam title, "English (Official)", page codes like "Q1-1") repeats its
    *exact* text across most pages — same idea as find_logo_hashes but for
    text. Returns the set of line texts to drop before handing question text
    to a free model, so the prompt bundle isn't full of header noise.
    """
    counts = {}
    n_pages = len(pages_lines)
    for lines in pages_lines.values():
        for text in {l["text"] for l in lines}:
            counts[text] = counts.get(text, 0) + 1
    threshold = max(min_occurrences, int(n_pages * min_fraction))
    return {text for text, c in counts.items() if c >= threshold}

def find_figure_crop_region(lines, caption_regex, min_gap_ratio=2.5):
    """
    Text-anchor crop-region finder for vector-drawn figures (no embeddable
    raster image at all — see the 2024 Theoretical A gotcha in
    papers-ingestion-workflow.md). Finds the largest vertical gap between
    consecutive lines on the page; if a "Figure N." caption line exists at
    or after that gap, treats the gap as the figure region: top = bottom of
    the line just before the gap, bottom = top of the caption line (caption
    itself excluded, matching the documented padding-direction gotcha).
    Returns None if no gap/caption pattern is found (caller should fall
    back to flagging the page for a manual look rather than guessing).
    """
    import re
    if len(lines) < 2:
        return None
    gaps = []
    for i in range(len(lines) - 1):
        gap = lines[i + 1]["top"] - lines[i]["bottom"]
        gaps.append(gap)
    median_gap = sorted(gaps)[len(gaps) // 2] if gaps else 0
    best_i, best_gap = None, 0
    for i, g in enumerate(gaps):
        if g > best_gap:
            best_gap, best_i = g, i
    if best_i is None or median_gap <= 0 or best_gap < median_gap * min_gap_ratio:
        return None

    caption_i = None
    for i in range(best_i + 1, len(lines)):
        if re.match(caption_regex, lines[i]["text"]):
            caption_i = i
            break
    if caption_i is None:
        return None

    top_bound = lines[best_i]["bottom"]
    bottom_bound = lines[caption_i]["top"]
    if bottom_bound <= top_bound:
        return None
    return top_bound, bottom_bound

def render_page_region(doc, page_num, out_path, dpi=200, y0=None, y1=None, pad=3):
    """
    Renders a full page, or (if y0/y1 given, in PDF point units) a cropped
    vertical band of it, to a PNG. pad is applied *inward* (top+pad,
    bottom-pad) per the documented padding-direction gotcha — get the sign
    backwards and adjacent text bleeds into the crop.
    """
    page = doc[page_num - 1]
    clip = None
    if y0 is not None and y1 is not None:
        rect = page.rect
        clip = fitz.Rect(rect.x0, y0 + pad, rect.x1, y1 - pad)
    pix = page.get_pixmap(dpi=dpi, clip=clip)
    pix.save(str(out_path))
    return {"width": pix.width, "height": pix.height}
