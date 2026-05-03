import { NextRequest, NextResponse } from 'next/server';

/**
 * Supabase REST API を使用したダッシュボード集計エンドポイント
 * pg モジュール不要で、Vercel Serverless で動作
 */
export async function GET(request: NextRequest) {
  try {
    const anonKey = process.env.SUPABASE_ANON_KEY;
    const supabaseUrl = 'https://db.xdkbfszzkckxcppevvwy.supabase.co';

    if (!anonKey) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'SUPABASE_ANON_KEY not configured',
          info: 'Please add SUPABASE_ANON_KEY to environment variables'
        },
        { status: 500 }
      );
    }

    // Parallel queries using Supabase REST API
    const [contactsRes, joinReqRes, studentRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/contacts?select=count()`, {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
        },
      }),
      fetch(`${supabaseUrl}/rest/v1/join_requests?select=count()`, {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
        },
      }),
      fetch(`${supabaseUrl}/rest/v1/student_profiles?select=count()`, {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
        },
      }),
    ]);

    if (!contactsRes.ok || !joinReqRes.ok || !studentRes.ok) {
      const errText = await Promise.all([
        contactsRes.text(),
        joinReqRes.text(),
        studentRes.text(),
      ]);
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Failed to fetch data from Supabase',
          details: errText.filter(t => t),
        },
        { status: 503 }
      );
    }

    const [contacts, joinReqs, students] = await Promise.all([
      contactsRes.json(),
      joinReqRes.json(),
      studentRes.json(),
    ]);

    return NextResponse.json({
      status: 'ok',
      contacts: contacts[0]?.count || 0,
      join_requests: joinReqs[0]?.count || 0,
      student_profiles: students[0]?.count || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Dashboard Summary] Error:', errorMsg);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: `Failed to fetch summary: ${errorMsg}` 
      },
      { status: 503 }
    );
  }
}
