module.exports = (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'BiOrchive API is alive',
    time: new Date().toISOString()
  });
};
