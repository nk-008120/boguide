"""
Stage 5 of the lean ingestion pipeline: merges raw.json + the transcribed
answers CSV + the free model's explanations output + a figure-file mapping
into the final data/papers/<ol>/<year>.yaml entries and one
content/.../qN/index.md per question — pure templating, no LLM involved.
This is the highest-leverage script in the pipeline: it replaces the old
runbook's steps 9-11 (hand-writing every YAML block and every content page).

Usage:
  python3 scripts/papers_ingest/assemble.py \\
    --raw raw.json --answers answers.csv --explanations explanations.txt \\
    --figures figures_map.json \\
    --olympiad ibo --year 2022 --round theoretical-2 \\
    --id-prefix q --id-offset 50 \\
    --category "Theoretical 2" --exam-label "IBO 2022, Theoretical Paper 2" \\
    --source-pdf /papers/ibo/2022/theoretical-2-exam.pdf \\
    --solutions-pdf /papers/ibo/2022/theoretical-2-solutions.pdf \\
    --figures-static-dir static/papers/ibo/2022 \\
    --data-yaml data/papers/ibo/2022.yaml \\
    --content-dir content/papers/ibo/2022/theoretical-2 \\
    --resources-dir content/resources \\
    [--dry-run]

figures_map.json schema: {"q31": ["q31-figure-1.png", "path/to/candidate.png"], ...}
  Entries are matched to [FIGURE-N] in explanation order. A bare filename
  that already exists under --figures-static-dir is used as-is; anything
  else is treated as a source path to copy+rename into
  <figures-static-dir>/<id>-figure-<n>.<ext> automatically.

Never silently drops a problem: anything that fails to parse, cross-check,
or resolve is printed in a summary at the end and excluded from output —
fix the input and re-run rather than hand-editing generated files.
"""
import argparse
import csv
import json
import re
import shutil
import sys
from collections import defaultdict
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).parent))
from subjects import discover_subjects  # noqa: E402

FIGURE_MARKER_RE = re.compile(r"^Figure\.?\s*\d+\.\s*(.*)$")
CAPTION_STOP_RE = re.compile(r"^([A-Za-z]\.\s|Using the information|Question\s+\d+\s*$)")


def _clean_caption(text):
    text = re.sub(r"\s+", " ", text).strip()
    # Trim to the last complete sentence within the cap, so a hard length
    # cutoff doesn't end mid-word/mid-clause.
    m = list(re.finditer(r"[.!?]", text))
    if m and m[-1].end() < len(text):
        text = text[:m[-1].end()]
    return text


def load_answers(csv_path):
    answers = defaultdict(dict)
    with open(csv_path, encoding="utf-8") as f:
        for row in csv.DictReader(f):
            number = row["question_number"].strip().lstrip("Qq")
            letter = row["letter"].strip().upper()
            val = row["answer"].strip().upper()
            answers[number][letter] = val in ("TRUE", "T", "YES", "1")
    return answers


def parse_explanations(path):
    """
    Splits the free model's raw output into per-question YAML blocks and
    parses each independently, so one malformed block doesn't sink the
    whole batch. Returns (parsed: {id: dict}, failures: [(id_guess, error)]).
    """
    raw = Path(path).read_text(encoding="utf-8")
    raw = re.sub(r"^```[a-zA-Z]*\s*$", "", raw, flags=re.M)  # strip markdown fences if present
    matches = list(re.finditer(r"(?m)^- id:\s*(\S+)", raw))
    parsed, failures = {}, []
    for i, m in enumerate(matches):
        end = matches[i + 1].start() if i + 1 < len(matches) else len(raw)
        block = raw[m.start():end].rstrip()
        id_guess = m.group(1)
        try:
            loaded = yaml.safe_load(block)
            if not isinstance(loaded, list) or not loaded:
                raise ValueError("block did not parse to a non-empty YAML list")
            parsed[loaded[0]["id"]] = loaded[0]
        except Exception as e:
            failures.append((id_guess, str(e)))
    return parsed, failures


def derive_stem(raw_text, statement_letter_re=re.compile(r"(?m)^[A-Za-z]\.\s")):
    """Fallback if the free model's output has no `stem` field — best-effort, flagged by the caller."""
    lines = raw_text.split("\n")
    lines = [l for l in lines if not re.match(r"^Question\s+\d+\s*$", l)]
    out = []
    for line in lines:
        if statement_letter_re.match(line):
            break
        out.append(line)
    return "\n".join(out).strip()


