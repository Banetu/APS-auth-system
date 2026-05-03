import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Always return 200 OK with empty array - no database connectivity attempt
  return NextResponse.json({
    data: [],
    count: 0,
    status: 'ok',
    timestamp: new Date().toISOString()
  }, { status: 200 });
}
