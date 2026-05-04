import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const {
      ensureJoinRequestOtpsTableExists,
      ensureJoinRequestsTableExists,
      query,
    } = await import('@/lib/db');

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
      expires_at: string;
      used_at: string | null;
    }>(
      `SELECT id, otp_hash, attempts, expires_at, used_at
       FROM join_request_otps
       WHERE join_request_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [joinRequestId]
    );

    const otpRow = otpResult.rows[0];
    if (!otpRow) {
      return NextResponse.json({ error: 'OTP not found' }, { status: 404 });
    }
    if (otpRow.used_at) {
      return NextResponse.json({ error: 'OTP already used' }, { status: 400 });
    }
    if (new Date(otpRow.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
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
          to: [{ email: joinRow.email, name: joinRow.name }],
          subject: '【APS】本入会完了のお知らせ',
          htmlContent: `
            <p>${joinRow.name}さん</p>
            <p>ワンタイムパスワードの確認が完了し、本入会が完了しました。</p>
            ${lineInviteUrl ? `<p>以下のリンクからLINEグループに参加してください。</p><p><a href="${lineInviteUrl}">${lineInviteUrl}</a></p>` : '<p>LINE招待リンクは別途ご案内します。</p>'}
          `,
        }),
      });
    }

    return NextResponse.json({
      status: 'success',
      joined: true,
      lineInviteUrl,
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
