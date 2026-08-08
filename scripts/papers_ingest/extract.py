"""
Stage 1 of the lean ingestion pipeline (see
context/papers-ingestion-lean-workflow.md). Runs the mechanical PDF
extraction — page-to-question mapping, statement text, figure candidates —
as a script instead of Claude re-deriving the same Bash/Python each batch.

Usage:
  python3 scripts/papers_ingest/extract.py EXAM.pdf START END OUT_DIR
    [--question-regex REGEX]   default: ^Question\\s+(\\d+)\\b
    [--figure-mode {raster,vector,both,none}]  default: both
    [--dpi N]                  render DPI for auto-cropped vector figures, default 200

Every exam PDF has a different layout (confirmed across 2022 vs 2024 IBO
papers already) — that's why the question-boundary regex and figure mode are
flags, not hardcoded. Run once per new exam layout, sanity-check raw.json's
question count/page coverage against what you expect before trusting it for
a full batch.

Output (OUT_DIR/):
  text/page_NNNN.txt   — full per-page text dump, for a human glance if
                          something in raw.json looks wrong
  figures/*.png        — every figure candidate (raster + auto-cropped)
  raw.json             — {questions: [{number, page_start, page_end, text,
                          images: [{path, width, height, auto_cropped}]}]}
"""
import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from pdf_tools import (  # noqa: E402
    open_pdf, page_text, page_lines as get_page_lines, find_logo_hashes,
    extract_raster_images, find_figure_crop_region, render_page_region,
    find_boilerplate_lines,
)

DEFAULT_QUESTION_REGEX = r"^Question\s+(\d+)\b"
DEFAULT_CAPTION_REGEX = r"^Figure\s+\d+\."


def find_boundaries(pages_lines, question_regex):
    """
    pages_lines: {page_num: [line dicts from pdf_tools.page_lines]}. Returns
    a globally page+position-ordered list of (page, top_y, line_index,
    number) for every line matching question_regex — the "a new question
    starts exactly here" markers used both for text splitting and for
    figure assignment on pages shared by two adjacent questions.
    """
    pattern = re.compile(question_regex)
    boundaries = []
    for page_num in sorted(pages_lines):
        for i, line in enumerate(pages_lines[page_num]):
            m = pattern.match(line["text"])
            if m:
                boundaries.append((page_num, line["top"], i, m.group(1)))
    return boundaries


def owning_question(boundaries, page_num, top_y):
    """
    Which question "owns" a given (page, y-position) — the question whose
    boundary is the last one at or before this position, in reading order.
    Used to split both text and figures correctly when two adjacent
    questions share a page (e.g. Q80 ends and Q81 starts on the same page).
    Returns None if the position is before the first known boundary
    (content — usually front matter/instructions — that precedes Q1).
    """
    owner = None
    for (b_page, b_top, _i, number) in boundaries:
        if b_page > page_num or (b_page == page_num and b_top > top_y + 0.5):
            break
        owner = number
    return owner


