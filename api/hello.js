// Trivial smoke-test endpoint: confirms Vercel is serving `api/` functions
// alongside the static Hugo build on this project. Not used by the site —
// safe to hit directly at /api/hello to sanity-check a fresh deploy.
module.exports = (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'BiOrchive API is alive',
    time: new Date().toISOString()
  });
};
