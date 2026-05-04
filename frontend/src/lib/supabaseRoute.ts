import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { NextRequest, NextResponse } from 'next/server';
import { ResponseCookies } from 'next/dist/server/web/spec-extension/cookies';

export function createSupabaseRouteClient(request?: NextRequest) {
  const cookieMap = new Map<string, { name: string; value: string; options?: object }>();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          if (!request) return [];
          return Array.from(request.cookies.getAll());
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieMap.set(name, { name, value, options });
          });
        },
      },
    }
  );

  function applyCookies<T extends NextResponse>(response: T): T {
    cookieMap.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options as any);
    });
    return response;
  }

  return { supabase, applyCookies };
}

export async function createSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component context - can be ignored
          }
        },
      },
    }
  );
}
