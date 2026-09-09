"""
Redo of the figure-copy fix, this time under round-disambiguated filenames.
static/papers/ibo/2015/ is a FLAT directory shared by every round in that
year -- theoretical-a already has q1-figure-1.png .. q49-figure-1.png, and
assemble.py's dest_name = f"{qid}-figure-{i}.png" pattern collides directly
with those since theoretical-b uses the same q1..q49 id space. The first fix
pass (_fix_figures.py, since deleted) used bare qN-figure-N.png names and
silently overwrote 41 of theoretical-a's real figures with theoretical-b's
-- restored from git and redone here with a "theoretical-b-" prefix so
there is no possible collision with theoretical-a or any future round.
"""
import json
import shutil
import sys
from pathlib import Path

FIGURES_MAP = json.loads(Path(r"C:\tmp\ibo2015b_raw\figures_map.json").read_text(encoding="utf-8"))
STATIC_DIR = Path("static/papers/ibo/2015")
CONTENT_DIR = Path("content/papers/ibo/2015/theoretical-b")
ROUND_PREFIX = "theoretical-b-"

def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    copied, fixed = 0, 0
    for qid, sources in FIGURES_MAP.items():
        content_path = CONTENT_DIR / qid / "index.md"
        if not content_path.exists():
            print(f"MISSING CONTENT PAGE: {qid}")
            continue
        text = content_path.read_text(encoding="utf-8")
        # Old (bare qN-figure-N.png) references from the first, buggy fix pass --
        # replace those, not the original source basenames (already reverted on disk).
        for i, src in enumerate(sources, start=1):
            src_path = Path(src)
            if not src_path.exists():
                print(f"MISSING SOURCE: {qid} figure {i}: {src}")
                continue
            old_name = f"{qid}-figure-{i}.png"
            new_name = f"{ROUND_PREFIX}{qid}-figure-{i}.png"
            dest_path = STATIC_DIR / new_name
            if dest_path.exists():
                print(f"REFUSING to overwrite existing file: {dest_path}")
                continue
            shutil.copyfile(src_path, dest_path)
            copied += 1
            if old_name in text:
                text = text.replace(old_name, new_name)
                fixed += 1
            else:
                print(f"WARNING: {old_name!r} not found in {content_path}")
        content_path.write_text(text, encoding="utf-8")
    print(f"Copied {copied} figure file(s) under '{ROUND_PREFIX}*' names; fixed {fixed} reference(s).")

if __name__ == "__main__":
    main()
