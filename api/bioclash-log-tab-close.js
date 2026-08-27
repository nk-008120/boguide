const { getAdminClient, getAnonClient } = require('./_lib/supabaseAdmin');

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

    const { paperId, sessionToken } = req.body || {};
    if (!paperId || !sessionToken) {
      res.status(400).json({ error: 'paperId and sessionToken are required' });
      return;
    }

    const admin = getAdminClient();

    const { data: attempt, error: attemptError } = await admin
      .from('bioclash_attempts')
      .select('id, tab_close_events')
      .eq('user_id', userId)
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
