const { Pool } = require('pg');
const ref = 'xdkbfszzkckxcppevvwy';
const pass = 'aoyama2026aps';

const testConnect = async (url, label) => {
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
  try {
    await pool.query('SELECT 1');
    console.log(label, 'OK');
  } catch (e) {
    console.log(label, 'FAIL:', e.message.slice(0, 100));
  } finally {
    try { await pool.end(); } catch (_) {}
  }
};

// Try Supavisor with different username formats for ap-southeast-1
const tests = [
  [`postgresql://postgres.${ref}:${pass}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`, 'ap-se1 session postgres.ref'],
  [`postgresql://postgres.${ref}:${pass}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`, 'ap-se1 transaction postgres.ref'],
  [`postgresql://postgres:${pass}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`, 'ap-se1 session postgres only'],
  [`postgresql://postgres:${pass}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`, 'ap-se1 transaction postgres only'],
  [`postgresql://postgres.${ref}:${pass}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`, 'us-east-1 transaction'],
  [`postgresql://postgres.${ref}:${pass}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`, 'eu-west-1 transaction'],
];

Promise.all(tests.map(([url, label]) => testConnect(url, label))).then(() => process.exit(0));
