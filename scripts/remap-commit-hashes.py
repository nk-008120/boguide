import re
import sys
from pathlib import Path

HEX = re.compile(r'(?<![#0-9a-fA-F])[0-9a-f]{7,40}(?![0-9a-fA-F])')


def load_map(path):
    pairs = {}
    for line in Path(path).read_text(encoding='utf-8').splitlines()[1:]:
        parts = line.split()
        if len(parts) == 2 and parts[0] != parts[1]:
            pairs[parts[0]] = parts[1]
    return pairs


def main():
    if len(sys.argv) < 3:
        print('usage: python scripts/remap-commit-hashes.py <commit-map> [--write] <file> [<file> ...]')
        sys.exit(2)
    pairs = load_map(sys.argv[1])
    write = '--write' in sys.argv
    files = [a for a in sys.argv[2:] if a != '--write']
    olds = sorted(pairs)
    total = 0
    for name in files:
        text = Path(name).read_text(encoding='utf-8')
        changes = []

        def swap(match):
            short = match.group(0)
            hits = [o for o in olds if o.startswith(short)]
            if len(hits) != 1:
                return short
            new = pairs[hits[0]]
            if set(new) == {'0'}:
                return short
            changes.append((short, new[:len(short)]))
            return new[:len(short)]

        updated = HEX.sub(swap, text)
        for old, new in changes:
            print(f'{name}: {old} -> {new}')
        total += len(changes)
        if write and changes:
            Path(name).write_text(updated, encoding='utf-8', newline='')
    print(f'{total} hash reference(s) {"updated" if write else "would be updated (dry run, add --write to apply)"}')


main()
