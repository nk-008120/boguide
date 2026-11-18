import { createRequire, Module } from 'node:module';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const REPO_ROOT = path.resolve(__dirname, '../..');

let failures = 0;
function check(name, cond) {
  console.log((cond ? 'PASS' : 'FAIL') + ' -- ' + name);
  if (!cond) failures++;
}

const USERS = { 'tok-alice': 'user-alice', 'tok-bob': 'user-bob', 'tok-carol': 'user-carol' };
const MINUTE = 60000;
const iso = (offsetMs) => new Date(Date.now() + offsetMs).toISOString();
const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

class Query {
  constructor(db, table) {
    this.db = db;
    this.table = table;
    this.op = 'select';
    this.filters = [];
    this.returning = false;
    this.mode = 'many';
    this.limitN = null;
  }
  select() { if (this.op !== 'select') this.returning = true; return this; }
  insert(rows) { this.op = 'insert'; this.payload = rows; return this; }
  update(patch) { this.op = 'update'; this.payload = patch; return this; }
  upsert(rows, opts) { this.op = 'upsert'; this.payload = rows; this.opts = opts || {}; return this; }
  eq(column, value) { this.filters.push((r) => r[column] === value); return this; }
  lt(column, value) { this.filters.push((r) => r[column] != null && r[column] < value); return this; }
  in(column, values) { this.filters.push((r) => values.includes(r[column])); return this; }
  limit(n) { this.limitN = n; return this; }
  maybeSingle() { this.mode = 'maybe'; return this; }
  single() { this.mode = 'single'; return this; }
  then(resolve, reject) { return Promise.resolve().then(() => this.run()).then(resolve, reject); }

  rows() {
    if (!this.db.tables[this.table]) this.db.tables[this.table] = [];
    return this.db.tables[this.table];
  }

  withDefaults(row) {
    const now = new Date().toISOString();
    const id = this.table.replace('bioclash_', '') + '-' + this.db.nextId++;
    if (this.table === 'bioclash_attempts') {
      return { id, status: 'in_progress', started_at: now, submitted_at: null, fullscreen_exits: 0, visibility_losses: 0, tab_close_events: 0, heartbeat_gaps: 0, extension_blocks_used: 0, extension_penalty: 0, reached_final_page: false, ...row };
    }
    if (this.table === 'bioclash_attempt_blocks') {
      return { id, status: 'active', answer: {}, locked_at: null, updated_at: now, ...row };
    }
    return { id, ...row };
  }

  shape(list) {
    if (this.mode === 'maybe') {
      if (list.length > 1) return { data: null, error: new Error('more than one row') };
      return { data: list[0] ? clone(list[0]) : null, error: null };
    }
    if (this.mode === 'single') {
      if (list.length !== 1) return { data: null, error: new Error('expected one row') };
      return { data: clone(list[0]), error: null };
    }
    return { data: clone(list), error: null };
  }

  run() {
    const failure = this.db.fail[this.table + ':' + this.op];
    if (failure) return { data: null, error: new Error(failure) };
    this.db.log.push({ table: this.table, op: this.op, payload: clone(this.payload) });
    const all = this.rows();
    if (this.op === 'select') {
      let found = all.filter((r) => this.filters.every((f) => f(r)));
      if (this.limitN != null) found = found.slice(0, this.limitN);
      return this.shape(found);
    }
    if (this.op === 'insert') {
      const list = (Array.isArray(this.payload) ? this.payload : [this.payload]).map((r) => this.withDefaults(clone(r)));
      all.push(...list);
      return this.returning ? this.shape(list) : { data: null, error: null };
    }
    if (this.op === 'upsert') {
      const keys = String(this.opts.onConflict || 'id').split(',');
      for (const row of this.payload) {
        const existing = all.find((r) => keys.every((k) => r[k] === row[k]));
        if (existing) {
          if (!this.opts.ignoreDuplicates) Object.assign(existing, clone(row));
        } else {
          all.push(this.withDefaults(clone(row)));
        }
      }
      return { data: null, error: null };
    }
    if (this.op === 'update') {
      if (this.db.hooks.beforeUpdate) this.db.hooks.beforeUpdate(this.table, this.payload);
      const matched = all.filter((r) => this.filters.every((f) => f(r)));
      for (const r of matched) Object.assign(r, clone(this.payload));
      return this.returning ? this.shape(matched) : { data: null, error: null };
    }
    return { data: null, error: new Error('unsupported op') };
  }
}

function makeDb(seed) {
  const db = {
    tables: { bioclash_attempts: [], bioclash_attempt_blocks: [], bioclash_paper_access: [], profiles: [], ...clone(seed || {}) },
    log: [],
    nextId: 1,
    rateCount: 1,
    rpcCalls: [],
    hooks: {},
    fail: {},
    signed: []
  };
  db.from = (table) => new Query(db, table);
  db.rpc = async (name, args) => {
    db.rpcCalls.push({ name, args: clone(args) });
    if (name === 'rate_limit_hit') return { data: db.rateCount, error: null };
    if (db.fail['rpc:' + name]) return { data: null, error: new Error(db.fail['rpc:' + name]) };
    return { data: null, error: null };
  };
  db.storage = {
    from(bucket) {
      return {
        createSignedUrls(paths, ttl) {
          db.signed.push({ bucket, paths: paths.slice(), ttl });
          return Promise.resolve({ data: paths.map((p) => ({ path: p, signedUrl: 'https://signed.example/' + p + '?token=t' })), error: null });
        }
      };
    }
  };
  db.attempt = (userId, paperId) => db.tables.bioclash_attempts.find((a) => a.user_id === userId && a.paper_id === paperId);
  db.block = (attemptId, blockId) => db.tables.bioclash_attempt_blocks.find((b) => b.attempt_id === attemptId && b.block_id === blockId);
  return db;
}

let currentDb = makeDb();
const anonClient = {
  auth: {
    getUser(token) {
      const id = USERS[token];
      return Promise.resolve(id ? { data: { user: { id } }, error: null } : { data: { user: null }, error: new Error('invalid token') });
    }
  }
};

const supabaseAdminPath = require.resolve(path.join(REPO_ROOT, 'api/_lib/supabaseAdmin.js'));
const stub = new Module(supabaseAdminPath);
stub.filename = supabaseAdminPath;
stub.loaded = true;
stub.exports = { getAdminClient: () => currentDb, getAnonClient: () => anonClient };
require.cache[supabaseAdminPath] = stub;

delete process.env.SENTRY_DSN;

