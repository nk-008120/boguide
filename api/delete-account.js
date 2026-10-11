const { getAdminClient } = require('./_lib/supabaseAdmin');
const { captureError } = require('./_lib/sentry');
const { authenticate } = require('./_lib/auth');

const LIST_PAGE = 1000;
const REMOVE_BATCH = 100;

async function listFolder(admin, bucket, folder) {
  const paths = [];
  for (let offset = 0; ; offset += LIST_PAGE) {
    const { data, error } = await admin.storage.from(bucket).list(folder, { limit: LIST_PAGE, offset });
    if (error) throw error;
    for (const entry of data || []) {
      if (entry && entry.id) paths.push(`${folder}/${entry.name}`);
    }
    if (!data || data.length < LIST_PAGE) break;
  }
  return paths;
}

async function removeFolders(admin, bucket, folders) {
  let removed = 0;
  for (const folder of folders) {
    const paths = await listFolder(admin, bucket, folder);
    for (let i = 0; i < paths.length; i += REMOVE_BATCH) {
      const { error } = await admin.storage.from(bucket).remove(paths.slice(i, i + REMOVE_BATCH));
      if (error) throw error;
    }
    removed += paths.length;
  }
  return removed;
}

async function idsOwnedBy(admin, table, userId) {
  const { data, error } = await admin.from(table).select('id').eq('user_id', userId);
  if (error) throw error;
  return (data || []).map((row) => row.id);
}

async function removeUserFiles(admin, userId) {
  const doubtIds = await idsOwnedBy(admin, 'doubts', userId);
  const replyIds = await idsOwnedBy(admin, 'doubt_replies', userId);
  let removed = 0;
  removed += await removeFolders(admin, 'biolab-captures', [userId]);
  removed += await removeFolders(admin, 'paper-contributions', [userId]);
  removed += await removeFolders(admin, 'doubt-images', doubtIds);
  removed += await removeFolders(admin, 'doubt-reply-images', replyIds);
  return removed;
}

module.exports = async (req, res) => {
  try {
    await handle(req, res);
  } catch (e) {
    console.error('[delete-account] unhandled error:', e);
    await captureError(e, { route: 'delete-account' });
    if (!res.headersSent) res.status(500).json({ error: 'Internal error' });
  }
};

module.exports.removeUserFiles = removeUserFiles;

async function handle(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const userId = await authenticate(req, res, 'delete-account', 3, 300000);
  if (!userId) return;

  const admin = getAdminClient();

  try {
    await removeUserFiles(admin, userId);
  } catch (filesError) {
    console.error('[delete-account] file cleanup failed:', filesError);
    await captureError(filesError, { route: 'delete-account', stage: 'file-cleanup' });
    res.status(500).json({ error: 'Could not remove your uploaded files, so nothing was deleted. Please try again.' });
    return;
  }

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
