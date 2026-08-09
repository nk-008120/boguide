// Pinged daily by Vercel Cron (see vercel.json) to stop the free-tier
// Supabase project from auto-pausing after 7 days of no API activity —
// login, the leaderboard, BiOClash opt-in, and Discussions all depend on
// that one project staying warm. A cheap read-only query is enough to
// count as activity; no data is written.
const { getAnonClient } = require('./_lib/supabaseAdmin');

module.exports = async (req, res) => {
  try {
    const client = getAnonClient();
    const { error } = await client.from('profiles').select('id').limit(1);
    if (error) throw error;
    res.status(200).json({ ok: true, time: new Date().toISOString() });
  } catch (err) {
    console.error('keepalive failed:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
