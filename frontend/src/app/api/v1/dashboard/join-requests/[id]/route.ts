import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const { query } = await import('@/lib/db');

    // OTP レコードも CASCADE で削除されるが念のため先に削除
    await query(`DELETE FROM join_request_otps WHERE join_request_id = $1`, [id]);
    const result = await query(
      `DELETE FROM join_requests WHERE id = $1 RETURNING id`,
      [id]
    );

    if ((result.rowCount ?? 0) === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 'ok', deleted: id });
  } catch (error) {
    console.error('Failed to delete join request:', error);
    return NextResponse.json(
      { error: 'Failed to delete join request', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
