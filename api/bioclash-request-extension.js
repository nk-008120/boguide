const { getAdminClient } = require('./_lib/supabaseAdmin');
const { loadPaper, extensionPenalty, authenticate } = require('./_lib/bioclash');
const { captureError } = require('./_lib/sentry');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const userId = await authenticate(req, res, 'request-extension', 5, 60000);
    if (!userId) return;

    const { paperId, sessionToken } = req.body || {};
    const paper = loadPaper(paperId);
    if (!paper) {
      res.status(400).json({ error: 'Unknown paper' });
      return;
    }
    const maxBlocks = paper.maxExtensionBlocks || 0;
    const blockMinutes = paper.extensionBlockMinutes || 0;
    if (!maxBlocks || !blockMinutes) {
      res.status(400).json({ error: 'This round has no time-extension mechanic.' });
      return;
    }

    const admin = getAdminClient();

    const { data: attempt, error: attemptError } = await admin
      .from('bioclash_attempts')
      .select('id, status, end_at, active_session_token, extension_blocks_used')
      .eq('user_id', userId)
      .eq('paper_id', paperId)
      .maybeSingle();
    if (attemptError) throw attemptError;
    if (!attempt || attempt.status !== 'in_progress') {
      res.status(409).json({ error: 'No active attempt' });
      return;
    }

    if (new Date(attempt.end_at).getTime() <= Date.now()) {
      res.status(409).json({ error: 'Time has expired' });
      return;
    }

    if (!sessionToken || sessionToken !== attempt.active_session_token) {
      res.status(409).json({ error: 'This attempt is now active in another tab or device.', reason: 'superseded' });
      return;
    }
    if (attempt.extension_blocks_used >= maxBlocks) {
      res.status(409).json({ error: 'No extension blocks remaining for this round.' });
      return;
    }

    const newEndAt = new Date(new Date(attempt.end_at).getTime() + blockMinutes * 60000).toISOString();
    const newBlocksUsed = attempt.extension_blocks_used + 1;
    const penalty = extensionPenalty(paper, newBlocksUsed);

    const { data: updated, error: updateError } = await admin
      .from('bioclash_attempts')
      .update({ end_at: newEndAt, extension_blocks_used: newBlocksUsed, extension_penalty: penalty })
      .eq('id', attempt.id)
      .eq('extension_blocks_used', attempt.extension_blocks_used)
      .select('end_at, extension_blocks_used, extension_penalty')
      .maybeSingle();
    if (updateError) throw updateError;
    if (!updated) {
      res.status(409).json({ error: 'Could not grant extension. Try again.' });
      return;
    }

    res.status(200).json({
      ok: true,
      endAt: updated.end_at,
      extensionBlocksUsed: updated.extension_blocks_used,
      extensionPenalty: updated.extension_penalty,
      maxExtensionBlocks: maxBlocks
    });
  } catch (err) {
    console.error('bioclash-request-extension failed:', err);
    await captureError(err, { route: 'bioclash-request-extension' });
    res.status(500).json({ error: 'Could not grant extension' });
  }
};
