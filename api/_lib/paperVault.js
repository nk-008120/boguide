const crypto = require('crypto');

const FORMAT_VERSION = 1;
const ALGORITHM = 'aes-256-gcm';
const KEY_BYTES = 32;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const TAG_BYTES = 16;
const KDF_LABEL = 'bioclash-paper-vault/v1/';
const AAD_LABEL = 'bioclash-paper-vault';
const PAPER_ID_PATTERN = /^[a-z0-9-]+$/;
const KEY_ID_PATTERN = /^[A-Za-z0-9_-]{1,16}$/;
const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;

class VaultError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'VaultError';
    this.code = code;
  }
}

function generateKey() {
  return crypto.randomBytes(KEY_BYTES).toString('base64');
}

function parseKeyring(raw) {
  if (!raw || !String(raw).trim()) {
    throw new VaultError('no_keys', 'no keys configured (set BIOCLASH_PAPER_KEYS)');
  }
  const ring = [];
  const seen = new Set();
  for (const entry of String(raw).split(',')) {
    const trimmed = entry.trim();
    if (!trimmed) continue;
    const split = trimmed.indexOf(':');
    if (split < 0) throw new VaultError('bad_keyring', 'each key must look like <id>:<base64>');
    const kid = trimmed.slice(0, split);
    const b64 = trimmed.slice(split + 1);
    if (!KEY_ID_PATTERN.test(kid)) throw new VaultError('bad_keyring', 'key id must be 1 to 16 letters, digits, dashes or underscores');
    if (seen.has(kid)) throw new VaultError('bad_keyring', 'duplicate key id: ' + kid);
    if (!BASE64_PATTERN.test(b64)) throw new VaultError('bad_keyring', 'key ' + kid + ' is not valid base64');
    const key = Buffer.from(b64, 'base64');
    if (key.length !== KEY_BYTES) throw new VaultError('bad_keyring', 'key ' + kid + ' must decode to exactly ' + KEY_BYTES + ' bytes');
    seen.add(kid);
    ring.push({ kid, key });
  }
  if (!ring.length) throw new VaultError('no_keys', 'no keys configured (set BIOCLASH_PAPER_KEYS)');
  return ring;
}

function keyringFromEnv(env) {
  return parseKeyring((env || process.env).BIOCLASH_PAPER_KEYS);
}

function assertPaperId(paperId) {
  if (!PAPER_ID_PATTERN.test(paperId || '')) throw new VaultError('bad_paper_id', 'paper id must match ' + PAPER_ID_PATTERN);
}

function deriveKey(masterKey, salt, paperId) {
  return Buffer.from(crypto.hkdfSync('sha256', masterKey, salt, Buffer.from(KDF_LABEL + paperId), KEY_BYTES));
}

function associatedData(version, algorithm, kid, paperId) {
  return Buffer.from([AAD_LABEL, 'v' + version, algorithm, kid, paperId].join('|'));
}

function encrypt(plaintext, paperId, keyring) {
  assertPaperId(paperId);
  if (!keyring || !keyring.length) throw new VaultError('no_keys', 'keyring is empty');
  const { kid, key } = keyring[0];
  const salt = crypto.randomBytes(SALT_BYTES);
  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, deriveKey(key, salt, paperId), iv, { authTagLength: TAG_BYTES });
  cipher.setAAD(associatedData(FORMAT_VERSION, ALGORITHM, kid, paperId));
  const ct = Buffer.concat([cipher.update(Buffer.from(plaintext)), cipher.final()]);
  const envelope = {
    v: FORMAT_VERSION,
    alg: ALGORITHM,
    kid,
    paper: paperId,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    ct: ct.toString('base64')
  };
  return JSON.stringify(envelope, null, 2) + '\n';
}

function decodeField(envelope, field, expectedLength) {
  const value = envelope[field];
  if (typeof value !== 'string' || !BASE64_PATTERN.test(value)) throw new VaultError('bad_envelope', 'field ' + field + ' is missing or malformed');
  const buf = Buffer.from(value, 'base64');
  if (expectedLength != null && buf.length !== expectedLength) throw new VaultError('bad_envelope', 'field ' + field + ' has the wrong length');
  return buf;
}

function inspect(envelopeText) {
  let envelope;
  try {
    envelope = JSON.parse(envelopeText);
  } catch (e) {
    throw new VaultError('bad_envelope', 'file is not a vault envelope');
  }
  if (!envelope || typeof envelope !== 'object') throw new VaultError('bad_envelope', 'file is not a vault envelope');
  if (envelope.v !== FORMAT_VERSION) throw new VaultError('unsupported_version', 'unsupported envelope version: ' + envelope.v);
  if (envelope.alg !== ALGORITHM) throw new VaultError('unsupported_algorithm', 'unsupported algorithm: ' + envelope.alg);
  if (typeof envelope.kid !== 'string' || !KEY_ID_PATTERN.test(envelope.kid)) throw new VaultError('bad_envelope', 'field kid is missing or malformed');
  if (typeof envelope.paper !== 'string' || !PAPER_ID_PATTERN.test(envelope.paper)) throw new VaultError('bad_envelope', 'field paper is missing or malformed');
  return { version: envelope.v, algorithm: envelope.alg, kid: envelope.kid, paper: envelope.paper, envelope };
}

function decrypt(envelopeText, paperId, keyring) {
  assertPaperId(paperId);
  const { envelope, kid, paper, version, algorithm } = inspect(envelopeText);
  if (paper !== paperId) throw new VaultError('wrong_paper', 'envelope belongs to a different paper');
  const entry = (keyring || []).find((k) => k.kid === kid);
  if (!entry) throw new VaultError('unknown_key', 'no key with id ' + kid + ' in the keyring');
  const salt = decodeField(envelope, 'salt', SALT_BYTES);
  const iv = decodeField(envelope, 'iv', IV_BYTES);
  const tag = decodeField(envelope, 'tag', TAG_BYTES);
  const ct = decodeField(envelope, 'ct');
  try {
    const decipher = crypto.createDecipheriv(ALGORITHM, deriveKey(entry.key, salt, paperId), iv, { authTagLength: TAG_BYTES });
    decipher.setAAD(associatedData(version, algorithm, kid, paperId));
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ct), decipher.final()]);
  } catch (e) {
    throw new VaultError('auth_failed', 'decryption failed (wrong key or the file was modified)');
  }
}

module.exports = {
  VaultError,
  FORMAT_VERSION,
  ALGORITHM,
  generateKey,
  parseKeyring,
  keyringFromEnv,
  encrypt,
  decrypt,
  inspect
};
