// 役割: Supabase OAuth コールバック処理 (/auth/callback)

import { createSupabaseRouteClient } from "@/lib/supabaseRoute";
import { getBaseUrl } from "@/lib/url";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const base = getBaseUrl(request);

    if (code) {
        const { supabase, applyCookies } = createSupabaseRouteClient(request);

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Supabase 認証成功 → ログイン画面へ戻す
            // （NextAuth のセッション callback が自動実行され、ロール情報が確立される）
            return applyCookies(NextResponse.redirect(`${base}/login`));
        }
    }

    return NextResponse.redirect(`${base}/login?error=auth_callback_error`);
}
