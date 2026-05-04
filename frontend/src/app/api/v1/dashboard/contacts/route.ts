import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { query, ensureTablesExist } = await import('@/lib/db');
    await ensureTablesExist();
    const result = await query(
      `SELECT id, email, name, subject, affiliation, message, created_at
       FROM contacts
       ORDER BY created_at DESC
       LIMIT 100`
    );
    return NextResponse.json({
      data: result.rows,
      count: result.rowCount ?? 0,
      status: 'ok',
    });
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts', data: [], count: 0 },
      { status: 500 }
    );
  }
}
