import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return empty array - database connectivity issues are common in Vercel
    return NextResponse.json({
      data: [],
      status: 'ok',
      count: 0,
      environment: process.env.NODE_ENV || 'unknown',
      note: 'Mock data - database connection not configured'
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
    });
  }
}