const opt = (key, text) => ({ key, text });
const OPEN = {
  title: 'Synthetic test paper',
  durationMinutes: 60,
  maxExtensionBlocks: 2,
  extensionBlockMinutes: 15,
  extensionCostSchedule: [0.05, 0.1],
  totalMarks: 20,
  parts: [
    {
      id: 'p-open',
      name: 'Open part',
      intro: 'Synthetic intro',
      blocks: [
        {
          id: 'a1',
          type: 'question_set',
          label: 'A1',
          components: [
            { key: 'm1', type: 'mcq', marks: 1, prompt: 'Synthetic mcq one', options: [opt('a', 'alpha'), opt('b', 'beta'), opt('c', 'gamma'), opt('d', 'delta')], correctKey: 'b' },
            { key: 't1', type: 'true_false', marks: 1, prompt: 'Synthetic statement', correctValue: true },
            { key: 'n1', type: 'numeric', marks: 2, prompt: 'Synthetic number near zero', expected: 0, tolerance: 0.01 },
            { key: 'w1', type: 'written', marks: 3, prompt: 'Synthetic written one' }
          ]
        },
        {
          id: 'a2',
          type: 'question_set',
          label: 'A2',
          images: [{ src: 'private:figs/zz-a2.png', alt: 'figure' }, { src: '/public/zz-plain.png', alt: 'plain' }],
          components: [
            { key: 'm2', type: 'mcq', marks: 1, prompt: 'Synthetic mcq two', options: [opt('a', 'one'), opt('b', 'two'), opt('c', 'three')], correctKey: 'c' }
          ]
        }
      ]
    },
    {
      id: 'p-chain',
      name: 'Chain part',
      blocks: [
        {
          id: 'b1',
          type: 'question_set',
          locksAfterSubmit: true,
          lockWarning: 'Synthetic warning',
          reveals: ['r1', 'b2'],
          components: [
            { key: 'c1', type: 'mcq', marks: 2, prompt: 'Synthetic chain mcq', options: [opt('a', 'x'), opt('b', 'y')], correctKey: 'a' }
          ]
        },
        { id: 'r1', type: 'reveal_content', content: 'Synthetic revealed content' },
        {
          id: 'b2',
          type: 'question_set',
          locksAfterSubmit: true,
          revealsParts: ['p-final'],
          components: [
            { key: 'c2', type: 'numeric', marks: 2, prompt: 'Synthetic chain number', expected: 5, tolerance: 0.5, imageRef: 'private:figs/zz-b2.png' }
          ]
        }
      ]
    },
    {
      id: 'p-final',
      name: 'Final part',
      blocks: [
        {
          id: 'f1',
          type: 'question_set',
          components: [
            { key: 'fw', type: 'written', marks: 3, prompt: 'Synthetic written two' },
            { key: 'fo', type: 'free_text_for_others', refersTo: 'm1', marksEach: 1, promptTemplate: 'Why not {option}?' }
          ]
        }
      ]
    }
  ]
};

const simplePart = [{ id: 'p', name: 'P', blocks: [{ id: 's1', type: 'question_set', components: [{ key: 'q', type: 'mcq', marks: 1, prompt: 'Synthetic', options: [opt('a', 'a'), opt('b', 'b')], correctKey: 'a' }] }] }];
const PAPERS = {
  'zz-open': OPEN,
  'zz-allow': { title: 'Allowlist', accessMode: 'allowlist', parts: simplePart },
  'zz-future': { title: 'Future', opensAt: iso(24 * 60 * MINUTE), parts: simplePart },
  'zz-closed': { title: 'Closed', closesAt: iso(-24 * 60 * MINUTE), parts: simplePart },
  'zz-noext': { title: 'No extension', parts: simplePart }
};

const tempRoot = mkdtempSync(path.join(os.tmpdir(), 'bioclash-handlers-'));
mkdirSync(path.join(tempRoot, 'data', 'bioclash'), { recursive: true });
for (const [id, paper] of Object.entries(PAPERS)) {
  writeFileSync(path.join(tempRoot, 'data', 'bioclash', id + '.yaml'), JSON.stringify(paper));
}
const originalCwd = process.cwd();
process.chdir(tempRoot);

const load = (name) => require(path.join(REPO_ROOT, 'api', name + '.js'));
const start = load('bioclash-start-attempt');
const state = load('bioclash-attempt-state');
const saveDraft = load('bioclash-save-draft');
const lockBlock = load('bioclash-lock-block');
const extension = load('bioclash-request-extension');
const submit = load('bioclash-submit-attempt');
const heartbeat = load('bioclash-heartbeat');
const adminHandler = load('bioclash-admin');

const realConsoleError = console.error;
const quietErrors = [];
console.error = (...args) => { quietErrors.push(args.map(String).join(' ')); };

function fakeRes() {
  const r = { code: 0, body: null, headersSent: false };
  r.status = (c) => { r.code = c; return r; };
  r.json = (b) => { r.body = clone(b); r.headersSent = true; return r; };
  return r;
}

async function call(handler, body, options) {
  const { token = 'tok-alice', method = 'POST', query = {}, headers } = options || {};
  const res = fakeRes();
  const h = headers || (token ? { authorization: 'Bearer ' + token } : {});
  await handler({ method, headers: h, body, query }, res);
  return res;
}

async function begin(seed) {
  currentDb = makeDb(seed);
  const res = await call(start, { paperId: 'zz-open' });
  return { db: currentDb, res, token: res.body && res.body.sessionToken, attempt: currentDb.attempt('user-alice', 'zz-open') };
}

function seedAttempt(overrides, blocks) {
  const attempt = { id: 'att-seed', user_id: 'user-alice', paper_id: 'zz-open', status: 'in_progress', started_at: iso(-30 * MINUTE), submitted_at: null, end_at: iso(30 * MINUTE), active_session_token: 'sess-1', active_session_claimed_at: iso(-10000), fullscreen_exits: 0, visibility_losses: 0, tab_close_events: 0, heartbeat_gaps: 0, extension_blocks_used: 0, extension_penalty: 0, reached_final_page: false, ...overrides };
  const blockRows = (blocks || [['a1', 'active'], ['a2', 'active'], ['b1', 'active']]).map(([blockId, status, answer], i) => ({ id: 'seed-blk-' + i, attempt_id: attempt.id, block_id: blockId, status, answer: answer || {}, locked_at: null, updated_at: iso(-MINUTE) }));
  return { bioclash_attempts: [attempt], bioclash_attempt_blocks: blockRows };
}

const LEAK_KEYS = ['correctKey', 'correctValue', 'expected', 'tolerance', 'private:'];
const leaks = (body) => LEAK_KEYS.filter((k) => JSON.stringify(body).includes(k));

console.log('--- shared request checks ---');
{
  const handlers = { start, state, saveDraft, lockBlock, extension, submit, heartbeat };
  let all405 = true;
  let all401 = true;
  let allBadToken = true;
  for (const h of Object.values(handlers)) {
    currentDb = makeDb();
    if ((await call(h, {}, { method: 'GET' })).code !== 405) all405 = false;
    const noAuth = await call(h, { paperId: 'zz-open' }, { token: null });
    if (noAuth.code !== 401) all401 = false;
    const bad = await call(h, { paperId: 'zz-open' }, { token: 'tok-nobody' });
    if (bad.code !== 401 || currentDb.log.length !== 0) allBadToken = false;
  }
  check('every attempt handler refuses a non-POST method with 405', all405);
  check('every attempt handler refuses a missing bearer token with 401', all401);
  check('every attempt handler refuses an unknown token with 401 before touching a table', allBadToken);

  currentDb = makeDb();
  currentDb.rateCount = 31;
  let res = await call(saveDraft, { paperId: 'zz-open', blockId: 'a1', componentAnswers: {}, sessionToken: 'x' });
  check('save-draft is rate limited above 30 per window with 429', res.code === 429 && currentDb.rpcCalls[0].args.p_key === 'user-alice:save-draft' && currentDb.rpcCalls[0].args.p_window_ms === 60000);
  currentDb = makeDb();
  currentDb.rateCount = 6;
  res = await call(start, { paperId: 'zz-open' });
  check('start-attempt is rate limited above 5 per window', res.code === 429 && currentDb.tables.bioclash_attempts.length === 0);

  currentDb = makeDb();
  res = await call(start, { paperId: 'does-not-exist' });
  check('an unknown paper id is a 400', res.code === 400 && res.body.error === 'Unknown paper');
  res = await call(start, { paperId: ['zz-open'] });
  check('an array paper id is refused, not coerced to a string', res.code === 400);
  res = await call(start, { paperId: '../zz-open' });
  check('a path-like paper id is refused', res.code === 400);
}

