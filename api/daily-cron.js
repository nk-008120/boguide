const { getAdminClient, getAnonClient } = require('./_lib/supabaseAdmin');

const UNRESOLVED_CODES = new Set(['ZZ', 'XX', 'EU', 'AP']);

function flagFromCode(code) {
  if (!/^[A-Z]{2}$/.test(code)) return null;
  const points = [...code].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...points);
}

function nameFromCode(code) {
  if (UNRESOLVED_CODES.has(code)) return null;
  try {
    const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(code);
    return name && name !== code ? name : null;
  } catch (e) {
    return null;
  }
}

async function umamiLogin(baseUrl, username, password) {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error(`Umami login failed: ${res.status}`);
  const data = await res.json();
  if (!data.token) throw new Error('Umami login response had no token');
  return data.token;
}

async function fetchCountryMetrics(baseUrl, websiteId, token) {
  const params = new URLSearchParams({
    type: 'country',
    startAt: '0',
    endAt: String(Date.now()),
    limit: '500'
  });
  const res = await fetch(`${baseUrl}/api/websites/${websiteId}/metrics/expanded?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`Umami metrics fetch failed: ${res.status}`);
  return res.json();
}

async function runKeepalive() {
  const client = getAnonClient();
  const { error } = await client.from('profiles').select('id').limit(1);
  if (error) throw error;
}

async function runSyncCountryStats() {
  const baseUrl = process.env.UMAMI_BASE_URL;
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  const username = process.env.UMAMI_USERNAME;
  const password = process.env.UMAMI_PASSWORD;
  if (!baseUrl || !websiteId || !username || !password) {
    throw new Error('UMAMI_BASE_URL / UMAMI_WEBSITE_ID / UMAMI_USERNAME / UMAMI_PASSWORD are not configured');
  }

  const token = await umamiLogin(baseUrl, username, password);
  const raw = await fetchCountryMetrics(baseUrl, websiteId, token);

  const countries = raw
    .map((row) => {
      const code = String(row.name || '').toUpperCase();
      const displayName = nameFromCode(code);
      const flag = flagFromCode(code);
      if (!displayName || !flag) return null;
      return { code, name: displayName, flag, views: Number(row.pageviews) || 0 };
    })
    .filter(Boolean)
    .sort((a, b) => b.views - a.views);

  const client = getAdminClient();
  const { error } = await client.from('country_stats_cache').upsert({
    id: 'latest',
    total_countries: countries.length,
    countries,
    last_updated: new Date().toISOString()
  });
  if (error) throw error;

  return countries.length;
}

module.exports = async (req, res) => {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${cronSecret}`) {
      res.status(401).json({ ok: false, error: 'unauthorized' });
      return;
    }
  }

  const result = { ok: true, time: new Date().toISOString() };

  try {
    await runKeepalive();
    result.keepalive = 'ok';
  } catch (err) {
    console.error('daily-cron keepalive failed:', err);
    result.ok = false;
    result.keepalive = 'failed: ' + err.message;
  }

  try {
    result.totalCountries = await runSyncCountryStats();
    result.syncCountryStats = 'ok';
  } catch (err) {
    console.error('daily-cron sync-country-stats failed:', err);
    result.ok = false;
    result.syncCountryStats = 'failed: ' + err.message;
  }

  res.status(result.ok ? 200 : 500).json(result);
};
