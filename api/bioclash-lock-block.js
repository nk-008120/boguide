// POST /api/bioclash-lock-block  { paperId, blockId, componentAnswers }
// The non-recoverable mechanic. Locks a block permanently for this attempt
// and, only on success, reveals whatever content that lock gates. The
// atomicity guarantee is an ordinary conditional UPDATE (`where status =
// 'active'`) — a concurrent duplicate/replayed request can only ever match
// zero rows the second time, so it can't double-lock or re-reveal. No
// grace window past the attempt's end_at: if the server's clock says time
// is up, this rejects before touching the block at all.
const { getAdminClient, getAnonClient } = require('./_lib/supabaseAdmin');
const { loadPaper, findBlock, toClientBlock } = require('./_lib/bioclash');

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
    if (!paperBlock.locksAfterSubmit) {
      res.status(400).json({ error: 'This block is recoverable — use save-draft instead.' });
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
    // Hard cutoff, no grace window — see file header.
    if (new Date(attempt.end_at).getTime() <= Date.now()) {
      res.status(409).json({ error: 'Time has expired' });
      return;
    }

    // The atomic step: only succeeds against a row that is still 'active'.
    const { data: lockedRow, error: lockError } = await admin
      .from('bioclash_attempt_blocks')
      .update({ status: 'locked', locked_at: new Date().toISOString(), answer: componentAnswers })
      .eq('attempt_id', attempt.id)
      .eq('block_id', blockId)
      .eq('status', 'active')
      .select('id')
      .maybeSingle();
    if (lockError) throw lockError;
    if (!lockedRow) {
      res.status(409).json({ error: 'This block is already locked.' });
      return;
    }

    let revealedBlock = null;
    if (paperBlock.reveals) {
      const revealPaperBlock = findBlock(paper, paperBlock.reveals);
      if (revealPaperBlock) {
        // Create the revealed block's row only if it doesn't already exist
        // (idempotent — a retried/duplicate successful response shouldn't
        // error out on the insert).
        const { data: existingReveal, error: existingRevealError } = await admin
          .from('bioclash_attempt_blocks')
          .select('id, status, answer')
          .eq('attempt_id', attempt.id)
          .eq('block_id', revealPaperBlock.id)
          .maybeSingle();
        if (existingRevealError) throw existingRevealError;

        let revealRow = existingReveal;
        if (!revealRow) {
          const { data: created, error: createError } = await admin
            .from('bioclash_attempt_blocks')
            .insert({ attempt_id: attempt.id, block_id: revealPaperBlock.id })
            .select('id, status, answer')
            .single();
          if (createError) throw createError;
          revealRow = created;
        }

        revealedBlock = {
          ...toClientBlock(revealPaperBlock, userId),
          status: revealRow.status,
          answer: revealRow.answer
        };
      }
    }

    // Soft anti-cheat signals only — see bioclash-save-draft.js for the
    // same pattern and reasoning.
    if (Number.isFinite(fullscreenExits) || Number.isFinite(visibilityLosses)) {
      const patch = {};
      if (Number.isFinite(fullscreenExits)) patch.fullscreen_exits = fullscreenExits;
      if (Number.isFinite(visibilityLosses)) patch.visibility_losses = visibilityLosses;
      await admin.from('bioclash_attempts').update(patch).eq('id', attempt.id);
    }

    res.status(200).json({ ok: true, locked: blockId, revealedBlock });
  } catch (err) {
    console.error('bioclash-lock-block failed:', err);
    res.status(500).json({ error: 'Could not lock block' });
  }
};