console.log('\n--- start-attempt ---');
{
  const { db, res, token, attempt } = await begin();
  check('a first start creates the attempt and returns 200', res.code === 200 && !!attempt && attempt.status === 'in_progress');
  check('the session token is returned and stored on the attempt', typeof token === 'string' && token.length > 10 && attempt.active_session_token === token);
  const endMs = new Date(attempt.end_at).getTime();
  check('the end time is the paper duration from now', Math.abs(endMs - (Date.now() + 60 * MINUTE)) < 5000);
  const rowIds = db.tables.bioclash_attempt_blocks.map((b) => b.block_id).sort();
  check('only ungated blocks get rows (gated blocks and gated parts do not)', JSON.stringify(rowIds) === JSON.stringify(['a1', 'a2', 'b1']));
  check('the response lists the same blocks', JSON.stringify(res.body.blocks.map((b) => b.id).sort()) === JSON.stringify(['a1', 'a2', 'b1']));
  check('no answer key, tolerance or private figure path reaches the client', leaks(res.body).length === 0);
  const a1 = res.body.blocks.find((b) => b.id === 'a1');
  const m1 = a1.components.find((c) => c.key === 'm1');
  check('mcq options are sent without their correctness', m1.options.length === 4 && m1.options.every((o) => Object.keys(o).sort().join() === 'key,text'));
  const a2 = res.body.blocks.find((b) => b.id === 'a2');
  check('a private figure is replaced by a signed URL and a public one is kept', a2.images[0].src.startsWith('https://signed.example/figs/zz-a2.png') && a2.images[1].src === '/public/zz-plain.png' && db.signed[0].bucket === 'bioclash-figures');
  check('totalPages, watermark and extension settings are reported', res.body.totalPages === 4 && /^[0-9a-f]{16}$/.test(res.body.watermark) && res.body.maxExtensionBlocks === 2 && res.body.extensionBlockMinutes === 15);

  const again = await call(start, { paperId: 'zz-open' });
  const row = db.attempt('user-alice', 'zz-open');
  check('starting again resumes the same attempt with a new session token', again.code === 200 && again.body.attemptId === attempt.id && again.body.sessionToken !== token && row.active_session_token === again.body.sessionToken);
  check('resuming does not create a second attempt or duplicate blocks', db.tables.bioclash_attempts.length === 1 && db.tables.bioclash_attempt_blocks.length === 3);
  const mOptsAgain = again.body.blocks.find((b) => b.id === 'a1').components.find((c) => c.key === 'm1').options.map((o) => o.key).join();
  check('the option order is stable for the same user', mOptsAgain === m1.options.map((o) => o.key).join());
}
{
  currentDb = makeDb(seedAttempt({ status: 'submitted', submitted_at: iso(-MINUTE) }));
  const res = await call(start, { paperId: 'zz-open' });
  check('a submitted paper cannot be started again', res.code === 403 && currentDb.attempt('user-alice', 'zz-open').status === 'submitted');
}
{
  currentDb = makeDb();
  let res = await call(start, { paperId: 'zz-allow' });
  check('an allowlist paper refuses a user without access', res.code === 403 && currentDb.tables.bioclash_attempts.length === 0);
  currentDb = makeDb({ bioclash_paper_access: [{ id: 'acc-1', paper_id: 'zz-allow', user_id: 'user-alice' }] });
  res = await call(start, { paperId: 'zz-allow' });
  check('an allowlist paper admits a user with access', res.code === 200);
  res = await call(start, { paperId: 'zz-allow' }, { token: 'tok-bob' });
  check('access for one user does not admit another', res.code === 403);
}
{
  currentDb = makeDb();
  let res = await call(start, { paperId: 'zz-future' });
  check('a round that has not opened refuses a new attempt', res.code === 403 && /not opened/.test(res.body.error));
  res = await call(start, { paperId: 'zz-closed' });
  check('a closed round refuses a new attempt', res.code === 403 && /no longer/.test(res.body.error));
  currentDb = makeDb({ bioclash_attempts: [{ id: 'att-old', user_id: 'user-alice', paper_id: 'zz-closed', status: 'in_progress', end_at: iso(30 * MINUTE), active_session_token: 's' }], bioclash_attempt_blocks: [{ id: 'x', attempt_id: 'att-old', block_id: 's1', status: 'active', answer: {} }] });
  res = await call(start, { paperId: 'zz-closed' });
  check('an attempt begun before the round closed can still be resumed', res.code === 200 && res.body.attemptId === 'att-old');
}
{
  const endAt = iso(-5 * MINUTE);
  currentDb = makeDb(seedAttempt({ end_at: endAt }, [['a1', 'active', { m1: 'b', t1: true, n1: '' }], ['a2', 'active'], ['b1', 'active']]));
  const res = await call(start, { paperId: 'zz-open' });
  const row = currentDb.attempt('user-alice', 'zz-open');
  check('expiry: an attempt past its end time is closed when it is resumed', res.code === 200 && res.body.status === 'submitted' && row.status === 'submitted');
  check('expiry: it is stamped with the end time, not the time of the visit', row.submitted_at === endAt);
  check('expiry: auto grading counts a blank numeric answer as wrong and skips written questions', row.auto_score_correct === 2 && row.auto_score_total === 5 && row.auto_marks_earned === 2 && row.auto_marks_total === 7);
}

console.log('\n--- attempt-state ---');
{
  currentDb = makeDb();
  let res = await call(state, { paperId: 'zz-open' });
  check('a user with no attempt is told not_started and nothing is created', res.code === 200 && res.body.status === 'not_started' && res.body.attemptId === null && currentDb.tables.bioclash_attempts.length === 0);
  currentDb = makeDb();
  res = await call(state, { paperId: 'zz-allow' });
  check('attempt-state applies the allowlist too', res.code === 403);
}
{
  const { db, token } = await begin();
  const res = await call(state, { paperId: 'zz-open' });
  check('attempt-state returns the attempt with a fresh session token', res.code === 200 && res.body.status === 'in_progress' && res.body.sessionToken !== token && db.attempt('user-alice', 'zz-open').active_session_token === res.body.sessionToken);
  check('attempt-state does not leak the answer key either', leaks(res.body).length === 0);
}
{
  const endAt = iso(-MINUTE);
  currentDb = makeDb(seedAttempt({ end_at: endAt }));
  const res = await call(state, { paperId: 'zz-open' });
  check('attempt-state also closes an expired attempt', res.body.status === 'submitted' && currentDb.attempt('user-alice', 'zz-open').submitted_at === endAt);
}

