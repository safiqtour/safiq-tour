const { Client } = require('pg');
const url = 'postgresql://postgres.fwmgpkxemtsasmbrddmo:Safiq2026DB!@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
const c = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
(async () => {
  await c.connect();
  const m = await c.query('SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY finished_at');
  console.log('APPLIED MIGRATIONS:');
  m.rows.forEach((r) => console.log(' -', r.migration_name, r.finished_at));
  const t = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name='packages' ORDER BY ordinal_position");
  console.log('PACKAGES COLUMNS:');
  t.rows.forEach((r) => console.log(' -', r.column_name));
  const cnt = await c.query('SELECT count(*) FROM packages');
  console.log('PACKAGES COUNT:', cnt.rows[0].count);
  await c.end();
})().catch((e) => { console.log('ERR', e.message); process.exit(1); });
