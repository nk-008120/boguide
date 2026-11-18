const { getAdminClient } = require('./_lib/supabaseAdmin');
const { loadPaper, findBlock, toClientBlock, blocksRevealedByLock, authenticate, sanitizeAnswers, raiseCounters, signBlockFigures, loadActiveAttempt } = require('./_lib/bioclash');
const { captureError } = require('./_lib/sentry');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const userId = await authenticate(req, res, 'lock-block', 15, 60000);
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
    if (!paperBlock.locksAfterSubmit) {
      res.status(400).json({ error: 'This block is recoverable. Use save-draft instead.' });
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

    const { data: lockedRow, error: lockError } = await admin
      .from('bioclash_attempt_blocks')
      .update({ status: 'locked', locked_at: new Date().toISOString(), updated_at: new Date().toISOString(), answer: cleaned.answers })
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

    const targetBlocks = blocksRevealedByLock(paper, paperBlock);
    let revealedBlocks = [];
    if (targetBlocks.length > 0) {
      const rows = targetBlocks.map((b) => ({ attempt_id: attempt.id, block_id: b.id }));
      const { error: upsertError } = await admin
        .from('bioclash_attempt_blocks')
        .upsert(rows, { onConflict: 'attempt_id,block_id', ignoreDuplicates: true });
      if (upsertError) throw upsertError;

      const { data: revealRows, error: revealRowsError } = await admin
        .from('bioclash_attempt_blocks')
        .select('block_id, status, answer')
        .eq('attempt_id', attempt.id)
        .in('block_id', targetBlocks.map((b) => b.id));
      if (revealRowsError) throw revealRowsError;

      const rowByBlockId = {};
      for (const row of revealRows) rowByBlockId[row.block_id] = row;

      revealedBlocks = targetBlocks.map((b) => {
        const row = rowByBlockId[b.id];
        return {
          ...toClientBlock(b, userId),
          status: row ? row.status : 'active',
          answer: row ? row.answer : {}
        };
      });
    }

    await raiseCounters(admin, attempt.id, fullscreenExits, visibilityLosses);

    res.status(200).json({ ok: true, locked: blockId, revealedBlocks: await signBlockFigures(admin, revealedBlocks) });
  } catch (err) {
    console.error('bioclash-lock-block failed:', err);
    await captureError(err, { route: 'bioclash-lock-block' });
    res.status(500).json({ error: 'Could not lock block' });
  }
};
