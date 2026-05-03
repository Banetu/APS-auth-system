import { NextRequest, NextResponse } from 'next/server';
import { query, ensureTablesExist } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard summary: Starting...');
    
    // テーブルが存在することを確認
    console.log('Dashboard summary: Ensuring tables exist...');
    await ensureTablesExist();
    console.log('Dashboard summary: Tables exist');

    // 各テーブルのレコード数を取得
    console.log('Dashboard summary: Fetching counts...');
    const [contactsResult, joinRequestsResult, studentProfilesResult] = await Promise.all([
      query('SELECT COUNT(*) as count FROM contacts'),
      query('SELECT COUNT(*) as count FROM join_requests'),
      query('SELECT COUNT(*) as count FROM student_profiles'),
    ]);

    console.log('Dashboard summary: Got counts successfully');

    return NextResponse.json({
      contacts: parseInt(contactsResult.rows[0].count, 10),
      join_requests: parseInt(joinRequestsResult.rows[0].count, 10),
      student_profiles: parseInt(studentProfilesResult.rows[0].count, 10),
      status: 'ok',
      environment: process.env.NODE_ENV || 'unknown',
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return default values with degraded status instead of error
    return NextResponse.json(
      {
        contacts: 0,
        join_requests: 0,
        student_profiles: 0,
        status: 'degraded',
        message: `Database temporarily unavailable: ${errorMessage}`,
        environment: process.env.NODE_ENV || 'unknown',
      },
      { status: 200 } // Return 200 OK to allow frontend to gracefully handle
    );
  }
}
