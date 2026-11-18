const { getAdminClient } = require('./_lib/supabaseAdmin');
const { loadPaper, findBlock, authenticate, sanitizeAnswers, raiseCounters, loadActiveAttempt } = require('./_lib/bioclash');
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
    const cleaned = sanitizeAnswers(paperBlock, componentAnswers);
    if (cleaned.error) {
      res.status(400).json({ error: cleaned.error });
      return;
    }

    const admin = getAdminClient();

    const active = await loadActiveAttempt(admin, userId, paperId, sessionToken);
    if (!active.attempt) {
      res.status(active.status).json(active.body);
      return;
    }
    const attempt = active.attempt;

    const { data: updated, error: updateError } = await admin
      .from('bioclash_attempt_blocks')
      .update({ answer: cleaned.answers, updated_at: new Date().toISOString() })
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

    await raiseCounters(admin, attempt.id, fullscreenExits, visibilityLosses);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('bioclash-save-draft failed:', err);
    await captureError(err, { route: 'bioclash-save-draft' });
    res.status(500).json({ error: 'Could not save draft' });
  }
};