console.log('\n--- superseded session ---');
{
  const { db, token: first } = await begin();
  const other = await call(state, { paperId: 'zz-open' });
  const second = other.body.sessionToken;
  let res = await call(saveDraft, { paperId: 'zz-open', blockId: 'a1', componentAnswers: { m1: 'a' }, sessionToken: first });
  check('the first tab is refused after a second tab takes over', res.code === 409 && res.body.reason === 'superseded');
  check('the refused save stores nothing', JSON.stringify(db.block(db.attempt('user-alice', 'zz-open').id, 'a1').answer) === '{}');
  res = await call(saveDraft, { paperId: 'zz-open', blockId: 'a1', componentAnswers: { m1: 'a' }, sessionToken: second });
  check('the tab holding the current token can save', res.code === 200);
  res = await call(saveDraft, { paperId: 'zz-open', blockId: 'a1', componentAnswers: { m1: 'a' } });
  check('a save with no session token is refused as superseded', res.code === 409 && res.body.reason === 'superseded');
  res = await call(lockBlock, { paperId: 'zz-open', blockId: 'b1', componentAnswers: { c1: 'a' }, sessionToken: first });
  check('lock-block refuses a superseded token and leaves the block active', res.code === 409 && res.body.reason === 'superseded' && db.block(db.attempt('user-alice', 'zz-open').id, 'b1').status === 'active');
  res = await call(extension, { paperId: 'zz-open', sessionToken: first });
  check('request-extension refuses a superseded token', res.code === 409 && res.body.reason === 'superseded' && db.attempt('user-alice', 'zz-open').extension_blocks_used === 0);
  res = await call(heartbeat, { paperId: 'zz-open', sessionToken: first });
  check('heartbeat tells the old tab it was superseded', res.code === 409 && res.body.reason === 'superseded');
}

console.log('\n--- save-draft ---');
{
  const { db, token, attempt } = await begin();
  let res = await call(saveDraft, { paperId: 'zz-open', blockId: 'a1', componentAnswers: { m1: 'b', t1: false, n1: 3.5, w1: 'Synthetic answer', evil: 'x' }, sessionToken: token });
  const stored = db.block(attempt.id, 'a1').answer;
  check('a valid draft is saved', res.code === 200 && res.body.ok === true && stored.m1 === 'b' && stored.t1 === false && stored.n1 === 3.5 && stored.w1 === 'Synthetic answer');
  check('a key that is not in the block is dropped', !('evil' in stored));
  res = await call(saveDraft, { paperId: 'zz-open', blockId: 'zz', componentAnswers: {}, sessionToken: token });
  check('an unknown block is a 400', res.code === 400 && res.body.error === 'Unknown block');
  res = await call(saveDraft, { paperId: 'zz-open', blockId: 'b1', componentAnswers: { c1: 'a' }, sessionToken: token });
  check('a lock-after-submit block cannot be draft-saved', res.code === 400 && db.block(attempt.id, 'b1').status === 'active' && JSON.stringify(db.block(attempt.id, 'b1').answer) === '{}');
  res = await call(saveDraft, { paperId: 'zz-open', blockId: 'f1', componentAnswers: { fw: 'early' }, sessionToken: token });
  check('a block that has not been revealed cannot be saved', res.code === 409 && res.body.error === 'Block is not currently editable' && !db.block(attempt.id, 'f1'));
}
{
  const { db, token, attempt } = await begin();
  const before = JSON.stringify(db.block(attempt.id, 'a1').answer);
  const bad = [
    ['oversized: a string over 5000 characters', { w1: 'x'.repeat(5001) }],
    ['oversized: a payload over 50000 characters, even under an unknown key', { m1: 'b', junk: 'y'.repeat(60000) }],
    ['an array instead of an object', ['b']],
    ['a missing object', undefined],
    ['an object as a scalar answer', { m1: { nested: 'b' } }],
    ['an array as a scalar answer', { m1: ['b'] }],
    ['a non-finite number', { n1: Infinity }],
    ['too many sub-answers', { fo: Object.fromEntries(Array.from({ length: 31 }, (_, i) => ['k' + i, 'v'])) }],
    ['a non-string sub-answer', { fo: { a: 5 } }]
  ];
  for (const [label, componentAnswers] of bad) {
    const block = label.includes('sub-answer') ? 'f1' : 'a1';
    const res = await call(saveDraft, { paperId: 'zz-open', blockId: block, componentAnswers, sessionToken: token });
    check('save-draft refuses ' + label + ' with 400', res.code === 400);
  }
  check('none of the refused answers was stored', JSON.stringify(db.block(attempt.id, 'a1').answer) === before);
  const writes = db.log.filter((l) => l.table === 'bioclash_attempt_blocks' && l.op === 'update');
  check('a refused answer never reaches the database', writes.length === 0);
  const res = await call(saveDraft, { paperId: 'zz-open', blockId: 'a1', componentAnswers: { w1: 'x'.repeat(5000) }, sessionToken: token });
  check('an answer of exactly 5000 characters is accepted', res.code === 200 && db.block(attempt.id, 'a1').answer.w1.length === 5000);
}
{
  currentDb = makeDb(seedAttempt({ end_at: iso(-MINUTE) }));
  let res = await call(saveDraft, { paperId: 'zz-open', blockId: 'a1', componentAnswers: { m1: 'a' }, sessionToken: 'sess-1' });
  check('expiry: save-draft refuses once time is up', res.code === 409 && res.body.error === 'Time has expired' && JSON.stringify(currentDb.block('att-seed', 'a1').answer) === '{}');
  currentDb = makeDb(seedAttempt({ status: 'submitted' }));
  res = await call(saveDraft, { paperId: 'zz-open', blockId: 'a1', componentAnswers: { m1: 'a' }, sessionToken: 'sess-1' });
  check('save-draft refuses a submitted attempt', res.code === 409 && res.body.error === 'No active attempt');
  currentDb = makeDb();
  res = await call(saveDraft, { paperId: 'zz-open', blockId: 'a1', componentAnswers: { m1: 'a' }, sessionToken: 'sess-1' });
  check('save-draft refuses when there is no attempt', res.code === 409);
  currentDb = makeDb(seedAttempt({}, [['a1', 'locked', { m1: 'c' }]]));
  res = await call(saveDraft, { paperId: 'zz-open', blockId: 'a1', componentAnswers: { m1: 'a' }, sessionToken: 'sess-1' });
  check('a block that is no longer active is not overwritten', res.code === 409 && currentDb.block('att-seed', 'a1').answer.m1 === 'c');
  currentDb = makeDb(seedAttempt());
  res = await call(saveDraft, { paperId: 'zz-open', blockId: 'a1', componentAnswers: { m1: 'a' }, sessionToken: 'sess-1' }, { token: 'tok-bob' });
  check('another user cannot save into this attempt', res.code === 409 && JSON.stringify(currentDb.block('att-seed', 'a1').answer) === '{}');
}

