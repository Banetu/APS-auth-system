import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { query, ensureJoinRequestsTableExists } = await import('@/lib/db');
    await ensureJoinRequestsTableExists();
    const result = await query(
      `SELECT id, email, name, form_type, status, metadata, university_name, created_at, updated_at
       FROM join_requests
       ORDER BY created_at DESC
       LIMIT 100`
    );
    return NextResponse.json({
      data: result.rows,
      count: result.rowCount ?? 0,
      status: 'ok',
    });
  } catch (error) {
    console.error('Failed to fetch join requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch join requests', data: [], count: 0 },
      { status: 500 }
    );
  }
}
