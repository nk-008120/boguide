const { getAdminClient, getAnonClient } = require('./_lib/supabaseAdmin');

module.exports = async (req, res) => {
  try {
    await handle(req, res);
  } catch (e) {
    console.error('[delete-account] unhandled error:', e);
    if (!res.headersSent) res.status(500).json({ error: 'Internal error' });
  }
};

async function handle(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const authHeader = req.headers.authorization || '';
  const match = /^Bearer\s+(.+)$/.exec(authHeader);
  if (!match) {
    res.status(401).json({ error: 'Missing bearer token' });
    return;
  }
  const token = match[1];

  let userId;
  try {
    const anon = getAnonClient();
    const { data, error } = await anon.auth.getUser(token);
    if (error || !data || !data.user) {
      console.error('[delete-account] auth.getUser rejected:', error);
      res.status(401).json({ error: 'Invalid or expired session' });
      return;
    }
    userId = data.user.id;
  } catch (e) {
    console.error('[delete-account] auth check threw:', e);
    res.status(500).json({ error: 'Auth check failed' });
    return;
  }

  const admin = getAdminClient();

  const { error: logError } = await admin
    .from('account_deletions')
    .insert({ user_id: userId });
  if (logError) {
    console.error('[delete-account] deletion log insert failed:', logError);
    res.status(500).json({ error: 'Could not process deletion' });
    return;
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
  if (deleteError) {
    console.error('[delete-account] auth.admin.deleteUser failed:', deleteError);
    res.status(500).json({ error: 'Could not delete account' });
    return;
  }

  res.status(200).json({ deleted: true });
}
