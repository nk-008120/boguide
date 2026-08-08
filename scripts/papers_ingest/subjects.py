"""
Live subject-tag discovery — reads content/resources/**/_index.md directly
instead of maintaining a hand-copied master list (the old workflow doc's
"confirmed titles" list drifts the moment a page title changes). Used by
both build_bundle.py (to hand the free model an always-current subject
list) and validate.py (to confirm a chosen tag actually resolves to a real
page).
"""
import re
from pathlib import Path


def discover_subjects(resources_dir):
    """Returns {title: {"section": section_dir, "link": link}}."""
    resources_dir = Path(resources_dir)
    subjects = {}

    # Section landing pages (e.g. 8-ecology, 10-bioinformatics have no
    # sub-pages at all — the section _index.md itself is the taggable unit).
    for index_md in resources_dir.glob("*/_index.md"):
        section_dir = index_md.parent.name
        title = _read_title(index_md)
        if title:
            subjects[title] = {"section": section_dir, "link": f"/resources/{section_dir}/"}

    # Topic sub-pages (the common case).
    for index_md in resources_dir.glob("*/*/_index.md"):
        section_dir = index_md.parent.parent.name
        page_dir = index_md.parent.name
        title = _read_title(index_md)
        if title:
            subjects[title] = {
                "section": section_dir,
                "link": f"/resources/{section_dir}/{page_dir.lower()}/",
            }
    return subjects


def _read_title(index_md):
    text = index_md.read_text(encoding="utf-8")
    m = re.search(r'^title:\s*"(.*?)"', text, re.M)
    if not m:
        return None
    # Section landing pages prefix a "✅" once content-complete (see
    # context/PROJECT-OVERVIEW.md) — that's a status marker, not part of the
    # actual subject name, so strip it for tagging purposes.
    return re.sub(r"^✅\s*", "", m.group(1)).strip()


def format_subject_list_for_prompt(subjects):
    """Grouped by section, for pasting into the free-model prompt bundle."""
    by_section = {}
    for title, info in subjects.items():
        by_section.setdefault(info["section"], []).append(title)
    lines = []
    for section in sorted(by_section):
        titles = " | ".join(sorted(by_section[section]))
        lines.append(f"{section}: {titles}")
    return "\n\n".join(lines)


if __name__ == "__main__":
    import sys
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")  # Windows console defaults to cp1252, breaks on em dashes/°/emoji
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("content/resources")
    subs = discover_subjects(root)
    print(f"{len(subs)} subject pages discovered under {root}")
    print(format_subject_list_for_prompt(subs))
