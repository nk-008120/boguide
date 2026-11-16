const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const docs = ['ARCHITECTURE.md', 'README.md', 'SECURITY.md', 'tests/README.md'];
const namedButAbsent = new Set([
  'data/bioclash/mb-01.yaml',
  'layouts/partials/head.html',
  'scripts/check_frontier.py',
  'scripts/check_outline_guide.py',
  'scripts/tag_globe_country.py'
]);
const pattern = /`((?:api|static|layouts|assets|content|supabase|tests|scripts|data|tools|i18n|\.github)\/[^`\s*{}<>$?]+)`/g;

let missing = 0;
for (const doc of docs) {
  const file = path.join(root, doc);
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(pattern)) {
    const ref = match[1].replace(/[.,:;)]+$/, '').replace(/:\d+(-\d+)?$/, '');
    if (namedButAbsent.has(ref)) continue;
    if (!fs.existsSync(path.join(root, ref))) {
      console.log(`${doc}: ${ref} does not exist`);
      missing++;
    }
  }
}

if (missing) {
  console.log(`${missing} missing path(s) named in the documentation`);
  process.exit(1);
}
console.log('Every path named in the documentation exists');
