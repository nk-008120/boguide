"""
Stage 6: formalizes the old runbook's ad hoc `python3 -c "import yaml; ..."`
checks into a real script, plus checks assemble.py's own output (figure
files resolve, subject links point at real pages, every problem has content
page). Prints a short summary — Claude's review reads this, not raw data.

Usage:
  python3 scripts/papers_ingest/validate.py \\
    --data-yaml data/papers/ibo/2022.yaml \\
    --content-dir content/papers/ibo/2022/theoretical-2 \\
    --static-dir static/papers/ibo/2022 \\
    --resources-dir content/resources \\
    [--round-id theoretical-2]   # only validate one round's problems within the yaml file
"""
import argparse
import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).parent))
from subjects import discover_subjects  # noqa: E402


def iter_problems(data, round_id=None):
    for round_ in data.get("rounds", []):
        if round_id and round_["id"] != round_id:
            continue
        for problem in round_.get("problems", []):
            yield round_["id"], problem


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--data-yaml", required=True)
    ap.add_argument("--content-dir", required=True)
    ap.add_argument("--static-dir", required=True)
    ap.add_argument("--resources-dir", default="content/resources")
    ap.add_argument("--round-id", default=None)
    args = ap.parse_args()

    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    data = yaml.safe_load(Path(args.data_yaml).read_text(encoding="utf-8"))
    subjects = discover_subjects(args.resources_dir)
    content_dir = Path(args.content_dir)
    static_dir = Path(args.static_dir)

    n = 0
    schema_fails, subject_fails, content_fails, figure_fails = [], [], [], []

    for round_id, p in iter_problems(data, args.round_id):
        n += 1
        pid = f"{round_id}/{p.get('id', '?')}"

        statements = p.get("statements", [])
        if len(statements) != 4:
            schema_fails.append(f"{pid}: {len(statements)} statements (expected 4)")
        for s in statements:
            if not isinstance(s.get("answer"), bool):
                schema_fails.append(f"{pid}-{s.get('letter', '?')}: answer is not boolean")
            if not s.get("explanation", "").strip():
                schema_fails.append(f"{pid}-{s.get('letter', '?')}: empty explanation")

        subs = p.get("subjects", [])
        if not subs:
            subject_fails.append(f"{pid}: no subject tags")
        for s in subs:
            title = s.get("name")
            if title not in subjects:
                subject_fails.append(f"{pid}: subject '{title}' does not match any real /resources/ page title")
            elif s.get("link") != subjects[title]["link"]:
                subject_fails.append(
                    f"{pid}: subject '{title}' link mismatch — yaml has '{s.get('link')}', "
                    f"live page is at '{subjects[title]['link']}'"
                )

        page_path = content_dir / p["id"] / "index.md"
        if not page_path.exists():
            content_fails.append(f"{pid}: no content page at {page_path}")
        else:
            page_text = page_path.read_text(encoding="utf-8")
            import re
            for m in re.finditer(r"!\[[^\]]*\]\(/papers/([^)]+)\)", page_text):
                fig_rel = m.group(1)
                fig_path = Path("static/papers") / fig_rel
                if not fig_path.exists():
                    figure_fails.append(f"{pid}: referenced figure does not exist on disk: {fig_path}")

    print(f"Validated {n} problem(s){' in round ' + args.round_id if args.round_id else ''}.")
    categories = [
        ("Schema (4 statements, boolean answers, non-empty explanations)", schema_fails),
        ("Subject tags (resolve to a real, current /resources/ page)", subject_fails),
        ("Content pages (index.md exists per problem id)", content_fails),
        ("Figure files (every image reference resolves on disk)", figure_fails),
    ]
    total_fails = sum(len(f) for _, f in categories)
    for label, fails in categories:
        status = "OK" if not fails else f"{len(fails)} issue(s)"
        print(f"  [{status}] {label}")
    if total_fails:
        print("\nDetails:")
        for label, fails in categories:
            for f in fails:
                print(f"  - {f}")
        sys.exit(1)
    print("\nAll checks passed.")


if __name__ == "__main__":
    main()
