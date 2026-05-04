// Stub – backend proxy is not used in this deployment
export async function fetchBackend(
  path: string,
  init?: RequestInit
): Promise<Response> {
  return new Response(JSON.stringify({ ok: false, detail: 'not implemented' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' },
  });
}
