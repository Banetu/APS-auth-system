import { NextRequest, NextResponse } from 'next/server';
import { query, ensureJoinRequestsTableExists } from '@/lib/db';

interface JoinRequestBody {
  email: string;
  name: string;
  form_type: string;
  metadata?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as JoinRequestBody;
    const { email, name, form_type, metadata } = body;

    if (!email || !name || !form_type) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, form_type' },
        { status: 400 }
      );
    }

    await ensureJoinRequestsTableExists();

    const result = await query(
      `INSERT INTO join_requests (email, name, form_type, status, metadata)
       VALUES ($1, $2, $3, 'pending', $4)
       RETURNING id, email, name, form_type, status, metadata, created_at`,
      [email, name, form_type, metadata ? JSON.stringify(metadata) : null]
    );

    return NextResponse.json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Join request submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit join request' },
      { status: 500 }
    );
  }
}
