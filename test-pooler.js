const { Pool } = require('pg');
const ref = 'xdkbfszzkckxcppevvwy';
const pass = 'aoyama2026aps';

const testConnect = async (url, label) => {
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 5000 });
  try {
    await pool.query('SELECT 1');
    console.log(label, 'OK');
  } catch (e) {
    console.log(label, 'FAIL:', e.message);
  } finally {
    try { await pool.end(); } catch (_) {}
  }
};

Promise.all([
  testConnect(`postgresql://postgres.${ref}:${pass}@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres`, 'ap-northeast-1 session'),
  testConnect(`postgresql://postgres.${ref}:${pass}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`, 'ap-southeast-1 session'),
  testConnect(`postgresql://postgres.${ref}:${pass}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`, 'ap-northeast-1 transaction'),
]).then(() => process.exit(0));
