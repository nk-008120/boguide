const { getAdminClient, getAnonClient } = require('./_lib/supabaseAdmin');
const { loadPaper, findBlock, componentIsCorrect, computeTotalPages } = require('./_lib/bioclash');

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

    const { paperId, force } = req.body || {};
    const paper = loadPaper(paperId);
    if (!paper) {
      res.status(400).json({ error: 'Unknown paper' });
      return;
    }

    const admin = getAdminClient();

    const { data: attempt, error: attemptError } = await admin
      .from('bioclash_attempts')
      .select('id, status, reached_final_page')
      .eq('user_id', userId)
      .eq('paper_id', paperId)
      .maybeSingle();
    if (attemptError) throw attemptError;
    if (!attempt || attempt.status !== 'in_progress') {
      res.status(409).json({ error: 'No active attempt to submit' });
      return;
    }

    if (force !== true && !attempt.reached_final_page) {
      const totalPages = computeTotalPages(paper);
      res.status(403).json({
        error: `You must reach page ${totalPages} of ${totalPages} at least once before submitting.`
      });
      return;
    }

    const { data: attemptBlocks, error: attemptBlocksError } = await admin
      .from('bioclash_attempt_blocks')
      .select('block_id, answer')
      .eq('attempt_id', attempt.id);
    if (attemptBlocksError) throw attemptBlocksError;

    let autoCorrect = 0;
    let autoTotal = 0;
    for (const row of attemptBlocks) {
      const paperBlock = findBlock(paper, row.block_id);
      if (!paperBlock || paperBlock.type === 'reveal_content') continue;
      for (const component of paperBlock.components || []) {
        const result = componentIsCorrect(component, (row.answer || {})[component.key]);
        if (result === null) continue;
        autoTotal += 1;
        if (result) autoCorrect += 1;
      }
    }

    const { error: updateError } = await admin
      .from('bioclash_attempts')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        auto_score_correct: autoCorrect,
        auto_score_total: autoTotal
      })
      .eq('id', attempt.id)
      .eq('status', 'in_progress');
    if (updateError) throw updateError;

    res.status(200).json({
      ok: true,
      autoScoreCorrect: autoCorrect,
      autoScoreTotal: autoTotal,
      note: 'This is a partial, auto-gradable-only score. Most of this paper is graded offline; your real result will follow separately.'
    });
  } catch (err) {
    console.error('bioclash-submit-attempt failed:', err);
    res.status(500).json({ error: 'Could not submit attempt' });
  }
};
