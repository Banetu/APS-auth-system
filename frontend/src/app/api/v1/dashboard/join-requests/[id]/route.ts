import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const body = (await request.json()) as { status?: string };
    if (body.status !== 'verified') {
      return NextResponse.json({ error: 'Only status "verified" is supported' }, { status: 400 });
    }

    const { query } = await import('@/lib/db');

    const result = await query(
      `UPDATE join_requests
       SET status = 'verified', updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, name`,
      [id]
    );

    if ((result.rowCount ?? 0) === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    const { email: recipientEmail, name: recipientName } = result.rows[0];
    const lineInviteUrl = process.env.LINE_INVITE_URL || process.env.NEXT_PUBLIC_LINE_INVITE_URL || '';
    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@aoyamapiano.com';

    if (brevoApiKey && recipientEmail) {
      try {
        const mailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': brevoApiKey,
          },
          body: JSON.stringify({
            sender: { email: senderEmail },
            to: [{ email: recipientEmail, name: recipientName || recipientEmail }],
            subject: '【APS】本入会完了のお知らせ',
            htmlContent: `
              <p>${recipientName || recipientEmail}さん</p>
              <p>入会申請の確認が完了し、本入会が完了しました。</p>
              ${lineInviteUrl
                ? `<p>以下のリンクからLINEグループに参加してください。</p><p><a href="${lineInviteUrl}">${lineInviteUrl}</a></p>`
                : '<p>LINE招待リンクは別途ご案内します。</p>'
              }
            `,
          }),
        });
        if (!mailRes.ok) {
          console.error('Brevo mail error:', mailRes.status, await mailRes.text());
        }
      } catch (mailErr) {
        console.error('Failed to send completion email:', mailErr);
      }
    }

    return NextResponse.json({ status: 'ok', verified: id });
  } catch (error) {
    console.error('Failed to verify join request:', error);
    return NextResponse.json(
      { error: 'Failed to verify join request', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const { query } = await import('@/lib/db');

    // OTP レコードも CASCADE で削除されるが念のため先に削除
    await query(`DELETE FROM join_request_otps WHERE join_request_id = $1`, [id]);
    const result = await query(
      `DELETE FROM join_requests WHERE id = $1 RETURNING id`,
      [id]
    );

    if ((result.rowCount ?? 0) === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 'ok', deleted: id });
  } catch (error) {
    console.error('Failed to delete join request:', error);
    return NextResponse.json(
      { error: 'Failed to delete join request', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
