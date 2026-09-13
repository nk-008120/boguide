const { getAnonClient } = require('./_lib/supabaseAdmin');

module.exports = async (req, res) => {
  try {
    const client = getAnonClient();
    const { data, error } = await client
      .from('country_stats_cache')
      .select('total_countries, countries, last_updated')
      .eq('id', 'latest')
      .maybeSingle();
    if (error) throw error;

    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');

    if (!data) {
      res.status(200).json({ totalCountries: 0, countries: [], lastUpdated: null });
      return;
    }

    res.status(200).json({
      totalCountries: data.total_countries,
      countries: data.countries,
      lastUpdated: data.last_updated ? data.last_updated.slice(0, 10) : null
    });
  } catch (err) {
    console.error('country-stats failed:', err);
    res.status(500).json({ error: err.message });
  }
};