def split_questions(pages_lines, boundaries, boilerplate=frozenset()):
    """
    Returns [{number, page_start, page_end, text}] by walking every line in
    page+position order and bucketing it into whichever question owns that
    position (see owning_question) — correct even when two questions share
    a page, unlike a naive page-range split. Lines matching `boilerplate`
    (repeating running headers/footers, see find_boilerplate_lines) are
    dropped from the assembled text but still count for page ownership.
    """
    buckets = {}  # number -> {"pages": set(), "lines": [text]}
    for page_num in sorted(pages_lines):
        for line in pages_lines[page_num]:
            owner = owning_question(boundaries, page_num, line["top"])
            if owner is None:
                continue
            b = buckets.setdefault(owner, {"pages": set(), "lines": []})
            b["pages"].add(page_num)
            if line["text"] not in boilerplate:
                b["lines"].append(line["text"])

    questions = []
    seen_order = []
    for (_page, _top, _i, number) in boundaries:
        if number not in seen_order:
            seen_order.append(number)
    for number in seen_order:
        b = buckets.get(number, {"pages": set(), "lines": []})
        pages = sorted(b["pages"])
        questions.append({
            "number": number,
            "page_start": pages[0] if pages else None,
            "page_end": pages[-1] if pages else None,
            "text": "\n".join(b["lines"]).strip(),
        })
    return questions


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("pdf")
    ap.add_argument("start", type=int)
    ap.add_argument("end", type=int)
    ap.add_argument("out_dir")
    ap.add_argument("--question-regex", default=DEFAULT_QUESTION_REGEX)
    ap.add_argument("--caption-regex", default=DEFAULT_CAPTION_REGEX)
    ap.add_argument("--figure-mode", choices=["raster", "vector", "both", "none"], default="both")
    ap.add_argument("--dpi", type=int, default=200)
    args = ap.parse_args()

    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    out_dir = Path(args.out_dir)
    text_dir = out_dir / "text"
    fig_dir = out_dir / "figures"
    text_dir.mkdir(parents=True, exist_ok=True)
    fig_dir.mkdir(parents=True, exist_ok=True)

    doc = open_pdf(args.pdf)

    pages_text, pages_lines = {}, {}
    for p in range(args.start, args.end + 1):
        pages_text[p] = page_text(doc, p)
        (text_dir / f"page_{p:04d}.txt").write_text(pages_text[p], encoding="utf-8")
        pages_lines[p] = get_page_lines(doc, p)

    boundaries = find_boundaries(pages_lines, args.question_regex)
    if not boundaries:
        print(f"WARNING: no questions matched --question-regex {args.question_regex!r} "
              f"in pages {args.start}-{args.end}. Check the regex against text/page_*.txt.")
    boilerplate = find_boilerplate_lines(pages_lines)
    questions = split_questions(pages_lines, boundaries, boilerplate)
    by_number = {q["number"]: q for q in questions}
    for q in questions:
        q["images"] = []

    logo_hashes = set()
    if args.figure_mode in ("raster", "both"):
        logo_hashes = find_logo_hashes(doc, args.start, args.end)

    n_raster, n_autocrop, n_unowned = 0, 0, 0
    for p in range(args.start, args.end + 1):
        page_had_raster = False
        if args.figure_mode in ("raster", "both"):
            candidates = extract_raster_images(doc, p, fig_dir, f"p{p:04d}", logo_hashes)
            for c in candidates:
                owner = owning_question(boundaries, p, c["top_y"])
                c["page"] = p
                c["auto_cropped"] = False
                if owner is None or owner not in by_number:
                    n_unowned += 1
                    continue
                by_number[owner]["images"].append(c)
                n_raster += 1
                page_had_raster = True
        if args.figure_mode in ("vector", "both") and not page_had_raster:
            region = find_figure_crop_region(pages_lines[p], args.caption_regex)
            if region is None:
                continue
            y0, y1 = region
            owner = owning_question(boundaries, p, y0)
            if owner is None or owner not in by_number:
                n_unowned += 1
                continue
            out_path = fig_dir / f"p{p:04d}-autocrop.png"
            dims = render_page_region(doc, p, out_path, dpi=args.dpi, y0=y0, y1=y1)
            by_number[owner]["images"].append({
                "path": str(out_path), "page": p,
                "width": dims["width"], "height": dims["height"],
                "auto_cropped": True,
            })
            n_autocrop += 1

    raw = {
        "source_pdf": str(Path(args.pdf).resolve()),
        "page_range": [args.start, args.end],
        "questions": questions,
    }
    (out_dir / "raw.json").write_text(json.dumps(raw, indent=2), encoding="utf-8")

    print(f"Pages processed: {args.start}-{args.end} ({args.end - args.start + 1})")
    print(f"Boilerplate lines filtered from question text: {len(boilerplate)} distinct "
          f"(running headers/footers, e.g. {sorted(boilerplate)[:3]})")
    print(f"Questions found: {len(questions)}"
          + (f" ({questions[0]['number']}-{questions[-1]['number']})" if questions else ""))
    print(f"Raster figure candidates: {n_raster} (logo/watermark hashes filtered: {len(logo_hashes)})")
    print(f"Auto-cropped vector figures: {n_autocrop} — these are best-effort guesses, "
          f"eyeball each one before trusting it (marked auto_cropped:true in raw.json)")
    if n_unowned:
        print(f"NOTE: {n_unowned} figure(s) fell before the first question boundary on the page range "
              f"(e.g. front-matter/instructions before Q{questions[0]['number'] if questions else '?'}) "
              f"and were dropped — expand the page range if one of these was a real figure.")
    print(f"Wrote {out_dir / 'raw.json'}")


if __name__ == "__main__":
    main()
