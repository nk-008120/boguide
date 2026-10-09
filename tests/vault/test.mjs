import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const REPO_ROOT = path.resolve(__dirname, '../..');

const vault = require(path.join(REPO_ROOT, 'api/_lib/paperVault.js'));
const { loadPaper } = require(path.join(REPO_ROOT, 'api/_lib/bioclash.js'));

let failures = 0;
function check(name, cond) {
  console.log((cond ? 'PASS' : 'FAIL') + ' -- ' + name);
  if (!cond) failures++;
}

function codeOf(fn) {
  try {
    fn();
    return null;
  } catch (err) {
    return err.code || err.name;
  }
}

function flip(b64) {
  const buf = Buffer.from(b64, 'base64');
  buf[0] ^= 0x01;
  return buf.toString('base64');
}

const keyA = vault.generateKey();
const keyB = vault.generateKey();
const ringA = vault.parseKeyring('k1:' + keyA);
const ringB = vault.parseKeyring('k2:' + keyB);
const ringBoth = vault.parseKeyring('k2:' + keyB + ',k1:' + keyA);
const secret = 'id: mb-test\ntitle: "Secret paper"\ncorrectKey: C\n';

console.log('--- keyring parsing ---');

check('generateKey yields 32 bytes of base64', Buffer.from(keyA, 'base64').length === 32);
check('parseKeyring keeps order', ringBoth[0].kid === 'k2' && ringBoth[1].kid === 'k1');
check('empty keyring is rejected', codeOf(() => vault.parseKeyring('')) === 'no_keys');
check('missing separator is rejected', codeOf(() => vault.parseKeyring(keyA)) === 'bad_keyring');
check('short key is rejected', codeOf(() => vault.parseKeyring('k1:' + Buffer.alloc(16).toString('base64'))) === 'bad_keyring');
check('non-base64 key is rejected', codeOf(() => vault.parseKeyring('k1:not base64!')) === 'bad_keyring');
check('duplicate key ids are rejected', codeOf(() => vault.parseKeyring('k1:' + keyA + ',k1:' + keyB)) === 'bad_keyring');

console.log('--- encrypt and decrypt ---');

const envelope = vault.encrypt(secret, 'mb-test', ringA);
check('round trip returns the original text', vault.decrypt(envelope, 'mb-test', ringA).toString('utf8') === secret);
check('envelope does not contain the plaintext', !envelope.includes('Secret paper') && !envelope.includes('correctKey'));
check('envelope records version, algorithm, key id and paper', (() => {
  const meta = vault.inspect(envelope);
  return meta.version === 1 && meta.algorithm === 'aes-256-gcm' && meta.kid === 'k1' && meta.paper === 'mb-test';
})());
check('two encryptions of the same text differ', vault.encrypt(secret, 'mb-test', ringA) !== envelope);
check('wrong key fails authentication', codeOf(() => vault.decrypt(envelope, 'mb-test', vault.parseKeyring('k1:' + keyB))) === 'auth_failed');
check('unknown key id is reported', codeOf(() => vault.decrypt(envelope, 'mb-test', ringB)) === 'unknown_key');
check('decrypting under another paper id is refused', codeOf(() => vault.decrypt(envelope, 'mb-other', ringA)) === 'wrong_paper');
check('invalid paper id is rejected', codeOf(() => vault.encrypt(secret, '../etc', ringA)) === 'bad_paper_id');
check('empty plaintext round trips', vault.decrypt(vault.encrypt('', 'mb-test', ringA), 'mb-test', ringA).length === 0);

console.log('--- tamper resistance ---');

