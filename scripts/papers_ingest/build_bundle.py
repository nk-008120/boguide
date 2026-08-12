"""
Stage 3 prep: auto-builds the exact prompt bundle
context/papers-ingestion-delegation.md already specifies, from extract.py's
raw.json + a transcribed answers CSV — so composing it is no longer a manual
task at all. Paste the script's output into whatever tool is writing the
explanations; paste its response into a .yaml/.txt file for assemble.py.

Usage:
  python3 scripts/papers_ingest/build_bundle.py raw.json answers.csv out.txt
    [--resources-dir content/resources]
"""
import argparse
import csv
import json
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from subjects import discover_subjects, format_subject_list_for_prompt

TEMPLATE_HEADER = """\
You are helping populate a Biology Olympiad practice-question archive. For each
question below, the CORRECT ANSWER for each statement is already given — your
job is only to explain WHY each statement is true or false, in 2-4 sentences,
grounded in the question's own text/figures. Do not re-derive or second-guess
the given answer; if your own reasoning seems to conflict with it, still
explain using the given answer and add one sentence noting the tension.

Use the exact statement text given -- never rephrase the statement itself.
Never copy sentences verbatim from any "community solutions" material you might
also have -- write explanations in your own words.
Pick exactly one or two subject tags per question from the MASTER SUBJECT LIST
below -- do not invent new ones or guess a link that isn't listed.
If a question's figure matters to a statement's truth, describe what the figure
shows in your explanation, but reference it only as [FIGURE-N] (N = 1, 2, ...)
-- do not invent a filename.

=== OUTPUT FORMAT (follow exactly, one block per question) ===
For each question, output a YAML block in this exact shape:

- id: qN
  number: "QXX"
  name: "Short Descriptive Title Matching the Question's Real Topic"
  stem: |
    <the question's own descriptive prose only -- the setup/scenario/figure
    caption text, reproduced verbatim from the source, with the "Question N"
    header line removed and the lettered A/B/C/D statement lines removed.
    This is mechanical trimming, not rewriting -- don't paraphrase it.>
  subjects:
    - name: "Exact Resource Page Title From The Master List"
  statements:
    - letter: "A"
      text: "<exact statement text from the question>"
      answer: true/false   # as given below, do not change
      explanation: "<your 2-4 sentence explanation>"
    - letter: "B"
      ...

=== MASTER SUBJECT LIST (pick only from these; "name" must match exactly) ==="""

TEMPLATE_FOOTER = """\
If none of these genuinely fit, say so explicitly instead of forcing a bad
match -- leave a note like `subjects: []  # none of the given list fits` and
it'll get fixed by hand.

=== QUESTIONS (answers already given -- explain, don't re-derive) ==="""

def load_answers(csv_path):
    answers = defaultdict(dict)
    with open(csv_path, encoding="utf-8") as f:
        for row in csv.DictReader(f):
            number = row["question_number"].strip().lstrip("Qq")
            letter = row["letter"].strip().upper()
            val = row["answer"].strip().upper()
            answers[number][letter] = val in ("TRUE", "T", "YES", "1")
    return answers

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("raw_json")
    ap.add_argument("answers_csv")
    ap.add_argument("out")
    ap.add_argument("--resources-dir", default="content/resources")
    ap.add_argument("--id-prefix", default="q", help="id prefix used in the output block, e.g. q81 vs q31")
    ap.add_argument("--id-offset", type=int, default=0,
                     help="subtract this from the exam question number to get the round-local id "
                          "(e.g. theoretical-2 ids restart at q1 for exam question 51 -> offset 50)")
    args = ap.parse_args()

    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    raw = json.loads(Path(args.raw_json).read_text(encoding="utf-8"))
    answers = load_answers(args.answers_csv)
    subjects = discover_subjects(args.resources_dir)
    subject_list_text = format_subject_list_for_prompt(subjects)

    parts = [TEMPLATE_HEADER, "", subject_list_text, "", TEMPLATE_FOOTER, ""]

    missing_answers = []
    for q in raw["questions"]:
        number = q["number"]
        given = answers.get(number)
        if not given:
            missing_answers.append(number)
            continue
        local_id = f"{args.id_prefix}{int(number) - args.id_offset}"
        n_figs = len(q["images"])
        fig_note = f" ({n_figs} figure(s) available, reference as [FIGURE-1]..[FIGURE-{n_figs}])" if n_figs else " (no figures)"
        parts.append(f"--- Question {number} (id: {local_id}){fig_note} ---")
        parts.append(q["text"])
        parts.append("Given answers: " + ", ".join(f"{letter}={'TRUE' if v else 'FALSE'}" for letter, v in sorted(given.items())))
        parts.append("")

    Path(args.out).write_text("\n".join(parts), encoding="utf-8")

    print(f"Wrote bundle for {len(raw['questions']) - len(missing_answers)} question(s) to {args.out}")
    if missing_answers:
        print(f"WARNING: {len(missing_answers)} question(s) had no matching row in {args.answers_csv}, "
              f"skipped: {', '.join(missing_answers)}")

if __name__ == "__main__":
    main()
