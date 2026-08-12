const { getAdminClient } = require('./_lib/supabaseAdmin');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { paperId, sessionToken } = req.body || {};
    if (!paperId || !sessionToken) {
      res.status(400).json({ error: 'paperId and sessionToken are required' });
      return;
    }

    const admin = getAdminClient();

    const { data: attempt, error: attemptError } = await admin
      .from('bioclash_attempts')
      .select('id, tab_close_events')
      .eq('paper_id', paperId)
      .eq('active_session_token', sessionToken)
      .eq('status', 'in_progress')
      .maybeSingle();
    if (attemptError) throw attemptError;

    if (!attempt) {
      res.status(200).json({ ok: true, logged: false });
      return;
    }

    await admin
      .from('bioclash_attempts')
      .update({ tab_close_events: (attempt.tab_close_events || 0) + 1 })
      .eq('id', attempt.id);

    res.status(200).json({ ok: true, logged: true });
  } catch (err) {
    console.error('bioclash-log-tab-close failed:', err);
    res.status(500).json({ error: 'Could not log tab-close event' });
  }
};
