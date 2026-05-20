export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  affiliation?: string;
  message: string;
}

export async function submitContact(payload: ContactPayload): Promise<void> {
  const res = await fetch('/api/v1/contact/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || '送信に失敗しました');
  }
}

export interface JoinRequestPayload {
  email: string;
  name: string;
  form_type: string;
  confirm_email?: string;
  university_name?: string;
  metadata?: Record<string, unknown>;
}

export async function submitJoinRequest(payload: JoinRequestPayload): Promise<{ id: string }> {
  const res = await fetch('/api/v1/join-requests/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || '送信に失敗しました');
  }
  const data = await res.json() as { data?: { id?: string } };
  return { id: String(data.data?.id ?? '') };
}

export async function completeJoinDomainVerification(payload: { joinRequestId: string }): Promise<{ joined: boolean }> {
  const res = await fetch('/api/v1/join-requests/verify-domain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || 'ドメイン認証に失敗しました');
  }
  const data = await res.json() as { joined?: boolean };
  return { joined: Boolean(data.joined) };
}

export interface MemberRegisterPayload {
  email: string;
  name: string;
  university_name: string;
  metadata?: Record<string, unknown>;
}

export async function registerMember(payload: MemberRegisterPayload): Promise<{ id: string }> {
  const res = await fetch('/api/v1/join-requests/member-register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || '登録に失敗しました');
  }
  const data = await res.json() as { data?: { id?: string } };
  return { id: String(data.data?.id ?? '') };
}

export async function sendOTPRequest(payload: JoinRequestPayload): Promise<{ id: string }> {
  const res = await fetch('/api/v1/otp/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const body = data as { error?: string; details?: string };
    const detailText = body.details?.trim();
    const message = body.error || '送信に失敗しました';
    throw new Error(detailText ? `${message}: ${detailText}` : message);
  }
  const data = await res.json() as { joinRequestId?: string };
  return { id: String(data.joinRequestId ?? '') };
}

export async function verifyOTP(payload: { joinRequestId: string; otp: string }): Promise<{ joined: boolean; lineInviteUrl?: string }> {
  const res = await fetch('/api/v1/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || 'OTP検証に失敗しました');
  }
  const data = await res.json() as { joined: boolean; lineInviteUrl?: string };
  return data;
}
