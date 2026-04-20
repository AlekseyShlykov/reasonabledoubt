/**
 * Reads .env.local and checks Supabase REST access (read + optional write test).
 * Run: node scripts/verify-supabase.cjs
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('Missing .env.local');
    process.exit(1);
  }
  const env = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

async function main() {
  const env = loadEnvLocal();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error('NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing in .env.local');
    process.exit(1);
  }

  console.log('URL:', url);
  console.log('Client: createClient OK\n');

  const supabase = createClient(url, key);

  const { data: vs, error: vsErr } = await supabase.from('verdict_sessions').select('id').limit(1);
  if (vsErr) {
    console.error('verdict_sessions SELECT failed:', vsErr.message, vsErr);
    console.error('→ Run schema.sql in Supabase SQL Editor if the table is missing.');
  } else {
    console.log('verdict_sessions: OK (read). Rows sample:', vs?.length ?? 0);
  }

  const { data: cv, error: cvErr } = await supabase.from('case_votes').select('id').limit(1);
  if (cvErr) {
    console.error('case_votes SELECT failed:', cvErr.message, cvErr);
    console.error('→ Run supabase/migrations/20250420000000_case_votes.sql if the table is missing.');
  } else {
    console.log('case_votes: OK (read). Rows sample:', cv?.length ?? 0);
  }

  const testSession = `verify-${Date.now()}`;
  const { error: insErr } = await supabase.from('case_votes').insert({
    case_id: 1,
    verdict: false,
    session_id: testSession,
  });
  if (insErr) {
    console.error('case_votes INSERT (test) failed:', insErr.message);
    if (insErr.code === '42501' || insErr.message?.includes('RLS')) {
      console.error('→ Check RLS policies on case_votes for role anon.');
    }
  } else {
    console.log('case_votes: OK (insert test row, session_id=' + testSession + ')');
  }

  process.exit(vsErr || cvErr || insErr ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
