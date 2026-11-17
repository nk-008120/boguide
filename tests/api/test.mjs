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

function fakeAdmin({ rows, objects, failList, failRemove, failDelete, failLog }) {
  const removed = [];
  const events = [];
  return {
    removed,
    events,
    auth: {
      admin: {
        deleteUser(userId) {
          events.push('delete-user:' + userId);
          return Promise.resolve({ error: failDelete ? new Error('delete failed') : null });
        }
      }
    },
    from(table) {
      return {
        insert(row) {
          events.push('insert:' + table + ':' + row.user_id);
          return Promise.resolve({ error: failLog ? new Error('insert failed') : null });
        },
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
            events.push('remove:' + bucket);
            return Promise.resolve({ data: [], error: null });
          }
        };
      }
    }
  };
}

const { removeUserFiles, deleteAccount } = require(path.join(REPO_ROOT, 'api/delete-account.js'));

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
  check('a storage failure is raised by the file cleanup helper', threw);
}

{
  const admin = fakeAdmin({ rows: {}, objects: {}, failList: 'paper-contributions' });
  let threw = false;
  try { await removeUserFiles(admin, ME); } catch (e) { threw = true; }
  check('a listing failure is raised too', threw);
}

console.log('\n--- delete-account: order of steps ---');

{
  const admin = fakeAdmin({ rows: {}, objects: { 'biolab-captures': { [ME]: ['a.jpg'] } } });
  const stages = [];
  const result = await deleteAccount(admin, ME, async (_e, stage) => { stages.push(stage); });
  check('the account is deleted before any file is removed, and the log row is written last',
    result.status === 200 &&
    admin.events.join(',') === `delete-user:${ME},remove:biolab-captures,insert:account_deletions:${ME}` &&
    stages.length === 0);
}

{
  const admin = fakeAdmin({ rows: {}, objects: { 'biolab-captures': { [ME]: ['a.jpg'] } }, failDelete: true });
  const result = await deleteAccount(admin, ME, async () => {});
  check('if the account cannot be deleted, no file is removed and no log row is written',
    result.status === 500 && admin.removed.length === 0 && !admin.events.some((e) => e.startsWith('insert:')));
}

{
  const admin = fakeAdmin({ rows: {}, objects: {}, failList: 'biolab-captures' });
  const result = await deleteAccount(admin, ME, async () => {});
  check('if the files cannot be listed, the account is kept',
    result.status === 500 && !admin.events.some((e) => e.startsWith('delete-user')));
}

{
  const admin = fakeAdmin({ rows: {}, objects: { 'biolab-captures': { [ME]: ['a.jpg'] } }, failRemove: 'biolab-captures' });
  const stages = [];
  const result = await deleteAccount(admin, ME, async (_e, stage) => { stages.push(stage); });
  check('a file cleanup failure after the account is gone is reported, and the deletion still succeeds and is logged',
    result.status === 200 && stages.includes('file-cleanup') && admin.events.includes(`insert:account_deletions:${ME}`));
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

{
  console.log('\n--- bioclash-register ---');
  const { register } = require(path.join(REPO_ROOT, 'api/_lib/bioclashRegister.js'));
  const fakeInviter = (result) => {
    const calls = [];
    return {
      calls,
      auth: { admin: { inviteUserByEmail(email, options) { calls.push({ email, options }); return Promise.resolve({ error: result }); } } }
    };
  };
  const redirect = 'https://bioguide.world/account/';

  let admin = fakeInviter(null);
  let out = await register(admin, { email: '  Someone@Example.com ', display_name: ' Sam ' }, redirect);
  check('a new email is invited', out.status === 200 && out.body.status === 'invited');
  check('the email is trimmed and lowercased', admin.calls[0].email === 'someone@example.com');
  check('the display name and redirect are passed on', admin.calls[0].options.data.display_name === 'Sam' && admin.calls[0].options.redirectTo === redirect);

  admin = fakeInviter({ code: 'email_exists', message: 'A user with this email address has already been registered' });
  out = await register(admin, { email: 'a@b.co', display_name: 'A' }, redirect);
  check('an existing account is reported as existing, not as a failure', out.status === 200 && out.body.status === 'existing');

  admin = fakeInviter({ message: 'smtp down' });
  out = await register(admin, { email: 'a@b.co', display_name: 'A' }, redirect);
  check('any other invite error is a 502 with the cause kept', out.status === 502 && out.cause && out.cause.message === 'smtp down');

  admin = fakeInviter(null);
  out = await register(admin, { email: 'not-an-email', display_name: 'A' }, redirect);
  check('a bad email is refused before Supabase is called', out.status === 400 && admin.calls.length === 0);
  out = await register(admin, { email: 'a@b.co', display_name: '' }, redirect);
  check('an empty display name is refused', out.status === 400 && admin.calls.length === 0);
  out = await register(admin, { email: 'a@b.co', display_name: 'x'.repeat(61) }, redirect);
  check('a display name over 60 characters is refused', out.status === 400 && admin.calls.length === 0);
  out = await register(admin, undefined, redirect);
  check('a missing body is refused, not thrown', out.status === 400);

  const adminHandler = require(path.join(REPO_ROOT, 'api/bioclash-admin.js'));
  const fakeRes = () => {
    const r = { code: 0, body: null, headersSent: false };
    r.status = (c) => { r.code = c; return r; };
    r.json = (b) => { r.body = b; r.headersSent = true; return r; };
    return r;
  };
  let res = fakeRes();
  await adminHandler({ method: 'GET', query: { route: 'register' }, headers: {} }, res);
  check('bioclash-admin hands route=register to the register code', res.code === 405 && res.body.ok === false);
  const saved = process.env.BIOCLASH_REGISTER_SECRET;
  process.env.BIOCLASH_REGISTER_SECRET = 'right';
  res = fakeRes();
  await adminHandler({ method: 'POST', query: { route: 'register' }, headers: { authorization: 'Bearer wrong' }, body: {} }, res);
  check('the register route refuses a wrong key', res.code === 401);
  if (saved === undefined) delete process.env.BIOCLASH_REGISTER_SECRET; else process.env.BIOCLASH_REGISTER_SECRET = saved;
}

console.log('\n' + (failures === 0 ? 'ALL API AND REDIRECT CHECKS PASSED.' : `${failures} CHECK(S) FAILED.`));
if (failures > 0) process.exit(1);
