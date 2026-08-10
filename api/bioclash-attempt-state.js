// GET /api/bioclash-attempt-state?paperId=...
// Rebuilds the client's UI state entirely from the server's own rows —
// called on every page load/refresh. Never creates anything (that's
// start-attempt's job); if no attempt exists yet, says so plainly.
const { getAdminClient, getAnonClient } = require('./_lib/supabaseAdmin');
const { loadPaper, toClientBlock, findBlock, watermarkCode, newSessionToken } = require('./_lib/bioclash');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
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

    const paperId = req.query && req.query.paperId;
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

    const { data: attempt, error: attemptError } = await admin
      .from('bioclash_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('paper_id', paperId)
      .maybeSingle();
    if (attemptError) throw attemptError;

    if (!attempt) {
      res.status(200).json({ attemptId: null, status: 'not_started' });
      return;
    }

    // Claim the session on every load/resume of an existing attempt — see
    // supabase/migrations/010_bioclash_anticheat.sql. This is the second
    // (and, in practice, main) claim point: start-attempt only ever fires
    // once per attempt, but every page load/refresh comes through here.
    const sessionToken = newSessionToken();
    const { error: claimError } = await admin
      .from('bioclash_attempts')
      .update({ active_session_token: sessionToken, active_session_claimed_at: new Date().toISOString() })
      .eq('id', attempt.id);
    if (claimError) throw claimError;

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
      blocks
    });
  } catch (err) {
    console.error('bioclash-attempt-state failed:', err);
    res.status(500).json({ error: 'Could not load attempt state' });
  }
};
