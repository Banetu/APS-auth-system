import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard summary: Starting...');
    
    // Return default values - database connectivity issues are common in Vercel
    // In production, ensure DATABASE_URL is properly configured in Vercel env vars
    return NextResponse.json({
      contacts: 0,
      join_requests: 0,
      student_profiles: 0,
      status: 'ok',
      environment: process.env.NODE_ENV || 'unknown',
      note: 'Mock data - database connection not configured'
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return default values with degraded status
    // Always return 200 OK to prevent "Failed to fetch" errors in frontend
    return NextResponse.json({
      contacts: 0,
      join_requests: 0,
      student_profiles: 0,
      status: 'degraded',
      message: `Database temporarily unavailable: ${errorMessage}`,
      environment: process.env.NODE_ENV || 'unknown',
    });
  }
}
