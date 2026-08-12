"""
Renders one or more PDF pages at high DPI so a human or an external tool
can transcribe the official answer key directly (see
context/papers-ingestion-lean-workflow.md, stage 2).

Usage:
  python3 scripts/papers_ingest/render_answer_key.py EXAM.pdf 80 out.png
  python3 scripts/papers_ingest/render_answer_key.py EXAM.pdf 76-79 out_dir/ --dpi 250

Prints the exact CSV schema the transcription should be typed into
(question_number,letter,answer) — hand that spec, plus the rendered PNG(s),
to whoever/whatever is doing the transcription.
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from pdf_tools import open_pdf, render_page_region

ANSWERS_CSV_SPEC = """\
Transcribe the answer key into a CSV with this exact header and shape:

  question_number,letter,answer
  81,A,TRUE
  81,B,FALSE
  81,C,FALSE
  81,D,TRUE
  82,A,TRUE
  ...

- question_number: the real exam question number (matches raw.json's "number").
- letter: A-D (or however many statements that question has).
- answer: TRUE or FALSE, exactly as given in the OFFICIAL answer key/solutions
  section (not any unofficial "community solutions" PDF, if both exist).
One row per statement. Order doesn't matter, but don't skip any."""

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("pdf")
    ap.add_argument("pages", help="a single page number, or START-END for a range")
    ap.add_argument("out", help="output PNG path (single page) or directory (range)")
    ap.add_argument("--dpi", type=int, default=250)
    args = ap.parse_args()

    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    doc = open_pdf(args.pdf)

    if "-" in args.pages:
        start, end = (int(x) for x in args.pages.split("-", 1))
        out_dir = Path(args.out)
        out_dir.mkdir(parents=True, exist_ok=True)
        paths = []
        for p in range(start, end + 1):
            out_path = out_dir / f"answer-key-p{p:04d}.png"
            render_page_region(doc, p, out_path, dpi=args.dpi)
            paths.append(out_path)
        print(f"Rendered {len(paths)} pages to {out_dir}:")
        for p in paths:
            print(f"  {p}")
    else:
        page_num = int(args.pages)
        out_path = Path(args.out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        render_page_region(doc, page_num, out_path, dpi=args.dpi)
        print(f"Rendered page {page_num} to {out_path}")

    print()
    print(ANSWERS_CSV_SPEC)

if __name__ == "__main__":
    main()
