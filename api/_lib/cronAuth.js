const crypto = require('crypto');

function timingSafeEqualStrings(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifyCronSecret(req, res) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    res.status(500).json({ ok: false, error: 'CRON_SECRET is not configured' });
    return false;
  }
  const auth = req.headers.authorization || '';
  if (!timingSafeEqualStrings(auth, `Bearer ${cronSecret}`)) {
    res.status(401).json({ ok: false, error: 'unauthorized' });
    return false;
  }
  return true;
}

module.exports = { verifyCronSecret, timingSafeEqualStrings };
