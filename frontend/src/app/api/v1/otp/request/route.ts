import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomInt } from 'crypto';
import { promises as dnsPromises } from 'dns';

let pool: any = null;

async function resolveHost(url: string): Promise<string> {
  try {
    const match = url.match(/^(postgresql:\/\/[^@]+@)([^:/[\]]+)(:\d+\/.*)?$/);
    if (!match) return url;
    const addrs = await dnsPromises.resolve6(match[2]);
    if (addrs && addrs.length > 0) return `${match[1]}[${addrs[0]}]${match[3] || ':5432/postgres'}`;
  } catch {}
  return url;
}

async function getPool(): Promise<any> {
  if (!pool) {
    const { Pool } = require('pg');
    const connectionString = await resolveHost(process.env.DATABASE_URL || '');
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 2,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
  return (await getPool()).query<T>(text, params);
}

async function ensureJoinRequestsTableExists(): Promise<void> {
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

  await query(`
    ALTER TABLE join_requests
    ADD COLUMN IF NOT EXISTS metadata JSONB
  `);
}

async function ensureJoinRequestOtpsTableExists(): Promise<void> {
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

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      name?: string;
      form_type?: string;
      metadata?: Record<string, unknown>;
    };

    const email = body.email?.trim();
    const name = body.name?.trim();
    const formType = body.form_type?.trim() || 'aoyama-student';

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name' },
        { status: 400 }
      );
    }

    await ensureJoinRequestsTableExists();
    await ensureJoinRequestOtpsTableExists();

    const existing = await query<{ id: string }>(
      `SELECT id FROM join_requests WHERE email = $1 LIMIT 1`,
      [email]
    );

    let joinRequestId = existing.rows[0]?.id;

    if (joinRequestId) {
      await query(
        `UPDATE join_requests
         SET name = $2,
             form_type = $3,
             status = 'pending',
             metadata = $4,
             updated_at = NOW()
         WHERE id = $1`,
        [joinRequestId, name, formType, body.metadata ? JSON.stringify(body.metadata) : null]
      );
    } else {
      const joinRequestResult = await query<{ id: string }>(
        `INSERT INTO join_requests (email, name, form_type, status, metadata)
         VALUES ($1, $2, $3, 'pending', $4)
         RETURNING id`,
        [email, name, formType, body.metadata ? JSON.stringify(body.metadata) : null]
      );
      joinRequestId = joinRequestResult.rows[0]?.id;
    }

    if (!joinRequestId) {
      throw new Error('Failed to create join request');
    }

    const otp = randomInt(100000, 1000000).toString();
    const otpHash = createHash('sha256').update(otp).digest('hex');
    const expiresInSeconds = 600;

    await query(
      `INSERT INTO join_request_otps (join_request_id, otp_hash, attempts, expires_at)
       VALUES ($1, $2, 0, NOW() + INTERVAL '10 minutes')`,
      [joinRequestId, otpHash]
    );

    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@aoyamapiano.sakura.ne.jp';

    if (!brevoApiKey) {
      return NextResponse.json({ error: 'BREVO_API_KEY is not configured' }, { status: 500 });
    }

    const mailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify({
        sender: { email: senderEmail },
        to: [{ email, name }],
        subject: '【APS】ワンタイムパスワード',
        htmlContent: `
          <p>${name}さん</p>
          <p>入会手続きのワンタイムパスワードをお送りします。</p>
          <p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${otp}</p>
          <p>有効期限は10分です。</p>
        `,
      }),
    });

    if (!mailRes.ok) {
      const errorText = await mailRes.text();
      console.error('Brevo OTP mail error:', mailRes.status, errorText);
      return NextResponse.json(
        { error: 'Failed to send OTP email', details: errorText },
        { status: 502 }
      );
    }

    const devOtp = process.env.NODE_ENV !== 'production' ? otp : undefined;

    return NextResponse.json({
      status: 'success',
      joinRequestId,
      expiresInSeconds,
      ...(devOtp ? { devOtp } : {}),
    });
  } catch (error) {
    console.error('OTP request error:', error);
    return NextResponse.json(
      { error: 'Failed to request OTP', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
