import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    contacts: 0,
    join_requests: 0,
    student_profiles: 0,
    status: 'ok'
  });
}
