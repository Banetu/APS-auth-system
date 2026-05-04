import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { query, ensureTablesExist, ensureJoinRequestsTableExists } = await import('@/lib/db');
    await ensureTablesExist();
    await ensureJoinRequestsTableExists();

    const [contactsRes, joinRes, joinVerifiedRes] = await Promise.all([
      query(`SELECT COUNT(*) AS total FROM contacts`),
      query(`SELECT COUNT(*) AS total FROM join_requests`),
      query(`SELECT COUNT(*) AS total FROM join_requests WHERE status = 'verified'`),
    ]);

    return NextResponse.json({
      join_requests: {
        total: parseInt(joinRes.rows[0].total, 10),
        verified: parseInt(joinVerifiedRes.rows[0].total, 10),
      },
      student_profiles: {
        total: 0,
        email_verified: 0,
      },
      contacts: {
        total: parseInt(contactsRes.rows[0].total, 10),
      },
      status: 'ok',
    });
  } catch (error) {
    console.error('Failed to fetch summary:', error);
    return NextResponse.json(
      {
        join_requests: { total: 0, verified: 0 },
        student_profiles: { total: 0, email_verified: 0 },
        contacts: { total: 0 },
        status: 'error',
      },
      { status: 500 }
    );
  }
}
