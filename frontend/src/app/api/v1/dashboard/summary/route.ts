import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    contacts: 0,
    join_requests: 0,
    student_profiles: 0,
    status: 'ok'
  });
}
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Always return 200 OK with mock data - no database connectivity attempt
  return NextResponse.json({
    contacts: 0,
    join_requests: 0,
    student_profiles: 0,
    status: 'ok',
    timestamp: new Date().toISOString()
  }, { status: 200 });
}
