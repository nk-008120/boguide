const crypto = require('crypto');

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const LENGTH = 32;

function generateKey() {
  let key = '';
  while (key.length < LENGTH) {
    const byte = crypto.randomBytes(1)[0];
    if (byte < ALPHABET.length * Math.floor(256 / ALPHABET.length)) {
      key += ALPHABET[byte % ALPHABET.length];
    }
  }
  return key;
}

const label = (process.argv[2] || 'staff').replace(/[^A-Za-z0-9 _-]/g, '');
const key = generateKey();
const hash = crypto.createHash('sha256').update(key, 'utf8').digest('hex');

console.log('BiOLive staff key (shown once, store it in a password manager):');
console.log('');
console.log('  ' + key);
console.log('');
console.log('Run this in the Supabase SQL editor to activate it:');
console.log('');
console.log("  insert into public.live_staff_keys (key_hash, label) values ('" + hash + "', '" + label + "');");
console.log('');
console.log('To retire every older key afterwards:');
console.log('');
console.log("  update public.live_staff_keys set revoked_at = now() where revoked_at is null and key_hash <> '" + hash + "';");
