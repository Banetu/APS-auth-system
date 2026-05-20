import { NextRequest, NextResponse } from 'next/server';
import { query, ensureJoinRequestsTableExists } from '@/lib/db';
import { sendLineNotification } from '@/lib/line';

interface MemberRegisterBody {
  email: string;
  name: string;
  university_name: string;
  metadata?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MemberRegisterBody;
    const { email, name, university_name, metadata } = body;

    if (!email || !name || !university_name) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, university_name' },
        { status: 400 }
      );
    }

    await ensureJoinRequestsTableExists();

    const result = await query(
      `INSERT INTO join_requests (email, name, form_type, status, metadata, university_name)
       VALUES ($1, $2, 'member-register', 'member', $3, $4)
       ON CONFLICT (email)
       DO UPDATE SET
         name = EXCLUDED.name,
         form_type = 'member-register',
         status = 'member',
         metadata = EXCLUDED.metadata,
         university_name = EXCLUDED.university_name,
         updated_at = NOW()
       RETURNING id, email, name, form_type, status, metadata, created_at`,
      [email, name, metadata ? JSON.stringify(metadata) : null, university_name]
    );

    await sendLineNotification(
      `✅ 名簿登録が完了しました\n氏名: ${name}\n大学: ${university_name}\nメール: ${email}`
    );

    return NextResponse.json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Member register error:', error);
    return NextResponse.json(
      { error: 'Failed to register member' },
      { status: 500 }
    );
  }
}
