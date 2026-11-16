const crypto = require('crypto');

function timingSafeEqualStrings(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifySecret(req, res, name) {
  const secret = process.env[name];
  if (!secret) {
    res.status(500).json({ ok: false, error: `${name} is not configured` });
    return false;
  }
  const auth = req.headers.authorization || '';
  if (!timingSafeEqualStrings(auth, `Bearer ${secret}`)) {
    res.status(401).json({ ok: false, error: 'unauthorized' });
    return false;
  }
  return true;
}

function verifyCronSecret(req, res) {
  return verifySecret(req, res, 'CRON_SECRET');
}

function verifyAdminSecret(req, res) {
  return verifySecret(req, res, 'BIOCLASH_ADMIN_SECRET');
}

module.exports = { verifyCronSecret, verifyAdminSecret, timingSafeEqualStrings };
