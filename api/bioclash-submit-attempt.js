const { getAdminClient } = require('./_lib/supabaseAdmin');
const { loadPaper, autoGrade, computeTotalPages, authenticate } = require('./_lib/bioclash');
const { captureError } = require('./_lib/sentry');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const userId = await authenticate(req, res, 'submit-attempt', 5, 60000);
    if (!userId) return;

    const { paperId, force } = req.body || {};
    const paper = loadPaper(paperId);
    if (!paper) {
      res.status(400).json({ error: 'Unknown paper' });
      return;
    }

    const admin = getAdminClient();

    const { data: attempt, error: attemptError } = await admin
      .from('bioclash_attempts')
      .select('id, status, end_at, reached_final_page')
      .eq('user_id', userId)
      .eq('paper_id', paperId)
      .maybeSingle();
    if (attemptError) throw attemptError;
    if (!attempt || attempt.status !== 'in_progress') {
      res.status(409).json({ error: 'No active attempt to submit' });
      return;
    }

    const timerExpired = new Date(attempt.end_at).getTime() <= Date.now();
    if (!timerExpired && !attempt.reached_final_page) {
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

    const { autoCorrect, autoTotal, autoMarksEarned, autoMarksTotal } = autoGrade(paper, attemptBlocks);

    const { error: updateError } = await admin
      .from('bioclash_attempts')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        auto_score_correct: autoCorrect,
        auto_score_total: autoTotal,
        auto_marks_earned: autoMarksEarned,
        auto_marks_total: autoMarksTotal
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
    await captureError(err, { route: 'bioclash-submit-attempt' });
    res.status(500).json({ error: 'Could not submit attempt' });
  }
};