console.log('\n--- anti-cheat counters ---');
{
  currentDb = makeDb(seedAttempt({ fullscreen_exits: 9, visibility_losses: 7 }));
  const body = (fe, vl) => ({ paperId: 'zz-open', blockId: 'a1', componentAnswers: { m1: 'a' }, sessionToken: 'sess-1', fullscreenExits: fe, visibilityLosses: vl });
  await call(saveDraft, body(0, 0));
  let row = currentDb.attempt('user-alice', 'zz-open');
  check('a lowered counter does not lower the stored value', row.fullscreen_exits === 9 && row.visibility_losses === 7);
  await call(saveDraft, body(12, 3));
  row = currentDb.attempt('user-alice', 'zz-open');
  check('a higher counter raises the stored value, column by column', row.fullscreen_exits === 12 && row.visibility_losses === 7);
  await call(saveDraft, body(-5, 'lots'));
  await call(saveDraft, body(NaN, null));
  row = currentDb.attempt('user-alice', 'zz-open');
  check('negative, non-numeric and missing counters are ignored', row.fullscreen_exits === 12 && row.visibility_losses === 7);
  await call(saveDraft, body(1e12, 8.9));
  row = currentDb.attempt('user-alice', 'zz-open');
  check('counters are floored and capped at 100000', row.fullscreen_exits === 100000 && row.visibility_losses === 8);
  currentDb = makeDb(seedAttempt({ fullscreen_exits: 4, visibility_losses: 4 }));
  await call(lockBlock, { paperId: 'zz-open', blockId: 'b1', componentAnswers: { c1: 'a' }, sessionToken: 'sess-1', fullscreenExits: 0, visibilityLosses: 6 });
  row = currentDb.attempt('user-alice', 'zz-open');
  check('lock-block also never lowers a counter', row.fullscreen_exits === 4 && row.visibility_losses === 6);
}

console.log('\n--- lock-block and reveal ---');
{
  const { db, token, attempt } = await begin();
  let res = await call(lockBlock, { paperId: 'zz-open', blockId: 'a1', componentAnswers: {}, sessionToken: token });
  check('a recoverable block cannot be locked', res.code === 400 && db.block(attempt.id, 'a1').status === 'active');
  res = await call(lockBlock, { paperId: 'zz-open', blockId: 'b1', componentAnswers: { c1: 'a', extra: 'z' }, sessionToken: token });
  const b1 = db.block(attempt.id, 'b1');
  check('locking b1 locks it with the cleaned answer', res.code === 200 && res.body.locked === 'b1' && b1.status === 'locked' && !!b1.locked_at && JSON.stringify(b1.answer) === '{"c1":"a"}');
  check('locking b1 reveals exactly the blocks it names', JSON.stringify(res.body.revealedBlocks.map((b) => b.id)) === JSON.stringify(['r1', 'b2']));
  const r1 = res.body.revealedBlocks.find((b) => b.id === 'r1');
  check('revealed content is sent with its text', r1.type === 'reveal_content' && r1.content === 'Synthetic revealed content' && r1.status === 'active');
  const b2 = res.body.revealedBlocks.find((b) => b.id === 'b2');
  check('a revealed question has a signed figure and no answer key', b2.components[0].imageRef.startsWith('https://signed.example/figs/zz-b2.png') && leaks(res.body).length === 0);
  check('revealed blocks get rows in the database', !!db.block(attempt.id, 'r1') && !!db.block(attempt.id, 'b2') && !db.block(attempt.id, 'f1'));

  res = await call(lockBlock, { paperId: 'zz-open', blockId: 'b1', componentAnswers: { c1: 'b' }, sessionToken: token });
  check('locking the same block twice is refused and the first answer stays', res.code === 409 && db.block(attempt.id, 'b1').answer.c1 === 'a');

  res = await call(lockBlock, { paperId: 'zz-open', blockId: 'b2', componentAnswers: { c2: '5.2' }, sessionToken: token });
  check('locking b2 reveals the whole gated part', res.code === 200 && JSON.stringify(res.body.revealedBlocks.map((b) => b.id)) === JSON.stringify(['f1']) && !!db.block(attempt.id, 'f1'));
  res = await call(saveDraft, { paperId: 'zz-open', blockId: 'f1', componentAnswers: { fw: 'Synthetic text', fo: { a: 'because', c: 'since' } }, sessionToken: token });
  check('a block revealed by part can then be draft-saved, including nested answers', res.code === 200 && db.block(attempt.id, 'f1').answer.fo.c === 'since');

  const oversized = await call(lockBlock, { paperId: 'zz-open', blockId: 'b2', componentAnswers: { c2: 'z'.repeat(5001) }, sessionToken: token });
  check('lock-block refuses an oversized answer with 400', oversized.code === 400);
}
{
  currentDb = makeDb(seedAttempt({}, [['b1', 'active'], ['b2', 'locked', { c2: '5' }]]));
  const res = await call(lockBlock, { paperId: 'zz-open', blockId: 'b1', componentAnswers: { c1: 'a' }, sessionToken: 'sess-1' });
  const revealedB2 = res.body.revealedBlocks.find((b) => b.id === 'b2');
  check('a reveal never reopens a block that already exists', res.code === 200 && currentDb.block('att-seed', 'b2').status === 'locked' && revealedB2.status === 'locked' && revealedB2.answer.c2 === '5');
}
{
  currentDb = makeDb(seedAttempt({ end_at: iso(-1000) }));
  const res = await call(lockBlock, { paperId: 'zz-open', blockId: 'b1', componentAnswers: { c1: 'a' }, sessionToken: 'sess-1' });
  check('expiry: lock-block refuses once time is up', res.code === 409 && res.body.error === 'Time has expired' && currentDb.block('att-seed', 'b1').status === 'active');
}

