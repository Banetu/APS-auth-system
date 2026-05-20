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

    const body = (await request.json()) as {
      status?: string;
      profile?: {
        name?: string;
        university_name?: string;
        metadata?: Record<string, unknown>;
      };
    };

    const { query } = await import('@/lib/db');

    // 現在のレコードを取得（ステータス確認用）
    const current = await query(
      `SELECT id, email, name, status FROM join_requests WHERE id = $1`,
      [id]
    );
    if ((current.rowCount ?? 0) === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    const currentStatus = String(current.rows[0].status ?? '');

    // プロフィール更新
    if (body.profile !== undefined) {
      const { name, university_name, metadata } = body.profile;
      const setClauses: string[] = [];
      const values: unknown[] = [];
      let p = 1;

      if (name !== undefined) { setClauses.push(`name = $${p++}`); values.push(name); }
      if (university_name !== undefined) { setClauses.push(`university_name = $${p++}`); values.push(university_name); }
      if (metadata !== undefined) {
        setClauses.push(`metadata = COALESCE(metadata, '{}'::jsonb) || $${p++}::jsonb`);
        values.push(JSON.stringify(metadata));
      }
      if (setClauses.length === 0) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
      }
      setClauses.push('updated_at = NOW()');
      values.push(id);

      await query(
        `UPDATE join_requests SET ${setClauses.join(', ')} WHERE id = $${p}`,
        values
      );
      return NextResponse.json({ status: 'ok', updated: id });
    }

    // ステータス更新
    if (body.status !== 'verified' && body.status !== 'member') {
      return NextResponse.json(
        { error: 'Only status "verified" or "member" is supported' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE join_requests
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, email, name`,
      [body.status, id]
    );

    if ((result.rowCount ?? 0) === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    const { email: recipientEmail, name: recipientName } = result.rows[0];

    // memberステータスからの変更、またはmemberへの変更はメール送信しない
    const shouldSendEmail = body.status === 'verified' && currentStatus !== 'member';

    if (shouldSendEmail) {
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
