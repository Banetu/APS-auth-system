import type { NextRequest } from 'next/server';

export function getBaseUrl(request?: NextRequest): string {
  if (request) {
    const url = new URL(request.url);
    return url.origin;
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
}

export function getAuthCallbackUrl(returnUrl?: string): string {
  const baseUrl = getBaseUrl();
  return returnUrl ? `${baseUrl}${returnUrl}` : `${baseUrl}/`;
}

export function buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(path, getBaseUrl());
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  
  return url.toString();
}
