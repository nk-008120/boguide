const { createClient } = require('@supabase/supabase-js');

let adminClient = null;
function getAdminClient() {
  if (adminClient) return adminClient;
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured');
  }
  adminClient = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  return adminClient;
}

let anonClient = null;
function getAnonClient() {
  if (anonClient) return anonClient;
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('SUPABASE_URL / SUPABASE_ANON_KEY are not configured');
  }
  anonClient = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  return anonClient;
}

module.exports = { getAdminClient, getAnonClient };
