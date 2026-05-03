// 役割: Supabase OAuth コールバック処理 (/auth/callback)

import { createSupabaseRouteClient } from "@/lib/supabaseRoute";
import { getBaseUrl } from "@/lib/url";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = '/api';

type AuthMeResponse = {
    app_role?: string;
};

async function resolvePostSignInPath(accessToken: string) {
    try {
        const meRes = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: "no-store",
        });

        if (meRes.ok) {
            const me = (await meRes.json()) as AuthMeResponse;
            if (["member", "obog", "admin"].includes(me.app_role ?? "none")) {
                return "/profile";
            }
            if (me.app_role === "pre_member") {
                return "/join";
            }
        }

        return "/non-member";
    } catch {
        return "/non-member";
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const requestedNext = searchParams.get("next") ?? "/profile";
    const next = requestedNext.startsWith("/") ? requestedNext : "/profile";
    const base = getBaseUrl(request);

    if (code) {
        const { supabase, applyCookies } = createSupabaseRouteClient(request);

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const accessToken = session?.access_token?.trim();
            const postSignInPath = accessToken
                ? await resolvePostSignInPath(accessToken)
                : "/login?error=auth_callback_error";

            const needsAccessGate = next === "/admin" || next.startsWith("/admin/");
            const relativePath = needsAccessGate ? postSignInPath : next;
            const absoluteUrl = new URL(relativePath, base).toString();
            return applyCookies(NextResponse.redirect(absoluteUrl));
        }
    }

    return NextResponse.redirect(`${base}/login?error=auth_callback_error`);
}
