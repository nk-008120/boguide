const { getAdminClient } = require('./_lib/supabaseAdmin');
const { captureError } = require('./_lib/sentry');
const { authenticate } = require('./_lib/auth');

module.exports = async (req, res) => {
  try {
    await handle(req, res);
  } catch (e) {
    console.error('[delete-account] unhandled error:', e);
    await captureError(e, { route: 'delete-account' });
    if (!res.headersSent) res.status(500).json({ error: 'Internal error' });
  }
};

async function handle(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const userId = await authenticate(req, res, 'delete-account', 3, 300000);
  if (!userId) return;

  const admin = getAdminClient();

  const { error: logError } = await admin
    .from('account_deletions')
    .insert({ user_id: userId });
  if (logError) {
    console.error('[delete-account] deletion log insert failed:', logError);
    await captureError(logError, { route: 'delete-account', stage: 'log-insert' });
    res.status(500).json({ error: 'Could not process deletion' });
    return;
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
  if (deleteError) {
    console.error('[delete-account] auth.admin.deleteUser failed:', deleteError);
    await captureError(deleteError, { route: 'delete-account', stage: 'delete-user' });
    res.status(500).json({ error: 'Could not delete account' });
    return;
  }

  res.status(200).json({ deleted: true });
}
