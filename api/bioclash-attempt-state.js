const { getAdminClient } = require('./_lib/supabaseAdmin');
const { loadPaper, newSessionToken, authenticate, hasPaperAccess, closeIfExpired, attemptView } = require('./_lib/bioclash');
const { captureError } = require('./_lib/sentry');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const userId = await authenticate(req, res, 'attempt-state', 10, 60000);
    if (!userId) return;

    const paperId = req.body && req.body.paperId;
    const paper = loadPaper(paperId);
    if (!paper) {
      res.status(400).json({ error: 'Unknown paper' });
      return;
    }

    const admin = getAdminClient();

    if (!(await hasPaperAccess(admin, paper, paperId, userId))) {
      res.status(403).json({ error: 'This paper is not available yet.' });
      return;
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

    const sessionToken = newSessionToken();
    const { error: claimError } = await admin
      .from('bioclash_attempts')
      .update({ active_session_token: sessionToken, active_session_claimed_at: new Date().toISOString() })
      .eq('id', attempt.id);
    if (claimError) throw claimError;

    const { data: attemptBlocks, error: attemptBlocksError } = await admin
      .from('bioclash_attempt_blocks')
      .select('*')
      .eq('attempt_id', attempt.id);
    if (attemptBlocksError) throw attemptBlocksError;

    await closeIfExpired(admin, paper, attempt, attemptBlocks);

    res.status(200).json(await attemptView(admin, paper, paperId, userId, attempt, attemptBlocks, sessionToken, true));
  } catch (err) {
    console.error('bioclash-attempt-state failed:', err);
    await captureError(err, { route: 'bioclash-attempt-state' });
    res.status(500).json({ error: 'Could not load attempt state' });
  }
};