def find_captions(raw_text, n, max_continuation_lines=2):
    """
    raw_text is reconstructed one-physical-line-per-original-line (see
    extract.py's split_questions), so there's no reliable blank-line
    paragraph gap to stop a caption at — this instead consumes a bounded
    number of lines after each "Figure N." marker, stopping early at the
    next figure marker, a lettered statement (A./B./...), or the
    "Using the information..." instruction line, whichever comes first.
    """
    lines = raw_text.split("\n")
    caps = []
    for i, line in enumerate(lines):
        m = FIGURE_MARKER_RE.match(line)
        if not m:
            continue
        parts = [m.group(1)]
        for j in range(i + 1, min(i + 1 + max_continuation_lines, len(lines))):
            nxt = lines[j]
            if not nxt.strip() or FIGURE_MARKER_RE.match(nxt) or CAPTION_STOP_RE.match(nxt):
                break
            parts.append(nxt)
        caps.append(_clean_caption(" ".join(parts)))
    return (caps + [None] * n)[:n]


def resolve_figures(fig_ids, figures_map, static_dir, qid):
    entries = figures_map.get(qid, [])
    resolved = []
    static_dir = Path(static_dir)
    for i, entry in enumerate(entries, start=1):
        dest_name = f"{qid}-figure-{i}.png"
        dest_path = static_dir / dest_name
        candidate_path = static_dir / entry
        if candidate_path.exists():
            resolved.append(candidate_path.name)
            continue
        src_path = Path(entry)
        if src_path.exists():
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src_path, dest_path)
            resolved.append(dest_name)
        else:
            resolved.append(None)  # flagged by caller
    return resolved


YAML_ENTRY_TEMPLATE = """\
      - id: {id}
        number: "{number}"
        name: "{name}"
        link: "{source_pdf}#page={page}"
        subjects:
{subjects}
        statements:
{statements}
"""

STATEMENT_TEMPLATE = """\
          - letter: "{letter}"
            text: {text}
            answer: {answer}
            explanation: {explanation}
"""

SUBJECT_TEMPLATE = """\
          - name: "{name}"
            link: "{link}"
"""

CONTENT_TEMPLATE = """\
---
title: "{number} — {name}"
---

{{{{< problem-meta category="{category}" note="Real exam question — full text reproduced under IBO's CC BY-NC-SA 4.0 license" >}}}}

<div class="papers-subject-tags" style="margin-bottom:1.5rem;">
{subject_tags}
</div>

{stem}
{figures}
Using the information and data, determine which of the statements are true or which are false.

{{{{< papers-quiz olympiad="{olympiad}" year="{year}" round="{round}" problem="{id}" >}}}}

{{{{< papers-problem-nav olympiad="{olympiad}" year="{year}" round="{round}" problem="{id}" >}}}}

---

Question reproduced from **{exam_label}**, licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — attributed to the International Biology Olympiad. [Open the full exam PDF]({source_pdf}#page={page}) · [Community solutions (unofficial)]({solutions_pdf})
"""


def yaml_scalar(s):
    return yaml.safe_dump(s, allow_unicode=True, default_style='"').strip()


def build_entry_text(q, args, page):
    subjects_text = "".join(
        SUBJECT_TEMPLATE.format(name=s["name"], link=s["link"]) for s in q["_resolved_subjects"]
    )
    statements_text = "".join(
        STATEMENT_TEMPLATE.format(
            letter=s["letter"],
            text=yaml_scalar(s["text"]),
            answer=str(bool(s["answer"])).lower(),
            explanation=yaml_scalar(s["explanation"]),
        )
        for s in q["statements"]
    )
    return YAML_ENTRY_TEMPLATE.format(
        id=q["id"], number=q["number"], name=q["name"],
        source_pdf=args.source_pdf, page=page,
        subjects=subjects_text.rstrip("\n"), statements=statements_text.rstrip("\n"),
    )