const parsed = JSON.parse(envelope);
function tampered(field, value) {
  return JSON.stringify({ ...parsed, [field]: value });
}
check('flipped ciphertext is rejected', codeOf(() => vault.decrypt(tampered('ct', flip(parsed.ct)), 'mb-test', ringA)) === 'auth_failed');
check('flipped tag is rejected', codeOf(() => vault.decrypt(tampered('tag', flip(parsed.tag)), 'mb-test', ringA)) === 'auth_failed');
check('flipped iv is rejected', codeOf(() => vault.decrypt(tampered('iv', flip(parsed.iv)), 'mb-test', ringA)) === 'auth_failed');
check('flipped salt is rejected', codeOf(() => vault.decrypt(tampered('salt', flip(parsed.salt)), 'mb-test', ringA)) === 'auth_failed');
check('truncated ciphertext is rejected', codeOf(() => vault.decrypt(tampered('ct', parsed.ct.slice(0, 8)), 'mb-test', ringA)) === 'auth_failed');
check('relabelled paper id is rejected', codeOf(() => vault.decrypt(tampered('paper', 'mb-other'), 'mb-other', ringA)) === 'auth_failed');
check('relabelled key id is rejected', codeOf(() => vault.decrypt(tampered('kid', 'k9'), 'mb-test', vault.parseKeyring('k9:' + keyA))) === 'auth_failed');
check('unsupported version is rejected', codeOf(() => vault.decrypt(tampered('v', 2), 'mb-test', ringA)) === 'unsupported_version');
check('unsupported algorithm is rejected', codeOf(() => vault.decrypt(tampered('alg', 'aes-128-cbc'), 'mb-test', ringA)) === 'unsupported_algorithm');
check('garbage input is rejected', codeOf(() => vault.decrypt('not json', 'mb-test', ringA)) === 'bad_envelope');
check('missing fields are rejected', codeOf(() => vault.decrypt(JSON.stringify({ v: 1, alg: 'aes-256-gcm', kid: 'k1', paper: 'mb-test' }), 'mb-test', ringA)) === 'bad_envelope');

console.log('--- key rotation ---');

check('encryption uses the first key in the ring', vault.inspect(vault.encrypt(secret, 'mb-test', ringBoth)).kid === 'k2');
check('an older key still decrypts while it stays in the ring', vault.decrypt(envelope, 'mb-test', ringBoth).toString('utf8') === secret);
const rotated = vault.encrypt(vault.decrypt(envelope, 'mb-test', ringBoth), 'mb-test', ringBoth);
check('re-encrypted file opens with only the new key', vault.decrypt(rotated, 'mb-test', ringB).toString('utf8') === secret);

console.log('--- loader integration ---');

const originalCwd = process.cwd();
const originalKeys = process.env.BIOCLASH_PAPER_KEYS;
const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'vault-test-'));
const dataDir = path.join(sandbox, 'data', 'bioclash');
fs.mkdirSync(dataDir, { recursive: true });
process.chdir(sandbox);

fs.writeFileSync(path.join(dataDir, 'enc-only.yaml.enc'), vault.encrypt('id: enc-only\ntitle: Encrypted\n', 'enc-only', ringA));
process.env.BIOCLASH_PAPER_KEYS = 'k1:' + keyA;
const loaded = loadPaper('enc-only');
check('loader opens an encrypted-only paper', !!loaded && loaded.title === 'Encrypted');

fs.writeFileSync(path.join(dataDir, 'late-key.yaml.enc'), vault.encrypt('id: late-key\ntitle: Late\n', 'late-key', ringA));
delete process.env.BIOCLASH_PAPER_KEYS;
const originalError = console.error;
console.error = () => {};
const withoutKey = loadPaper('late-key');
console.error = originalError;
check('loader returns null when the key is missing', withoutKey === null);
process.env.BIOCLASH_PAPER_KEYS = 'k1:' + keyA;
const afterKey = loadPaper('late-key');
check('a failed load is not cached, so adding the key recovers', !!afterKey && afterKey.title === 'Late');

fs.writeFileSync(path.join(dataDir, 'both.yaml'), 'id: both\ntitle: Plain\n');
fs.writeFileSync(path.join(dataDir, 'both.yaml.enc'), vault.encrypt('id: both\ntitle: Encrypted\n', 'both', ringA));
check('plaintext file wins when both exist', loadPaper('both').title === 'Plain');

fs.writeFileSync(path.join(dataDir, 'tampered.yaml.enc'), tampered('ct', flip(parsed.ct)));
console.error = () => {};
const tamperedLoad = loadPaper('tampered');
console.error = originalError;
check('loader returns null for a tampered file', tamperedLoad === null);
check('loader returns null for an unknown paper', loadPaper('does-not-exist') === null);

process.chdir(originalCwd);
if (originalKeys === undefined) delete process.env.BIOCLASH_PAPER_KEYS;
else process.env.BIOCLASH_PAPER_KEYS = originalKeys;
fs.rmSync(sandbox, { recursive: true, force: true });

console.log('--- plaintext guard ---');

let guardOk = true;
try {
  execFileSync('node', [path.join(REPO_ROOT, 'scripts/bioclash-paper-vault.js'), 'guard'], { cwd: REPO_ROOT, stdio: 'pipe' });
} catch (err) {
  guardOk = false;
}
check('repository tracks no unlisted plaintext papers', guardOk);

if (failures > 0) {
  console.log('\n' + failures + ' check(s) failed');
  process.exit(1);
}
console.log('\nAll checks passed');
