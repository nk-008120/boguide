// POST /api/bioclash-save-draft  { paperId, blockId, componentAnswers }
// Autosave for a RECOVERABLE block only — no correctness computation here
// at all, purely a server-backed draft (so resume works even after a
// crash or a different device, unlike sessionStorage alone). Rejects any
// attempt to target a locked block through this endpoint.
const { getAdminClient, getAnonClient } = require('./_lib/supabaseAdmin');
const { loadPaper, findBlock } = require('./_lib/bioclash');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      res.status(401).json({ error: 'Missing Authorization header' });
      return;
    }

    const anon = getAnonClient();
    const { data: userData, error: userError } = await anon.auth.getUser(token);
    if (userError || !userData || !userData.user) {
      res.status(401).json({ error: 'Invalid session' });
      return;
    }
    const userId = userData.user.id;

    const { paperId, blockId, componentAnswers, fullscreenExits, visibilityLosses } = req.body || {};
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
      .select('id, status, end_at')
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

    // Conditional update: only ever writes a row that's still 'active' —
    // a recoverable block should never be 'locked' in the first place, but
    // this guards against a malformed/malicious request regardless.
    const { data: updated, error: updateError } = await admin
      .from('bioclash_attempt_blocks')
      .update({ answer: componentAnswers })
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

    // Soft anti-cheat signals only — trusted as reported, same posture as
    // fullscreen_exits already has in the existing papers-attempt system.
    // Never used to auto-penalize; surfaced only for the founder to glance
    // at post-hoc.
    if (Number.isFinite(fullscreenExits) || Number.isFinite(visibilityLosses)) {
      const patch = {};
      if (Number.isFinite(fullscreenExits)) patch.fullscreen_exits = fullscreenExits;
      if (Number.isFinite(visibilityLosses)) patch.visibility_losses = visibilityLosses;
      await admin.from('bioclash_attempts').update(patch).eq('id', attempt.id);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('bioclash-save-draft failed:', err);
    res.status(500).json({ error: 'Could not save draft' });
  }
};
