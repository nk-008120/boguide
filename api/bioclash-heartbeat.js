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

    const { paperId, sessionToken, reachedFinalPage } = req.body || {};
    if (!paperId || !sessionToken) {
      res.status(400).json({ error: 'paperId and sessionToken are required' });
      return;
    }

    const admin = getAdminClient();

    const { data: attempt, error: attemptError } = await admin
      .from('bioclash_attempts')
      .select('id, status, active_session_token')
      .eq('user_id', userId)
      .eq('paper_id', paperId)
      .maybeSingle();
    if (attemptError) throw attemptError;

    if (!attempt || attempt.status !== 'in_progress') {
      res.status(200).json({ ok: true, active: false });
      return;
    }

    if (attempt.active_session_token !== sessionToken) {
      res.status(409).json({ error: 'This attempt is now active in another tab or device.', reason: 'superseded' });
      return;
    }

    const patch = { active_session_claimed_at: new Date().toISOString() };
    if (reachedFinalPage === true) patch.reached_final_page = true;
    await admin.from('bioclash_attempts').update(patch).eq('id', attempt.id);

    res.status(200).json({ ok: true, active: true });
  } catch (err) {
    console.error('bioclash-heartbeat failed:', err);
    res.status(500).json({ error: 'Heartbeat failed' });
  }
};
