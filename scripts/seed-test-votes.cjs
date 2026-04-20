/**
 * Inserts synthetic votes into case_votes for UI/testing (session_id prefix seed-*).
 * Run: node scripts/seed-test-votes.cjs
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
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const prefix = `seed-${Date.now()}`;

  const rows = [];
  for (let caseId = 1; caseId <= 10; caseId++) {
    const guiltyCount = 4 + (caseId % 3);
    const notGuiltyCount = 3 + ((caseId + 1) % 4);
    let n = 0;
    for (let i = 0; i < guiltyCount; i++) {
      rows.push({
        case_id: caseId,
        verdict: true,
        session_id: `${prefix}-c${caseId}-g${n++}`,
      });
    }
    for (let i = 0; i < notGuiltyCount; i++) {
      rows.push({
        case_id: caseId,
        verdict: false,
        session_id: `${prefix}-c${caseId}-n${n++}`,
      });
    }
  }

  const { error } = await supabase.from('case_votes').insert(rows);
  if (error) {
    console.error('INSERT failed:', error.message, error);
    process.exit(1);
  }

  console.log('Inserted', rows.length, 'rows into case_votes (session_id prefix', prefix + ')\n');

  const { data: all, error: selErr } = await supabase.from('case_votes').select('case_id, verdict');
  if (selErr) {
    console.error('SELECT after insert:', selErr.message);
    process.exit(1);
  }

  const byCase = {};
  for (let id = 1; id <= 10; id++) byCase[id] = { guilty: 0, notGuilty: 0 };
  for (const r of all || []) {
    if (r.verdict) byCase[r.case_id].guilty++;
    else byCase[r.case_id].notGuilty++;
  }

  console.log('Totals per case_id (all rows in table):');
  for (let id = 1; id <= 10; id++) {
    const { guilty, notGuilty } = byCase[id];
    const t = guilty + notGuilty;
    const gPct = t ? ((guilty / t) * 100).toFixed(1) : '0';
    const ngPct = t ? ((notGuilty / t) * 100).toFixed(1) : '0';
    console.log(`  case ${id}: guilty=${guilty} (${gPct}%)  not_guilty=${notGuilty} (${ngPct}%)  n=${t}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
