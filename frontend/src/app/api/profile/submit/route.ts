// frontend/src/app/api/profile/submit/route.ts
// プロフィール登録エンドポイント

import { createClient } from '@supabase/supabase-js';
import { sendVerificationEmail } from '@/lib/gmail';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

interface ProfileRequest {
  email: string;
  name: string;
  furigana?: string;
  affiliation?: string;
  phone_number?: string;
  newsletter_subscribed?: boolean;
}

function validateProfile(profile: ProfileRequest): {
  valid: boolean;
  error?: string;
} {
  if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  if (!profile.name || profile.name.trim().length < 2) {
    return { valid: false, error: 'Invalid name' };
  }

  if (profile.phone_number) {
    if (!/^[\d\-\+\(\)\s]+$/.test(profile.phone_number)) {
      return { valid: false, error: 'Invalid phone format' };
    }
  }

  return { valid: true };
}

export async function POST(request: Request) {
  try {
    // JWT 検証
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);

    // Supabase で JWT を検証して user_id を取得
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return Response.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as ProfileRequest;

    // バリデーション
    const validation = validateProfile(body);
    if (!validation.valid) {
      return Response.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // user_profiles に INSERT or UPDATE
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(
        {
          id: user.id,
          email: body.email,
          name: body.name,
          furigana: body.furigana || null,
          affiliation: body.affiliation || null,
          phone_number: body.phone_number || null,
          newsletter_subscribed: body.newsletter_subscribed || false,
          email_verified: true,
          email_verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select();

    if (error) {
      console.error('Profile insert error:', error);

      // ユニークキー違反（メール重複）
      if (error.code === '23505') {
        return Response.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }

      return Response.json(
        { error: 'Failed to save profile' },
        { status: 500 }
      );
    }

    // 確認メール送信
    await sendVerificationEmail(
      body.email,
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}/profile/verified`
    );

    // メールログ記録
    await supabase.from('email_logs').insert({
      recipient_email: body.email,
      email_type: 'verification',
      subject: 'Verify Your Email Address',
      status: 'sent',
    });

    return Response.json(
      {
        success: true,
        message: 'Profile saved successfully',
        profile: data?.[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile submit error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
