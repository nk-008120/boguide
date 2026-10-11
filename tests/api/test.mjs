import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const REPO_ROOT = path.resolve(__dirname, '../..');

let failures = 0;
function check(name, cond) {
  console.log((cond ? 'PASS' : 'FAIL') + ' -- ' + name);
  if (!cond) failures++;
}

function fakeAdmin({ rows, objects, failList, failRemove }) {
  const removed = [];
  return {
    removed,
    from(table) {
      return {
        select() {
          return {
            eq(_column, userId) {
              const data = (rows[table] || []).filter((r) => r.user_id === userId).map((r) => ({ id: r.id }));
              return Promise.resolve({ data, error: null });
            }
          };
        }
      };
    },
    storage: {
      from(bucket) {
        return {
          list(folder, { limit, offset }) {
            if (failList === bucket) return Promise.resolve({ data: null, error: new Error('list failed') });
            const names = ((objects[bucket] || {})[folder] || []).slice(offset, offset + limit);
            return Promise.resolve({ data: names.map((name) => ({ name, id: 'obj-' + name })), error: null });
          },
          remove(paths) {
            if (failRemove === bucket) return Promise.resolve({ data: null, error: new Error('remove failed') });
            for (const p of paths) removed.push(bucket + ':' + p);
            return Promise.resolve({ data: [], error: null });
          }
        };
      }
    }
  };
}

const { removeUserFiles } = require(path.join(REPO_ROOT, 'api/delete-account.js'));

const ME = 'user-me';
const OTHER = 'user-other';

console.log('--- delete-account: uploaded files ---');

{
  const many = Array.from({ length: 2350 }, (_, i) => `photo-${i}.jpg`);
  const admin = fakeAdmin({
    rows: {
      doubts: [{ id: 'doubt-1', user_id: ME }, { id: 'doubt-2', user_id: OTHER }],
      doubt_replies: [{ id: 'reply-1', user_id: ME }, { id: 'reply-2', user_id: OTHER }]
    },
    objects: {
      'biolab-captures': { [ME]: many, [OTHER]: ['theirs.jpg'] },
      'paper-contributions': { [ME]: ['exam.pdf', 'key.pdf'], [OTHER]: ['theirs.pdf'] },
      'doubt-images': { 'doubt-1': ['a.jpg'], 'doubt-2': ['theirs.jpg'] },
      'doubt-reply-images': { 'reply-1': ['b.jpg'], 'reply-2': ['theirs.jpg'] }
    }
  });
  const count = await removeUserFiles(admin, ME);
  check('every file of the deleted user is removed, across list pages', count === 2354 && admin.removed.length === 2354);
  check('result photos are removed from the user folder', admin.removed.includes(`biolab-captures:${ME}/photo-0.jpg`) && admin.removed.includes(`biolab-captures:${ME}/photo-2349.jpg`));
  check('contributed PDFs are removed', admin.removed.includes(`paper-contributions:${ME}/exam.pdf`) && admin.removed.includes(`paper-contributions:${ME}/key.pdf`));
  check('doubt and reply photos are removed by doubt and reply id', admin.removed.includes('doubt-images:doubt-1/a.jpg') && admin.removed.includes('doubt-reply-images:reply-1/b.jpg'));
  check('nobody else\'s files are touched', !admin.removed.some((p) => p.includes('theirs')));
}

{
  const admin = fakeAdmin({ rows: {}, objects: {} });
  const count = await removeUserFiles(admin, ME);
  check('a user with no uploads deletes cleanly', count === 0 && admin.removed.length === 0);
}

{
  const admin = fakeAdmin({ rows: {}, objects: { 'biolab-captures': { [ME]: ['a.jpg'] } }, failRemove: 'biolab-captures' });
  let threw = false;
  try { await removeUserFiles(admin, ME); } catch (e) { threw = true; }
  check('a storage failure is raised, so the handler stops before deleting the account', threw);
}

{
  const admin = fakeAdmin({ rows: {}, objects: {}, failList: 'paper-contributions' });
  let threw = false;
  try { await removeUserFiles(admin, ME); } catch (e) { threw = true; }
  check('a listing failure is raised too', threw);
}

console.log('\n--- account page: next redirect ---');

{
  const source = readFileSync(path.join(REPO_ROOT, 'static/js/papers-account.js'), 'utf8');
  const start = source.indexOf('function getNextParam()');
  const end = source.indexOf('var tabs = root.querySelectorAll');
  check('getNextParam is where the test expects it', start > 0 && end > start);
  const body = source.slice(start, end);
  const run = (raw) => {
    const window = { location: { search: '?next=' + raw, origin: 'https://bioguide.world' } };
    return new Function('window', 'URL', body + '; return getNextParam();')(window, URL);
  };
  const enc = encodeURIComponent;
  check('a same-site path is kept', run(enc('/doubts/?thread=1')) === '/doubts/?thread=1');
  check('the site root is kept', run(enc('/')) === '/');
  check('javascript: is refused', run(enc('javascript:alert(1)')) === null);
  check('data: is refused', run(enc('data:text/html,x')) === null);
  check('an absolute URL is refused', run(enc('https://evil.example/')) === null);
  check('a protocol-relative URL is refused', run(enc('//evil.example')) === null);
  check('backslash forms are refused', run(enc('/\\evil.example')) === null && run(enc('/x\\y')) === null);
  check('control characters are refused', run(enc('/a\tb')) === null);
  check('a malformed escape is refused, not thrown', run('%E0%A4%A') === null);
}

console.log('\n' + (failures === 0 ? 'ALL API AND REDIRECT CHECKS PASSED.' : `${failures} CHECK(S) FAILED.`));
if (failures > 0) process.exit(1);