console.log('\n--- request-extension ---');
{
  const { db, token, attempt } = await begin();
  const end0 = new Date(attempt.end_at).getTime();
  let res = await call(extension, { paperId: 'zz-open', sessionToken: token });
  let row = db.attempt('user-alice', 'zz-open');
  check('an extension moves the end time by one block', res.code === 200 && new Date(row.end_at).getTime() === end0 + 15 * MINUTE && res.body.endAt === row.end_at);
  check('the first extension costs the first schedule step', row.extension_blocks_used === 1 && row.extension_penalty === 0.05 && res.body.extensionPenalty === 0.05);
  res = await call(extension, { paperId: 'zz-open', sessionToken: token });
  row = db.attempt('user-alice', 'zz-open');
  check('the second extension costs the sum of the first two steps', res.code === 200 && row.extension_blocks_used === 2 && Math.abs(row.extension_penalty - 0.15) < 1e-9 && new Date(row.end_at).getTime() === end0 + 30 * MINUTE);
  res = await call(extension, { paperId: 'zz-open', sessionToken: token });
  check('no extension is granted past the maximum', res.code === 409 && db.attempt('user-alice', 'zz-open').extension_blocks_used === 2);
}
{
  const { db, token } = await begin();
  db.hooks.beforeUpdate = (table, patch) => {
    if (table === 'bioclash_attempts' && 'extension_blocks_used' in patch) {
      db.attempt('user-alice', 'zz-open').extension_blocks_used = 1;
      db.hooks.beforeUpdate = null;
    }
  };
  const res = await call(extension, { paperId: 'zz-open', sessionToken: token });
  check('two extension requests racing grant only one', res.code === 409 && db.attempt('user-alice', 'zz-open').extension_blocks_used === 1);
}
{
  currentDb = makeDb({ bioclash_attempts: [{ id: 'a', user_id: 'user-alice', paper_id: 'zz-noext', status: 'in_progress', end_at: iso(MINUTE), active_session_token: 's', extension_blocks_used: 0 }] });
  let res = await call(extension, { paperId: 'zz-noext', sessionToken: 's' });
  check('a paper without the mechanic refuses extensions', res.code === 400 && currentDb.log.length === 0);
  currentDb = makeDb(seedAttempt({ end_at: iso(-1000) }));
  res = await call(extension, { paperId: 'zz-open', sessionToken: 'sess-1' });
  check('expiry: an extension cannot revive an expired attempt', res.code === 409 && res.body.error === 'Time has expired' && currentDb.attempt('user-alice', 'zz-open').extension_blocks_used === 0);
  currentDb = makeDb(seedAttempt({ status: 'submitted' }));
  res = await call(extension, { paperId: 'zz-open', sessionToken: 'sess-1' });
  check('a submitted attempt cannot be extended', res.code === 409);
}

console.log('\n--- heartbeat ---');
{
  currentDb = makeDb(seedAttempt());
  let res = await call(heartbeat, { paperId: 'zz-open' });
  check('heartbeat needs paperId and sessionToken', res.code === 400);
  res = await call(heartbeat, { paperId: 'zz-open', sessionToken: 'sess-1', reachedFinalPage: 'yes' });
  check('heartbeat only accepts reachedFinalPage === true', res.code === 200 && res.body.active === true && currentDb.attempt('user-alice', 'zz-open').reached_final_page === false);
  res = await call(heartbeat, { paperId: 'zz-open', sessionToken: 'sess-1', reachedFinalPage: true });
  check('heartbeat records reaching the final page', res.code === 200 && currentDb.attempt('user-alice', 'zz-open').reached_final_page === true);
  check('a heartbeat within a minute is not a gap', currentDb.attempt('user-alice', 'zz-open').heartbeat_gaps === 0);
  currentDb.attempt('user-alice', 'zz-open').active_session_claimed_at = iso(-2 * MINUTE);
  await call(heartbeat, { paperId: 'zz-open', sessionToken: 'sess-1' });
  check('a heartbeat after more than a minute counts one gap', currentDb.attempt('user-alice', 'zz-open').heartbeat_gaps === 1);
  res = await call(heartbeat, { paperId: 'zz-open', sessionToken: 'sess-1', event: 'tab_close' });
  check('a tab close from the active session is logged', res.body.logged === true && currentDb.attempt('user-alice', 'zz-open').tab_close_events === 1);
  res = await call(heartbeat, { paperId: 'zz-open', sessionToken: 'other', event: 'tab_close' });
  check('a tab close from another session is ignored', res.body.logged === false && currentDb.attempt('user-alice', 'zz-open').tab_close_events === 1);
  currentDb = makeDb(seedAttempt({ status: 'submitted' }));
  res = await call(heartbeat, { paperId: 'zz-open', sessionToken: 'sess-1' });
  check('heartbeat reports inactive for a submitted attempt without writing', res.code === 200 && res.body.active === false && !currentDb.log.some((l) => l.op === 'update'));
}

console.log('\n--- submit-attempt ---');
{
  const { db, token, attempt } = await begin();
  let res = await call(submit, { paperId: 'zz-open' });
  check('submit before reaching the last page is refused with the page count', res.code === 403 && res.body.error.includes('page 4 of 4') && db.attempt('user-alice', 'zz-open').status === 'in_progress');
  await call(saveDraft, { paperId: 'zz-open', blockId: 'a1', componentAnswers: { m1: 'b', t1: true, n1: '', w1: 'Synthetic' }, sessionToken: token });
  await call(saveDraft, { paperId: 'zz-open', blockId: 'a2', componentAnswers: { m2: 'a' }, sessionToken: token });
  await call(lockBlock, { paperId: 'zz-open', blockId: 'b1', componentAnswers: { c1: 'a' }, sessionToken: token });
  await call(lockBlock, { paperId: 'zz-open', blockId: 'b2', componentAnswers: { c2: '5.2' }, sessionToken: token });
  await call(heartbeat, { paperId: 'zz-open', sessionToken: token, reachedFinalPage: true });
  res = await call(submit, { paperId: 'zz-open' });
  const row = db.attempt('user-alice', 'zz-open');
  check('submit after the last page closes the attempt', res.code === 200 && row.status === 'submitted' && !!row.submitted_at);
  check('the partial score counts mcq, true/false and numeric only, and a blank numeric near 0 is wrong', res.body.autoScoreCorrect === 4 && res.body.autoScoreTotal === 6 && row.auto_marks_earned === 6 && row.auto_marks_total === 9);
  check('the submit response does not reveal the answer key', leaks(res.body).length === 0);
  res = await call(submit, { paperId: 'zz-open' });
  check('a second submit is refused', res.code === 409);
  res = await call(saveDraft, { paperId: 'zz-open', blockId: 'a1', componentAnswers: { m1: 'a' }, sessionToken: token });
  check('no draft can be saved after submitting', res.code === 409 && db.block(attempt.id, 'a1').answer.m1 === 'b');
  res = await call(lockBlock, { paperId: 'zz-open', blockId: 'b1', componentAnswers: { c1: 'b' }, sessionToken: token });
  check('no block can be locked after submitting', res.code === 409);
}
{
  currentDb = makeDb(seedAttempt({ end_at: iso(-1000) }));
  const res = await call(submit, { paperId: 'zz-open' });
  check('expiry: an expired attempt can be submitted without reaching the last page', res.code === 200 && currentDb.attempt('user-alice', 'zz-open').status === 'submitted');
}
{
  currentDb = makeDb(seedAttempt({ reached_final_page: true }));
  const res = await call(submit, { paperId: 'zz-open' }, { token: 'tok-bob' });
  check('one user cannot submit another user\'s attempt', res.code === 409 && currentDb.attempt('user-alice', 'zz-open').status === 'in_progress');
}
{
  currentDb = makeDb(seedAttempt({ reached_final_page: true }));
  currentDb.fail['bioclash_attempt_blocks:select'] = 'db down';
  const res = await call(submit, { paperId: 'zz-open' });
  check('a database error is a generic 500 that does not echo the cause', res.code === 500 && !JSON.stringify(res.body).includes('db down') && currentDb.attempt('user-alice', 'zz-open').status === 'in_progress');
}

