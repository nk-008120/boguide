const { getAdminClient } = require('./_lib/supabaseAdmin');
const { loadPaper, autoGrade } = require('./_lib/bioclash');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const authHeader = req.headers.authorization || '';
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const admin = getAdminClient();

    const { data: stale, error: staleError } = await admin
      .from('bioclash_attempts')
      .select('id, paper_id, end_at')
      .eq('status', 'in_progress')
      .lt('end_at', new Date().toISOString())
      .limit(50);
    if (staleError) throw staleError;

    let submitted = 0;
    for (const attempt of stale || []) {
      const paper = loadPaper(attempt.paper_id);
      if (!paper) continue;

      const { data: blocks } = await admin
        .from('bioclash_attempt_blocks')
        .select('block_id, answer')
        .eq('attempt_id', attempt.id);

      const { autoCorrect, autoTotal, autoMarksEarned, autoMarksTotal } = autoGrade(paper, blocks || []);

      const { error: updateError } = await admin
        .from('bioclash_attempts')
        .update({
          status: 'submitted',
          submitted_at: attempt.end_at,
          auto_score_correct: autoCorrect,
          auto_score_total: autoTotal,
          auto_marks_earned: autoMarksEarned,
          auto_marks_total: autoMarksTotal
        })
        .eq('id', attempt.id)
        .eq('status', 'in_progress');
      if (!updateError) submitted += 1;
    }

    res.status(200).json({ ok: true, found: (stale || []).length, submitted });
  } catch (err) {
    console.error('bioclash-cleanup failed:', err);
    res.status(500).json({ error: 'Cleanup failed' });
  }
};
