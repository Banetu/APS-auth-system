import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ensureJoinRequestsTableExists, query } from "@/lib/db";

const AOYAMA_DOMAIN = "aoyama.ac.jp";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const loggedInEmail = session?.user?.email?.trim().toLowerCase();

    const body = (await request.json()) as { joinRequestId?: string };
    const joinRequestId = body.joinRequestId?.trim();

    if (!joinRequestId) {
      return NextResponse.json({ error: "joinRequestId が必要です" }, { status: 400 });
    }

    await ensureJoinRequestsTableExists();

    const existing = await query(
      `SELECT email
       FROM join_requests
       WHERE id = $1`,
      [joinRequestId]
    );

    const requestedEmail = String(existing.rows?.[0]?.email ?? "").trim().toLowerCase();

    if (!requestedEmail) {
      return NextResponse.json({ error: "join request が見つかりません" }, { status: 404 });
    }

    if (!requestedEmail.endsWith(`@${AOYAMA_DOMAIN}`)) {
      return NextResponse.json(
        { error: "@aoyama.ac.jp ドメインのアカウントのみ認証可能です" },
        { status: 403 }
      );
    }

    if (!loggedInEmail) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    if (!loggedInEmail.endsWith(`@${AOYAMA_DOMAIN}`)) {
      return NextResponse.json(
        {
          error: "@aoyama.ac.jp ドメインのアカウントのみ認証可能です",
        },
        { status: 403 }
      );
    }

    const result = await query(
      `UPDATE join_requests
       SET status = 'verified',
           updated_at = NOW(),
           metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('verified_by_google_email', $2::text)
       WHERE id = $1
       RETURNING id, email, name`,
      [joinRequestId, loggedInEmail]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ error: "join request が見つかりません" }, { status: 404 });
    }

    // LINEグループ招待リンクをメールで送信
    const { email: recipientEmail, name: recipientName } = result.rows[0];
    const lineInviteUrl = process.env.LINE_INVITE_URL || process.env.NEXT_PUBLIC_LINE_INVITE_URL || "";
    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@aoyamapiano.com";

    if (brevoApiKey && recipientEmail) {
      try {
        const mailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": brevoApiKey,
          },
          body: JSON.stringify({
            sender: { email: senderEmail },
            to: [{ email: recipientEmail, name: recipientName || recipientEmail }],
            subject: "【APS】本入会完了のお知らせ",
            htmlContent: `
              <p>${recipientName || recipientEmail}さん</p>
              <p>青山学院大学メールアドレスによるGoogle認証が完了し、本入会が完了しました。</p>
              ${lineInviteUrl
                ? `<p>以下のリンクからLINEグループに参加してください。</p><p><a href="${lineInviteUrl}">${lineInviteUrl}</a></p>`
                : "<p>LINE招待リンクは別途ご案内します。</p>"
              }
            `,
          }),
        });
        if (!mailRes.ok) {
          console.error("Brevo completion mail error:", mailRes.status, await mailRes.text());
        }
      } catch (mailErr) {
        console.error("Failed to send completion email:", mailErr);
      }
    }

    return NextResponse.json({ status: "success", joined: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Join domain verify error:", error);
    return NextResponse.json({ error: `認証完了処理に失敗しました: ${msg}` }, { status: 500 });
  }
}
