const { getAdminClient } = require('./supabaseAdmin');

async function rateLimit(userId, action, maxPerWindow, windowMs) {
  const admin = getAdminClient();
  const key = `${userId}:${action}`;
  const { data, error } = await admin.rpc('rate_limit_hit', { p_key: key, p_window_ms: windowMs });
  if (error) throw error;
  return data > maxPerWindow;
}

module.exports = { rateLimit };
