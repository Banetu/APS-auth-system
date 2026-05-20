const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';

export async function sendLineNotification(message: string): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const recipientId = process.env.LINE_NOTIFY_RECIPIENT_ID;

  if (!token || !recipientId) {
    console.warn('[LINE] LINE_CHANNEL_ACCESS_TOKEN または LINE_NOTIFY_RECIPIENT_ID が未設定です。通知をスキップします。');
    return;
  }

  try {
    const res = await fetch(LINE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: recipientId,
        messages: [{ type: 'text', text: message }],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('[LINE] 通知送信失敗:', res.status, body);
    }
  } catch (err) {
    console.error('[LINE] 通知送信エラー:', err);
  }
}
