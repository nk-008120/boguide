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

async function collectFolders(admin, bucket, folders) {
  const paths = [];
  for (const folder of folders) {
    paths.push(...await listFolder(admin, bucket, folder));
  }
  return { bucket, paths };
}

async function idsOwnedBy(admin, table, userId) {
  const { data, error } = await admin.from(table).select('id').eq('user_id', userId);
  if (error) throw error;
  return (data || []).map((row) => row.id);
}

async function collectUserFiles(admin, userId) {
  const doubtIds = await idsOwnedBy(admin, 'doubts', userId);
  const replyIds = await idsOwnedBy(admin, 'doubt_replies', userId);
  return [
    await collectFolders(admin, 'biolab-captures', [userId]),
    await collectFolders(admin, 'paper-contributions', [userId]),
    await collectFolders(admin, 'doubt-images', doubtIds),
    await collectFolders(admin, 'doubt-reply-images', replyIds)
  ];
}

async function removeCollected(admin, collected) {
  let removed = 0;
  for (const { bucket, paths } of collected) {
    for (let i = 0; i < paths.length; i += REMOVE_BATCH) {
      const { error } = await admin.storage.from(bucket).remove(paths.slice(i, i + REMOVE_BATCH));
      if (error) throw error;
    }
    removed += paths.length;
  }
  return removed;
}

async function removeUserFiles(admin, userId) {
  return removeCollected(admin, await collectUserFiles(admin, userId));
}

async function deleteAccount(admin, userId, report) {
  let collected;
  try {
    collected = await collectUserFiles(admin, userId);
  } catch (listError) {
    await report(listError, 'file-listing');
    return { status: 500, body: { error: 'Could not prepare the deletion, so nothing was deleted. Please try again.' } };
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
  if (deleteError) {
    await report(deleteError, 'delete-user');
    return { status: 500, body: { error: 'Could not delete account' } };
  }

  try {
    await removeCollected(admin, collected);
  } catch (filesError) {
    await report(filesError, 'file-cleanup');
  }

  const { error: logError } = await admin.from('account_deletions').insert({ user_id: userId });
  if (logError) await report(logError, 'log-insert');

  return { status: 200, body: { deleted: true } };
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
module.exports.deleteAccount = deleteAccount;

async function handle(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const userId = await authenticate(req, res, 'delete-account', 3, 300000);
  if (!userId) return;

  const admin = getAdminClient();
  const result = await deleteAccount(admin, userId, async (err, stage) => {
    console.error(`[delete-account] ${stage} failed:`, err);
    await captureError(err, { route: 'delete-account', stage });
  });
  res.status(result.status).json(result.body);
}
