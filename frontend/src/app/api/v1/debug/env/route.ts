import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

export const runtime = 'nodejs';

/**
 * デバッグエンドポイント：環境変数とDB接続を確認
 */
export async function GET(request: NextRequest) {
  const dbUrl = process.env.DATABASE_URL || '';
  let hostname = '';
  try { hostname = new URL(dbUrl).hostname; } catch {}

  // DNS resolution test
  const lookup4 = promisify(dns.resolve4);
  const lookup6 = promisify(dns.resolve6);
  let ipv4: string[] = [];
  let ipv6: string[] = [];
  let ipv4Err = '';
  let ipv6Err = '';
  if (hostname) {
    try { ipv4 = await lookup4(hostname); } catch (e: any) { ipv4Err = e.message; }
    try { ipv6 = await lookup6(hostname); } catch (e: any) { ipv6Err = e.message; }
  }

  // Quick DB connection test using IPv6 direct address
  let dbStatus = 'not tested';
  let resolvedUrl = '';
  if (dbUrl) {
    try {
      const { Pool } = require('pg');
      // Try IPv6 resolved address first
      if (ipv6.length > 0) {
        const match = dbUrl.match(/^(postgresql:\/\/[^@]+@)([^:/[\]]+)(:\d+\/.*)?$/);
        if (match) {
          resolvedUrl = `${match[1]}[${ipv6[0]}]${match[3] || ':5432/postgres'}`;
        }
      }
      const connStr = resolvedUrl || dbUrl;
      const pool = new Pool({ connectionString: connStr, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 5000 });
      await pool.query('SELECT 1');
      await pool.end();
      dbStatus = `OK (used: ${resolvedUrl ? 'IPv6 direct' : 'original URL'})`;
    } catch (e: any) {
      dbStatus = `FAIL: ${e.message}`;
    }
  }

  return NextResponse.json({
    env: {
      DATABASE_URL: dbUrl ? `postgresql://postgres:***@${hostname}/postgres` : 'NOT SET',
      BREVO_API_KEY: process.env.BREVO_API_KEY ? 'set' : 'NOT SET',
      SENDER_EMAIL: process.env.SENDER_EMAIL || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
    },
    dns: { hostname, ipv4, ipv4Err, ipv6, ipv6Err },
    db: dbStatus,
  });
}
