import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomInt } from 'crypto';
import {
  ensureJoinRequestOtpsTableExists,
  ensureJoinRequestsTableExists,
  query,
} from '@/lib/db';

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
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@aoyamapiano.com';

    if (brevoApiKey) {
      await fetch('https://api.brevo.com/v3/smtp/email', {
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
    }

    return NextResponse.json({
      status: 'success',
      joinRequestId,
      expiresInSeconds,
    });
  } catch (error) {
    console.error('OTP request error:', error);
    return NextResponse.json({ error: 'Failed to request OTP' }, { status: 500 });
  }
}
