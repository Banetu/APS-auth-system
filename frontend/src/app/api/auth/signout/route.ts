// 役割: サインアウト

import { handlers } from "@/auth";

// NextAuth の signOut() は POST /api/auth/signout を使う。
// 独自ルートが catch-all より優先されるため、NextAuth のハンドラをここで再エクスポートする。
export const { GET, POST } = handlers;
