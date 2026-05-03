import { NextRequest, NextResponse } from 'next/server';
import { query, ensureTablesExist } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // テーブルが存在することを確認
    await ensureTablesExist();

    // 入会リクエストを取得（最新100件）
    const result = await query(
      'SELECT id, email, name, form_type, status, created_at FROM join_requests ORDER BY created_at DESC LIMIT 100'
    );

    return NextResponse.json({
      data: result.rows,
      status: 'ok',
      count: result.rows.length,
      environment: process.env.NODE_ENV || 'unknown',
    });
  } catch (error) {
    console.error('Dashboard join-requests error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return empty array with degraded status
    return NextResponse.json({
      data: [],
      status: 'degraded',
      message: `Database temporarily unavailable: ${errorMessage}`,
      count: 0,
      environment: process.env.NODE_ENV || 'unknown',
    }, { status: 200 });
  }
}
