const { getAnonClient } = require('./supabaseAdmin');
const { rateLimit } = require('./rateLimit');

async function authenticate(req, res, action, maxPerWindow, windowMs) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Missing Authorization header' });
    return null;
  }

  const anon = getAnonClient();
  const { data: userData, error: userError } = await anon.auth.getUser(token);
  if (userError || !userData || !userData.user) {
    res.status(401).json({ error: 'Invalid session' });
    return null;
  }
  const userId = userData.user.id;

  if (await rateLimit(userId, action, maxPerWindow, windowMs)) {
    res.status(429).json({ error: 'Too many requests' });
    return null;
  }

  return userId;
}

module.exports = { authenticate };