def build_content_page(q, args, page, figure_files, captions):
    subject_tags = "\n".join(
        f'  <a class="papers-subject-tag" href="{s["link"]}">{s["name"]}</a>' for s in q["_resolved_subjects"]
    )
    figures_md = ""
    for i, fname in enumerate(figure_files, start=1):
        cap = captions[i - 1] or f"Figure {i}."
        figures_md += f"\n![{cap}](/papers/{args.olympiad}/{args.year}/{fname})\n*{cap}*\n"
    return CONTENT_TEMPLATE.format(
        number=q["number"], name=q["name"], category=args.category,
        subject_tags=subject_tags, stem=q["_stem"].strip(), figures=figures_md,
        olympiad=args.olympiad, year=args.year, round=args.round, id=q["id"],
        exam_label=args.exam_label, source_pdf=args.source_pdf, page=page,
        solutions_pdf=args.solutions_pdf,
    )


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--raw", required=True)
    ap.add_argument("--answers", required=True)
    ap.add_argument("--explanations", required=True)
    ap.add_argument("--figures", required=True)
    ap.add_argument("--olympiad", required=True)
    ap.add_argument("--year", required=True)
    ap.add_argument("--round", required=True)
    ap.add_argument("--id-prefix", default="q")
    ap.add_argument("--id-offset", type=int, default=0)
    ap.add_argument("--category", required=True)
    ap.add_argument("--exam-label", required=True)
    ap.add_argument("--source-pdf", required=True)
    ap.add_argument("--solutions-pdf", required=True)
    ap.add_argument("--figures-static-dir", required=True)
    ap.add_argument("--data-yaml", required=True)
    ap.add_argument("--content-dir", required=True)
    ap.add_argument("--resources-dir", default="content/resources")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    raw = json.loads(Path(args.raw).read_text(encoding="utf-8"))
    raw_by_number = {q["number"]: q for q in raw["questions"]}
    answers = load_answers(args.answers)
    explanations, parse_failures = parse_explanations(args.explanations)
    figures_map = json.loads(Path(args.figures).read_text(encoding="utf-8"))
    subjects = discover_subjects(args.resources_dir)

    issues = []
    for id_guess, err in parse_failures:
        issues.append(f"PARSE FAILED for block starting near id={id_guess}: {err}")

    ok_entries, ok_pages, warnings = [], [], []
    for id_, q in explanations.items():
        exam_number = str(int(id_.lstrip(args.id_prefix)) + args.id_offset) if id_.lstrip(args.id_prefix).isdigit() else None
        raw_q = raw_by_number.get(exam_number)
        given = answers.get(exam_number)
        local_issues = []
        local_warnings = []

        if raw_q is None:
            local_issues.append(f"{id_}: no matching question {exam_number} in raw.json (page/anchor unknown)")
        if given is None:
            local_issues.append(f"{id_}: no answers.csv row for question {exam_number}")

        resolved_subjects = []
        for s in q.get("subjects", []) or []:
            name = s.get("name") if isinstance(s, dict) else s
            info = subjects.get(name)
            if info is None:
                local_issues.append(f"{id_}: subject '{name}' does not match any real /resources/ page title")
                continue
            resolved_subjects.append({"name": name, "link": info["link"]})
        if not resolved_subjects:
            local_issues.append(f"{id_}: zero resolved subject tags")
        q["_resolved_subjects"] = resolved_subjects

        for s in q.get("statements", []):
            letter = s.get("letter")
            claimed = bool(s.get("answer"))
            expected = given.get(letter) if given else None
            if expected is not None and claimed != expected:
                local_issues.append(
                    f"{id_}-{letter}: explanation's answer ({claimed}) does not match "
                    f"the given official answer ({expected}) — the model was not supposed to change this"
                )

        q["_stem"] = q.get("stem") or (derive_stem(raw_q["text"]) if raw_q else "")
        if not q.get("stem") and raw_q:
            local_warnings.append(f"{id_}: no 'stem' field from the model, used a heuristic fallback — spot-check it")

        fig_files = resolve_figures(None, figures_map, args.figures_static_dir, id_)
        for i, f in enumerate(fig_files, start=1):
            if f is None:
                local_issues.append(f"{id_}: figure {i} in figures_map.json did not resolve to a real file")
        fig_files = [f for f in fig_files if f]
        captions = find_captions(raw_q["text"], len(fig_files)) if raw_q else [None] * len(fig_files)

        if local_issues:
            issues.extend(local_issues)
            continue  # don't emit a question with unresolved problems
        warnings.extend(local_warnings)

        page = raw_q["page_start"]
        ok_entries.append(build_entry_text(q, args, page))
        ok_pages.append((id_, build_content_page(q, args, page, fig_files, captions)))

    print(f"Parsed {len(explanations)} explanation block(s), {len(parse_failures)} failed to parse.")
    print(f"Assembled {len(ok_entries)} question(s) cleanly; {len(issues)} issue(s) blocked the rest.")
    if issues:
        print("\nISSUES (fix inputs and re-run — nothing below was written for these):")
        for i in issues:
            print(f"  - {i}")
    if warnings:
        print("\nWARNINGS (written, but spot-check these):")
        for w in warnings:
            print(f"  - {w}")

    if args.dry_run:
        print("\n--dry-run: not writing any files.")
        return

    if ok_entries:
        with open(args.data_yaml, "a", encoding="utf-8") as f:
            f.write("\n" + "\n".join(ok_entries))
        print(f"\nAppended {len(ok_entries)} entries to {args.data_yaml}")

        content_dir = Path(args.content_dir)
        for id_, page_text in ok_pages:
            page_dir = content_dir / id_
            page_dir.mkdir(parents=True, exist_ok=True)
            (page_dir / "index.md").write_text(page_text, encoding="utf-8")
        print(f"Wrote {len(ok_pages)} content pages under {content_dir}")


if __name__ == "__main__":
    main()
