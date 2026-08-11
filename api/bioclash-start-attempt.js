// POST /api/bioclash-start-attempt  { paperId }
// Starts a fresh attempt, or resumes an existing in-progress one. Never
// returns a correct answer, an un-reached block, or a reveal the caller
// hasn't actually earned yet — see api/_lib/bioclash.js's toClientBlock().
const { getAdminClient, getAnonClient } = require('./_lib/supabaseAdmin');
const { loadPaper, initialBlocks, toClientBlock, findBlock, watermarkCode, newSessionToken, computeTotalPages } = require('./_lib/bioclash');

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

    const paperId = req.body && req.body.paperId;
    const paper = loadPaper(paperId);
    if (!paper) {
      res.status(400).json({ error: 'Unknown paper' });
      return;
    }

    const admin = getAdminClient();

    if (paper.accessMode === 'allowlist') {
      const { data: accessRow, error: accessError } = await admin
        .from('bioclash_paper_access')
        .select('id')
        .eq('paper_id', paperId)
        .eq('user_id', userId)
        .maybeSingle();
      if (accessError) throw accessError;
      if (!accessRow) {
        res.status(403).json({ error: 'This paper is not available yet.' });
        return;
      }
    }

    const { data: existing, error: existingError } = await admin
      .from('bioclash_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('paper_id', paperId)
      .maybeSingle();
    if (existingError) throw existingError;

    let attempt = existing;

    if (attempt && attempt.status === 'submitted') {
      res.status(403).json({ error: 'You have already submitted this paper.' });
      return;
    }

    const sessionToken = newSessionToken();

    if (!attempt) {
      const endAt = new Date(Date.now() + (paper.durationMinutes || 240) * 60000).toISOString();
      const { data: created, error: createError } = await admin
        .from('bioclash_attempts')
        .insert({
          user_id: userId,
          paper_id: paperId,
          end_at: endAt,
          active_session_token: sessionToken,
          active_session_claimed_at: new Date().toISOString()
        })
        .select('*')
        .single();
      if (createError) throw createError;
      attempt = created;

      const blockRows = initialBlocks(paper).map((b) => ({
        attempt_id: attempt.id,
        block_id: b.id
      }));
      if (blockRows.length) {
        const { error: blocksError } = await admin.from('bioclash_attempt_blocks').insert(blockRows);
        if (blocksError) throw blocksError;
      }
    } else {
      // Not the normal path (the frontend only ever calls this once, to
      // create a brand-new attempt — see bioclash-attempt-state.js for the
      // resume path) but claim the session here too for robustness if it
      // ever is hit on an existing attempt.
      const { error: claimError } = await admin
        .from('bioclash_attempts')
        .update({ active_session_token: sessionToken, active_session_claimed_at: new Date().toISOString() })
        .eq('id', attempt.id);
      if (claimError) throw claimError;
    }

    if (attempt.status === 'in_progress' && new Date(attempt.end_at).getTime() <= Date.now()) {
      await admin.from('bioclash_attempts').update({ status: 'expired' }).eq('id', attempt.id);
      attempt.status = 'expired';
    }

    const { data: attemptBlocks, error: attemptBlocksError } = await admin
      .from('bioclash_attempt_blocks')
      .select('*')
      .eq('attempt_id', attempt.id);
    if (attemptBlocksError) throw attemptBlocksError;

    const blocks = attemptBlocks.map((row) => {
      const paperBlock = findBlock(paper, row.block_id);
      return {
        ...toClientBlock(paperBlock, userId),
        status: row.status,
        answer: row.answer
      };
    });

    res.status(200).json({
      attemptId: attempt.id,
      status: attempt.status,
      endAt: attempt.end_at,
      fullscreenExits: attempt.fullscreen_exits,
      visibilityLosses: attempt.visibility_losses,
      paperTitle: paper.title,
      watermark: watermarkCode(userId, paperId),
      sessionToken,
      totalPages: computeTotalPages(paper),
      reachedFinalPage: !!attempt.reached_final_page,
      blocks
    });
  } catch (err) {
    console.error('bioclash-start-attempt failed:', err);
    res.status(500).json({ error: 'Could not start attempt' });
  }
};