console.log('\n--- bioclash-admin ---');
const savedCron = process.env.CRON_SECRET;
const savedAdmin = process.env.BIOCLASH_ADMIN_SECRET;
const cron = { authorization: 'Bearer cron-secret' };
const adm = { authorization: 'Bearer admin-secret' };
{
  delete process.env.CRON_SECRET;
  delete process.env.BIOCLASH_ADMIN_SECRET;
  currentDb = makeDb();
  let res = await call(adminHandler, { action: 'cleanup' }, { headers: cron });
  check('admin refuses with 500 when the cron secret is not configured', res.code === 500 && res.body.ok === false);
  process.env.CRON_SECRET = 'cron-secret';
  process.env.BIOCLASH_ADMIN_SECRET = 'admin-secret';
  res = await call(adminHandler, { action: 'cleanup' }, { headers: { authorization: 'Bearer nope' } });
  check('admin refuses a wrong secret with 401', res.code === 401);
  res = await call(adminHandler, { action: 'export-grades', paperId: 'zz-open' }, { headers: cron });
  check('the cron secret does not open export-grades', res.code === 401);
  res = await call(adminHandler, { action: 'finalize-round', paperId: 'zz-open', seasonYear: 2026, seasonWeight: 1 }, { headers: cron });
  check('the cron secret does not open finalize-round', res.code === 401);
  res = await call(adminHandler, { action: 'cleanup' }, { headers: adm });
  check('the admin secret does not open cleanup', res.code === 401);
  res = await call(adminHandler, {}, { method: 'PUT', headers: adm });
  check('admin refuses other methods with 405', res.code === 405);
  res = await call(adminHandler, { action: 'nothing' }, { headers: adm });
  check('an unknown action is a 400', res.code === 400);
  check('no admin table was touched by a refused call', currentDb.log.length === 0);
}
{
  const attempt = (id, user, overrides) => ({ id, user_id: user, paper_id: 'zz-open', status: 'in_progress', started_at: iso(-90 * MINUTE), end_at: iso(-MINUTE), extension_blocks_used: 0, ...overrides });
  currentDb = makeDb({
    bioclash_attempts: [
      attempt('stale', 'user-alice'),
      attempt('live', 'user-bob', { end_at: iso(10 * MINUTE) }),
      attempt('done', 'user-carol', { status: 'submitted', submitted_at: iso(-50 * MINUTE) }),
      attempt('gone', 'user-dave', { paper_id: 'zz-missing' })
    ],
    bioclash_attempt_blocks: [{ id: 'k1', attempt_id: 'stale', block_id: 'a1', status: 'active', answer: { m1: 'b', n1: '0.005' } }]
  });
  const staleEnd = currentDb.tables.bioclash_attempts[0].end_at;
  const res = await call(adminHandler, { action: 'cleanup' }, { headers: cron });
  const byId = Object.fromEntries(currentDb.tables.bioclash_attempts.map((a) => [a.id, a]));
  check('cleanup closes expired attempts and reports counts', res.code === 200 && res.body.found === 2 && res.body.submitted === 1);
  check('cleanup stamps the end time and grades the answers', byId.stale.status === 'submitted' && byId.stale.submitted_at === staleEnd && byId.stale.auto_score_correct === 2 && byId.stale.auto_marks_earned === 3);
  check('cleanup leaves running and submitted attempts alone', byId.live.status === 'in_progress' && byId.done.submitted_at !== staleEnd);
  check('cleanup skips an attempt whose paper cannot be loaded', byId.gone.status === 'in_progress');
  const viaGet = await call(adminHandler, undefined, { method: 'GET', query: { action: 'cleanup' }, headers: cron });
  check('cleanup also runs from a GET with the action in the query', viaGet.code === 200 && viaGet.body.found === 1);
}
const gradedSeed = () => ({
  bioclash_attempts: [
    { id: 'g1', user_id: 'user-alice', paper_id: 'zz-open', status: 'submitted', started_at: iso(-90 * MINUTE), submitted_at: iso(-30 * MINUTE), extension_blocks_used: 0 },
    { id: 'g2', user_id: 'user-bob', paper_id: 'zz-open', status: 'submitted', started_at: iso(-90 * MINUTE), submitted_at: iso(-20 * MINUTE), extension_blocks_used: 1 },
    { id: 'g3', user_id: 'user-carol', paper_id: 'zz-open', status: 'in_progress', end_at: iso(MINUTE), extension_blocks_used: 0 }
  ],
  bioclash_attempt_blocks: [
    { id: 'x1', attempt_id: 'g1', block_id: 'a1', status: 'active', answer: { m1: 'b', t1: true, n1: '', w1: 'Synthetic' } },
    { id: 'x2', attempt_id: 'g1', block_id: 'b1', status: 'locked', answer: { c1: 'a' } },
    { id: 'x3', attempt_id: 'g2', block_id: 'a1', status: 'active', answer: { m1: 'a', t1: true } },
    { id: 'x4', attempt_id: 'g3', block_id: 'a1', status: 'active', answer: { m1: 'b' } }
  ],
  profiles: [{ id: 'user-alice', display_name: 'Alice Synthetic' }, { id: 'user-bob', display_name: 'Bob Synthetic' }]
});
{
  currentDb = makeDb(gradedSeed());
  let res = await call(adminHandler, { action: 'export-grades', paperId: 'zz-open' }, { headers: adm });
  check('export-grades lists submitted attempts only', res.code === 200 && res.body.participants.length === 2 && res.body.totalMarks === 20);
  const alice = res.body.participants.find((p) => p.userId === 'user-alice');
  const comp = (key) => alice.components.find((c) => c.key === key);
  check('export-grades carries display names', alice.displayName === 'Alice Synthetic');
  check('export-grades marks auto-graded answers with the key', comp('m1').autoGraded && comp('m1').marksAwarded === 1 && comp('m1').correct === 'b');
  check('export-grades gives a blank numeric answer near 0 no marks', comp('n1').autoGraded && comp('n1').marksAwarded === 0 && comp('n1').submitted === '');
  check('export-grades leaves written answers for a human', comp('w1').autoGraded === false && comp('w1').marksAwarded === null && comp('fw').submitted === null);
  check('export-grades sizes a free-text-for-others component by the options it refers to', comp('fo').marks === 3 && comp('fo').autoGraded === false);
  check('export-grades totals match the per-component marks', alice.autoMarksEarned === 4 && alice.autoMarksTotal === 9);
  res = await call(adminHandler, undefined, { method: 'GET', query: { action: 'export-grades', paperId: 'zz-open' }, headers: adm });
  check('export-grades also works as a GET', res.code === 200 && res.body.participants.length === 2);
  res = await call(adminHandler, { action: 'export-grades', paperId: 'nope' }, { headers: adm });
  check('export-grades refuses an unknown paper', res.code === 400);
  currentDb = makeDb();
  res = await call(adminHandler, { action: 'export-grades', paperId: 'zz-open' }, { headers: adm });
  check('export-grades with no submissions returns an empty list', res.code === 200 && res.body.participants.length === 0);
}
{
  currentDb = makeDb(gradedSeed());
  let res = await call(adminHandler, { action: 'finalize-round', paperId: 'zz-open' }, { headers: adm });
  check('finalize-round requires seasonYear and seasonWeight', res.code === 400);
  const manualGrades = { g1: { w1: 2, fw: 99 }, g2: { w1: 'x' } };
  res = await call(adminHandler, { action: 'finalize-round', paperId: 'zz-open', seasonYear: 2026, seasonWeight: 0.5, dryRun: true, manualGrades }, { headers: adm });
  const [first, second] = res.body.results || [];
  check('a dry run returns placements without writing results', res.code === 200 && res.body.dryRun === true && !currentDb.rpcCalls.some((c) => c.name === 'bioclash_replace_round_results'));
  check('manual marks within range are added and out-of-range or non-numeric ones are ignored', first.userId === 'user-alice' && first.autoMarks === 4 && first.manualMarks === 2 && first.rawScore === 6 && second.manualMarks === 0);
  check('the extension penalty scales the score', second.userId === 'user-bob' && second.rawScore === 1 && Math.abs(second.penalizedScore - 0.95) < 1e-9 && second.extensionPenalty === 0.05);
  check('z-scores and placements follow the penalised score', first.placement === 1 && second.placement === 2 && Math.abs(first.zScore - 1) < 1e-9 && Math.abs(second.zScore + 1) < 1e-9);
  res = await call(adminHandler, { action: 'finalize-round', paperId: 'zz-open', seasonYear: 2026, seasonWeight: 0.5, manualGrades }, { headers: adm });
  const rpc = currentDb.rpcCalls.find((c) => c.name === 'bioclash_replace_round_results');
  check('a real run replaces the round results in one RPC call', res.code === 200 && res.body.inserted === 2 && !!rpc && rpc.args.p_season === '2026:zz-open' && rpc.args.p_rows.length === 2);
  check('each result row carries the season weight, placement and rounded z-score', rpc.args.p_rows[0].season_weight === 0.5 && rpc.args.p_rows[0].placement === 1 && rpc.args.p_rows[0].z_score === 1 && rpc.args.p_rows[0].score_label === '6 / 20');
  currentDb = makeDb(gradedSeed());
  currentDb.fail['rpc:bioclash_replace_round_results'] = 'replace failed';
  res = await call(adminHandler, { action: 'finalize-round', paperId: 'zz-open', seasonYear: 2026, seasonWeight: 1 }, { headers: adm });
  check('a failed replace is a 500 that does not echo the cause', res.code === 500 && !JSON.stringify(res.body).includes('replace failed'));
  currentDb = makeDb({ bioclash_attempts: [{ id: 'solo', user_id: 'user-alice', paper_id: 'zz-open', status: 'submitted', extension_blocks_used: 0 }] });
  res = await call(adminHandler, { action: 'finalize-round', paperId: 'zz-open', seasonYear: 2026, seasonWeight: 1, dryRun: true }, { headers: adm });
  check('a single participant gets a z-score of 0, not NaN', res.code === 200 && res.body.results[0].zScore === 0);
}
console.log('\n--- shared helpers keep the response shapes ---');
{
  const VIEW_KEYS = 'attemptId,status,endAt,fullscreenExits,visibilityLosses,paperTitle,watermark,sessionToken,totalPages,reachedFinalPage,extensionBlocksUsed,maxExtensionBlocks,extensionBlockMinutes,extensionCostSchedule,blocks';
  const STATE_KEYS = 'attemptId,status,startedAt,endAt,submittedAt,fullscreenExits,visibilityLosses,paperTitle,watermark,sessionToken,totalPages,reachedFinalPage,extensionBlocksUsed,maxExtensionBlocks,extensionBlockMinutes,extensionCostSchedule,blocks';
  const { res } = await begin();
  check('start-attempt sends its fields in the same order as before', Object.keys(res.body).join() === VIEW_KEYS);
  const stateRes = await call(state, { paperId: 'zz-open' });
  check('attempt-state sends its fields in the same order as before', Object.keys(stateRes.body).join() === STATE_KEYS && stateRes.body.submittedAt === null);

  currentDb = makeDb();
  let r = await call(start, { paperId: 'zz-allow' });
  check('the allowlist refusal body is unchanged', r.code === 403 && JSON.stringify(r.body) === '{"error":"This paper is not available yet."}');

  const CLOSE_KEYS = 'status,submitted_at,auto_score_correct,auto_score_total,auto_marks_earned,auto_marks_total';
  const endAt = iso(-MINUTE);
  currentDb = makeDb(seedAttempt({ end_at: endAt }));
  await call(start, { paperId: 'zz-open' });
  const close = currentDb.log.filter((e) => e.table === 'bioclash_attempts' && e.op === 'update' && e.payload.status === 'submitted');
  check('the expiry close writes the same columns in the same order, once', close.length === 1 && Object.keys(close[0].payload).join() === CLOSE_KEYS && close[0].payload.submitted_at === endAt);

  currentDb = makeDb(seedAttempt({}));
  r = await call(saveDraft, { paperId: 'zz-open', blockId: 'a1', componentAnswers: {}, sessionToken: 'wrong' });
  check('the superseded body is unchanged', r.code === 409 && JSON.stringify(r.body) === '{"error":"This attempt is now active in another tab or device.","reason":"superseded"}');
  currentDb = makeDb(seedAttempt({ end_at: iso(-MINUTE) }));
  r = await call(extension, { paperId: 'zz-open', sessionToken: 'sess-1' });
  check('the expiry body is unchanged', r.code === 409 && JSON.stringify(r.body) === '{"error":"Time has expired"}');
  currentDb = makeDb();
  r = await call(lockBlock, { paperId: 'zz-open', blockId: 'b1', componentAnswers: {}, sessionToken: 'sess-1' });
  check('the no-attempt body is unchanged', r.code === 409 && JSON.stringify(r.body) === '{"error":"No active attempt"}');
  currentDb = makeDb(seedAttempt({}));
  currentDb.fail['bioclash_attempts:select'] = 'lookup failed';
  r = await call(saveDraft, { paperId: 'zz-open', blockId: 'a1', componentAnswers: {}, sessionToken: 'sess-1' });
  check('a failed attempt lookup is still a 500 that does not echo the cause', r.code === 500 && JSON.stringify(r.body) === '{"error":"Could not save draft"}');
  currentDb = makeDb(seedAttempt({ extension_blocks_used: 2 }));
  r = await call(extension, { paperId: 'zz-open', sessionToken: 'sess-1' });
  check('request-extension still refuses when no extension blocks are left', r.code === 409 && r.body.error === 'No extension blocks remaining for this round.');
}

if (savedCron === undefined) delete process.env.CRON_SECRET; else process.env.CRON_SECRET = savedCron;
if (savedAdmin === undefined) delete process.env.BIOCLASH_ADMIN_SECRET; else process.env.BIOCLASH_ADMIN_SECRET = savedAdmin;

console.error = realConsoleError;
process.chdir(originalCwd);
rmSync(tempRoot, { recursive: true, force: true });

console.log('\n' + (failures === 0 ? 'ALL BIOCLASH HANDLER CHECKS PASSED.' : `${failures} CHECK(S) FAILED.`));
if (failures > 0) process.exit(1);
