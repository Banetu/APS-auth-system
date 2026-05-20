// pg は動的 require で読み込む（Next.js 15 サーバーレス webpack バンドル回避）
import { promises as dnsPromises } from 'dns';

let pool: any = null;

/**
 * Supabase の DB ホスト名は IPv6 のみ。
 * Vercel は getaddrinfo を AF_INET で呼ぶため ENOTFOUND になる。
 * 先に AAAA レコードを解決して IPv6 アドレスを connectionString に埋め込む。
 */
async function resolveConnectionString(): Promise<string> {
  const url = process.env.DATABASE_URL || '';
  if (!url) return url;
  try {
    const match = url.match(/^(postgresql:\/\/[^@]+@)([^:/[\]]+)(:\d+\/.*)?$/);
    if (!match) return url;
    const hostname = match[2];
    // Already an IP address — skip resolution
    if (/^[\d.]+$/.test(hostname) || /^[0-9a-fA-F:]+$/.test(hostname)) return url;
    const addrs = await dnsPromises.resolve6(hostname);
    if (addrs && addrs.length > 0) {
      // IPv6 addresses in connection strings must be wrapped in brackets
      return `${match[1]}[${addrs[0]}]${match[3] || ':5432/postgres'}`;
    }
  } catch {
    // Fall back to original URL if resolution fails
  }
  return url;
}

async function getPool(): Promise<any> {
  if (!pool) {
    const { Pool } = require('pg');
    const connectionString = await resolveConnectionString();
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 2,                    // サーバーレス向けに接続数を制限
      idleTimeoutMillis: 10000,  // アイドル接続を10秒で解放
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

export async function query(
  text: string,
  params?: any[]
): Promise<any> {
  const client = await getPool();
  return client.query(text, params);
}

export async function ensureTablesExist(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT,
      subject TEXT,
      affiliation TEXT,
      message TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

export async function ensureJoinRequestsTableExists(): Promise<void> {
  // 既存環境との互換性維持のため、先にテーブル作成（未作成時）
  await query(`
    CREATE TABLE IF NOT EXISTS join_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      form_type TEXT NOT NULL DEFAULT 'aoyama-student',
      status TEXT NOT NULL DEFAULT 'pending',
      metadata JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // 旧スキーマからの移行: metadata カラムが無い場合に追加
  await query(`
    ALTER TABLE join_requests
    ADD COLUMN IF NOT EXISTS metadata JSONB
  `);

  // 旧スキーマとの互換性維持: 更新系エンドポイントで必要な列を補完
  await query(`
    ALTER TABLE join_requests
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
  `);

  await query(`
    ALTER TABLE join_requests
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
  `);

  // ON CONFLICT (email) のために UNIQUE インデックスが必要
  await query(`
    CREATE UNIQUE INDEX IF NOT EXISTS join_requests_email_unique
    ON join_requests(email)
  `);

  // university_name カラムの追加（既存テーブルへの移行）
  await query(`
    ALTER TABLE join_requests
    ADD COLUMN IF NOT EXISTS university_name TEXT NULL
  `);
}

export async function ensureJoinRequestOtpsTableExists(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS join_request_otps (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      join_request_id UUID NOT NULL REFERENCES join_requests(id) ON DELETE CASCADE,
      otp_hash TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      expires_at TIMESTAMP NOT NULL,
      used_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_join_request_otps_join_request_id
    ON join_request_otps(join_request_id)
  `);
}
