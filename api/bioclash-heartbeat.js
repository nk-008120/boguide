const { getAdminClient, getAnonClient } = require('./_lib/supabaseAdmin');
const { rateLimit } = require('./_lib/bioclash');

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

    if (rateLimit(userId, 'heartbeat', 6, 60000)) {
      res.status(429).json({ error: 'Too many requests' });
      return;
    }

    const { paperId, sessionToken, reachedFinalPage } = req.body || {};
    if (!paperId || !sessionToken) {
      res.status(400).json({ error: 'paperId and sessionToken are required' });
      return;
    }

    const admin = getAdminClient();

    const { data: attempt, error: attemptError } = await admin
      .from('bioclash_attempts')
      .select('id, status, active_session_token, active_session_claimed_at, heartbeat_gaps')
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

    const now = new Date();
    const patch = { active_session_claimed_at: now.toISOString() };
    if (reachedFinalPage === true) patch.reached_final_page = true;

    if (attempt.active_session_claimed_at) {
      const lastClaim = new Date(attempt.active_session_claimed_at).getTime();
      const gapMs = now.getTime() - lastClaim;
      if (gapMs > 60000) {
        patch.heartbeat_gaps = (attempt.heartbeat_gaps || 0) + 1;
      }
    }

    await admin.from('bioclash_attempts').update(patch).eq('id', attempt.id);

    res.status(200).json({ ok: true, active: true });
  } catch (err) {
    console.error('bioclash-heartbeat failed:', err);
    res.status(500).json({ error: 'Heartbeat failed' });
  }
};
