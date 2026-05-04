import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
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
      joinRequestId?: string;
      otp?: string;
    };

    const joinRequestId = body.joinRequestId?.trim();
    const otp = body.otp?.trim();

    if (!joinRequestId || !otp) {
      return NextResponse.json(
        { error: 'Missing required fields: joinRequestId, otp' },
        { status: 400 }
      );
    }

    await ensureJoinRequestsTableExists();
    await ensureJoinRequestOtpsTableExists();

    const otpResult = await query<{
      id: string;
      otp_hash: string;
      attempts: number;
    }>(
      `SELECT id, otp_hash, attempts, expires_at, used_at
       FROM join_request_otps
       WHERE join_request_id = $1
         AND used_at IS NULL
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [joinRequestId]
    );

    const otpRow = otpResult.rows[0];
    if (!otpRow) {
      return NextResponse.json({ error: 'OTP not found or expired' }, { status: 404 });
    }
    if (otpRow.attempts >= 5) {
      return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
    }

    const inputHash = createHash('sha256').update(otp).digest('hex');
    if (inputHash !== otpRow.otp_hash) {
      await query(
        `UPDATE join_request_otps
         SET attempts = attempts + 1, updated_at = NOW()
         WHERE id = $1`,
        [otpRow.id]
      );
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    await query(
      `UPDATE join_request_otps
       SET used_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [otpRow.id]
    );

    const joinResult = await query<{ email: string; name: string }>(
      `UPDATE join_requests
       SET status = 'verified', updated_at = NOW()
       WHERE id = $1
       RETURNING email, name`,
      [joinRequestId]
    );

    const joinRow = joinResult.rows[0];
    if (!joinRow) {
      return NextResponse.json({ error: 'Join request not found' }, { status: 404 });
    }

    const lineInviteUrl = process.env.LINE_INVITE_URL || process.env.NEXT_PUBLIC_LINE_INVITE_URL || '';
    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || 'noreply@aoyamapiano.sakura.ne.jp';

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
        to: [{ email: joinRow.email, name: joinRow.name }],
        subject: '【APS】本入会完了のお知らせ',
        htmlContent: `
          <p>${joinRow.name}さん</p>
          <p>ワンタイムパスワードの確認が完了し、本入会が完了しました。</p>
          ${lineInviteUrl ? `<p>以下のリンクからLINEグループに参加してください。</p><p><a href="${lineInviteUrl}">${lineInviteUrl}</a></p>` : '<p>LINE招待リンクは別途ご案内します。</p>'}
        `,
      }),
    });

    if (!mailRes.ok) {
      const errorText = await mailRes.text();
      console.error('Brevo completion mail error:', mailRes.status, errorText);
      return NextResponse.json(
        { error: 'Failed to send completion email', details: errorText },
        { status: 502 }
      );
    }

    return NextResponse.json({
      status: 'success',
      joined: true,
      lineInviteUrl,
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
