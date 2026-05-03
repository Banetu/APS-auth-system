import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { query, ensureTablesExist } from '@/lib/db';

interface ContactRequest {
  email: string;
  name: string;
  subject?: string;
  affiliation?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    // リクエストボディを解析
    const body = (await request.json()) as ContactRequest;
    const { email, name, subject, affiliation, message } = body;

    // バリデーション
    if (!email || !name || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, message' },
        { status: 400 }
      );
    }

    // テーブルが存在することを確認
    await ensureTablesExist();

    // UUID を生成
    const id = randomUUID();

    // データベースに保存
    const result = await query(
      `INSERT INTO contacts (id, email, name, subject, affiliation, message)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, name, subject, affiliation, message, created_at`,
      [id, email, name, subject || null, affiliation || null, message]
    );

    const contact = result.rows[0];

    // Brevo でメール送信
    try {
      const brevoApiKey = process.env.BREVO_API_KEY;
      const senderEmail = process.env.SENDER_EMAIL || 'noreply@aoyamapiano.sakura.ne.jp';

      if (brevoApiKey) {
        await axios.post(
          'https://api.brevo.com/v3/smtp/email',
          {
            sender: {
              email: senderEmail,
            },
            to: [
              {
                email: email,
                name: name,
              },
            ],
            replyTo: {
              email: senderEmail,
            },
            subject: 'お問い合わせを受け付けました',
            htmlContent: `
              <p>${name}さん</p>
              <p>お問い合わせありがとうございます。</p>
              <p>ご入力いただいた内容を確認いたしました。</p>
              <p>担当者より、追ってご連絡させていただきます。</p>
              <p>---</p>
              <p><strong>ご送信いただいた内容</strong></p>
              <p><strong>お名前:</strong> ${name}</p>
              <p><strong>メールアドレス:</strong> ${email}</p>
              ${subject ? `<p><strong>件名:</strong> ${subject}</p>` : ''}
              ${affiliation ? `<p><strong>所属:</strong> ${affiliation}</p>` : ''}
              <p><strong>メッセージ:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            `,
          },
          {
            headers: {
              'api-key': brevoApiKey,
            },
          }
        );
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // メール送信失敗でもエラーではなく続行
    }

    return NextResponse.json({
      status: 'success',
      contact_id: contact.id,
      message: 'Contact submitted successfully',
      contact,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact' },
      { status: 500 }
    );
  }
}
