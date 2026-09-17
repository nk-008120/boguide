const { getAdminClient } = require('./_lib/supabaseAdmin');
const { loadPaper, findBlock, authenticate } = require('./_lib/bioclash');
const { captureError } = require('./_lib/sentry');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const userId = await authenticate(req, res, 'save-draft', 30, 60000);
    if (!userId) return;

    const { paperId, blockId, componentAnswers, fullscreenExits, visibilityLosses, sessionToken } = req.body || {};
    const paper = loadPaper(paperId);
    if (!paper) {
      res.status(400).json({ error: 'Unknown paper' });
      return;
    }
    const paperBlock = findBlock(paper, blockId);
    if (!paperBlock) {
      res.status(400).json({ error: 'Unknown block' });
      return;
    }
    if (paperBlock.locksAfterSubmit) {
      res.status(400).json({ error: 'This block requires Lock & Continue, not a draft save.' });
      return;
    }
    if (!componentAnswers || typeof componentAnswers !== 'object') {
      res.status(400).json({ error: 'componentAnswers must be an object' });
      return;
    }

    const admin = getAdminClient();

    const { data: attempt, error: attemptError } = await admin
      .from('bioclash_attempts')
      .select('id, status, end_at, active_session_token')
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

    const { data: updated, error: updateError } = await admin
      .from('bioclash_attempt_blocks')
      .update({ answer: componentAnswers, updated_at: new Date().toISOString() })
      .eq('attempt_id', attempt.id)
      .eq('block_id', blockId)
      .eq('status', 'active')
      .select('id')
      .maybeSingle();
    if (updateError) throw updateError;
    if (!updated) {
      res.status(409).json({ error: 'Block is not currently editable' });
      return;
    }

    if (Number.isFinite(fullscreenExits) || Number.isFinite(visibilityLosses)) {
      const patch = {};
      if (Number.isFinite(fullscreenExits)) patch.fullscreen_exits = fullscreenExits;
      if (Number.isFinite(visibilityLosses)) patch.visibility_losses = visibilityLosses;
      await admin.from('bioclash_attempts').update(patch).eq('id', attempt.id);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('bioclash-save-draft failed:', err);
    await captureError(err, { route: 'bioclash-save-draft' });
    res.status(500).json({ error: 'Could not save draft' });
  }
};
