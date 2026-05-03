import { NextRequest, NextResponse } from 'next/server';

/**
 * デバッグエンドポイント：環境変数を確認
 * 本番環境でエラーが出ている場合の診断用
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Environment variables debug endpoint',
    env: {
      DATABASE_URL: process.env.DATABASE_URL
        ? `postgresql://postgres:***@${new URL(process.env.DATABASE_URL).hostname}:5432/postgres`
        : 'NOT SET',
      BREVO_API_KEY: process.env.BREVO_API_KEY ? '***set***' : 'NOT SET',
      SENDER_EMAIL: process.env.SENDER_EMAIL || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
    },
  });
}
