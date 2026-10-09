#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const yaml = require('js-yaml');
const vault = require('../api/_lib/paperVault');

try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });
} catch (e) {
  void e;
}

const REPO_ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(REPO_ROOT, 'data', 'bioclash');
const PUBLIC_PAPERS = ['bioclash-sample'];
const PUBLIC_AFTER_CLOSE_PAPERS = ['mb-01'];

const USAGE = [
  'usage: node scripts/bioclash-paper-vault.js <command> [paperId] [options]',
  '',
  'commands:',
  '  keygen              print a new key line for BIOCLASH_PAPER_KEYS',
  '  encrypt <paperId>   encrypt data/bioclash/<paperId>.yaml into <paperId>.yaml.enc',
  '  decrypt <paperId>   restore data/bioclash/<paperId>.yaml from the vault (--force to overwrite, --out <file> to choose a path)',
  '  rotate <paperId>    re-encrypt with the first key in the keyring',
  '  verify [paperId]    decrypt and parse every vault file without printing contents',
  '  guard               fail if a plaintext paper is tracked by git that is not on the public list'
].join('\n');

function fail(message) {
  console.error('Error: ' + message);
  process.exit(1);
}

function plainPath(paperId) {
  return path.join(DATA_DIR, paperId + '.yaml');
}

function vaultPath(paperId) {
  return plainPath(paperId) + '.enc';
}

function requirePaperId(args) {
  const paperId = args[0];
  if (!paperId || !/^[a-z0-9-]+$/.test(paperId)) fail('give a paper id such as mb-02');
  return paperId;
}

function loadKeyring() {
  try {
    return vault.keyringFromEnv();
  } catch (err) {
    return fail(err.message + '. Run "keygen" and put the line in .env as BIOCLASH_PAPER_KEYS=<line>');
  }
}

function describe(text, paperId) {
  const paper = yaml.load(text);
  if (!paper || typeof paper !== 'object') fail('the paper did not parse as a YAML mapping');
  if (paper.id !== paperId) fail('paper id inside the file is "' + paper.id + '", expected "' + paperId + '"');
  return paper;
}

function cmdKeygen() {
  console.log('k1:' + vault.generateKey());
  console.error('Store this line as BIOCLASH_PAPER_KEYS in Vercel (Production) and in your local .env. Keep a copy in a password manager. Losing it makes every encrypted paper unrecoverable.');
}

function cmdEncrypt(args) {
  const paperId = requirePaperId(args);
  const source = plainPath(paperId);
  if (!fs.existsSync(source)) fail('missing ' + path.relative(REPO_ROOT, source));
  const keyring = loadKeyring();
  const text = fs.readFileSync(source, 'utf8');
  describe(text, paperId);
  const envelope = vault.encrypt(text, paperId, keyring);
  const roundTrip = vault.decrypt(envelope, paperId, keyring).toString('utf8');
  if (roundTrip !== text) fail('round trip check failed, nothing was written');
  fs.writeFileSync(vaultPath(paperId), envelope);
  console.log('Wrote ' + path.relative(REPO_ROOT, vaultPath(paperId)) + ' (key ' + keyring[0].kid + ')');
  console.log('The plaintext stays on this machine only. Commit the .enc file, never the .yaml.');
}

function cmdDecrypt(args) {
  const paperId = requirePaperId(args);
  const force = args.includes('--force');
  const outIndex = args.indexOf('--out');
  const target = outIndex >= 0 ? path.resolve(args[outIndex + 1] || '') : plainPath(paperId);
  if (outIndex >= 0 && !args[outIndex + 1]) fail('--out needs a file path');
  if (!fs.existsSync(vaultPath(paperId))) fail('missing ' + path.relative(REPO_ROOT, vaultPath(paperId)));
  if (fs.existsSync(target) && !force) fail(path.relative(REPO_ROOT, target) + ' already exists (use --force to overwrite)');
  const text = vault.decrypt(fs.readFileSync(vaultPath(paperId), 'utf8'), paperId, loadKeyring());
  fs.writeFileSync(target, text);
  console.log('Wrote ' + path.relative(REPO_ROOT, target));
}

function cmdRotate(args) {
  const paperId = requirePaperId(args);
  if (!fs.existsSync(vaultPath(paperId))) fail('missing ' + path.relative(REPO_ROOT, vaultPath(paperId)));
  const keyring = loadKeyring();
  const current = vault.inspect(fs.readFileSync(vaultPath(paperId), 'utf8'));
  const text = vault.decrypt(fs.readFileSync(vaultPath(paperId), 'utf8'), paperId, keyring);
  const envelope = vault.encrypt(text, paperId, keyring);
  fs.writeFileSync(vaultPath(paperId), envelope);
  console.log(paperId + ': re-encrypted from key ' + current.kid + ' to key ' + keyring[0].kid);
}

function vaultPaperIds() {
  return fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.yaml.enc')).map((f) => f.replace(/\.yaml\.enc$/, ''));
}

function cmdVerify(args) {
  const ids = args[0] ? [requirePaperId(args)] : vaultPaperIds();
  if (!ids.length) {
    console.log('No encrypted papers found.');
    return;
  }
  const keyring = loadKeyring();
  let bad = 0;
  ids.forEach((paperId) => {
    try {
      const text = fs.readFileSync(vaultPath(paperId), 'utf8');
      const meta = vault.inspect(text);
      const paper = yaml.load(vault.decrypt(text, paperId, keyring).toString('utf8'));
      if (!paper || paper.id !== paperId) throw new vault.VaultError('bad_paper', 'paper id inside the file does not match');
      console.log('OK   ' + paperId + ' (key ' + meta.kid + (meta.kid === keyring[0].kid ? ', current' : ', older') + ')');
    } catch (err) {
      bad++;
      console.log('FAIL ' + paperId + ' (' + (err.code || err.message) + ')');
    }
  });
  if (bad) process.exit(1);
}

function cmdGuard() {
  let tracked;
  try {
    tracked = execFileSync('git', ['ls-files', '--cached', '--', 'data/bioclash'], { cwd: REPO_ROOT, encoding: 'utf8' })
      .split('\n').map((s) => s.trim()).filter(Boolean);
  } catch (err) {
    return fail('could not list tracked files with git');
  }
  const allowed = new Set(PUBLIC_PAPERS.concat(PUBLIC_AFTER_CLOSE_PAPERS));
  const offenders = tracked.filter((file) => {
    const match = /^data\/bioclash\/([a-z0-9-]+)\.ya?ml$/.exec(file);
    return match && !allowed.has(match[1]);
  });
  if (offenders.length) {
    console.error('Plaintext paper(s) staged or tracked:');
    offenders.forEach((f) => console.error('  ' + f));
    console.error('Encrypt with "node scripts/bioclash-paper-vault.js encrypt <paperId>", commit the .enc file, and run "git rm --cached" on the plaintext.');
    process.exit(1);
  }
  console.log('Guard OK: no unlisted plaintext papers are tracked.');
}

const [command, ...args] = process.argv.slice(2);
const commands = {
  keygen: cmdKeygen,
  encrypt: cmdEncrypt,
  decrypt: cmdDecrypt,
  rotate: cmdRotate,
  verify: cmdVerify,
  guard: cmdGuard
};

if (!command || !commands[command]) {
  console.error(USAGE);
  process.exit(command ? 1 : 0);
}

try {
  commands[command](args);
} catch (err) {
  if (err instanceof vault.VaultError) fail(err.message);
  throw err;
}
