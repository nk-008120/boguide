const { getAdminClient } = require('./_lib/supabaseAdmin');
const { loadPaper, initialBlocks, newSessionToken, authenticate, hasPaperAccess, closeIfExpired, attemptView } = require('./_lib/bioclash');
const { captureError } = require('./_lib/sentry');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const userId = await authenticate(req, res, 'start-attempt', 5, 60000);
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

    if (!attempt) {
      const now = Date.now();
      if (paper.opensAt && now < new Date(paper.opensAt).getTime()) {
        res.status(403).json({ error: 'This round has not opened yet.' });
        return;
      }
      if (paper.closesAt && now > new Date(paper.closesAt).getTime()) {
        res.status(403).json({ error: 'This round is no longer accepting new attempts.' });
        return;
      }
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
      const { error: claimError } = await admin
        .from('bioclash_attempts')
        .update({ active_session_token: sessionToken, active_session_claimed_at: new Date().toISOString() })
        .eq('id', attempt.id);
      if (claimError) throw claimError;
    }

    const { data: attemptBlocks, error: attemptBlocksError } = await admin
      .from('bioclash_attempt_blocks')
      .select('*')
      .eq('attempt_id', attempt.id);
    if (attemptBlocksError) throw attemptBlocksError;

    await closeIfExpired(admin, paper, attempt, attemptBlocks);

    res.status(200).json(await attemptView(admin, paper, paperId, userId, attempt, attemptBlocks, sessionToken, false));
  } catch (err) {
    console.error('bioclash-start-attempt failed:', err);
    await captureError(err, { route: 'bioclash-start-attempt' });
    res.status(500).json({ error: 'Could not start attempt' });
  }
};
