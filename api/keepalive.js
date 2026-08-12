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
