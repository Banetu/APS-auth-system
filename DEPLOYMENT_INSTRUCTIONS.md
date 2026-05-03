# 本番環境デプロイ - 実行手順書

**対象**: Vercel 本番環境へのダッシュボード実装のデプロイ  
**前提条件**: GitHub にプッシュ済み、Vercel に接続済み

---

## ✅ デプロイ前チェックリスト

### ローカル環境での確認（既に完了）
- [x] npm run dev で開発サーバー起動成功
- [x] GET /api/v1/health → 200 OK
- [x] GET /api/v1/dashboard/summary → 200 OK
- [x] GET /api/v1/dashboard/contacts → 200 OK
- [x] ダッシュボード UI ログイン画面表示確認
- [x] GitHub に全コードプッシュ完了

---

## 🚀 本番環境デプロイ手順

### ステップ 1: Supabase ANON キーを取得

**ブラウザで Supabase Studio を開く**
```
URL: https://app.supabase.com
```

**プロジェクト設定に移動**
```
1. プロジェクト選択 (APS-auth-system のプロジェクト)
2. 左側メニュー → "Settings" クリック
3. "API" セクションを探す
4. "Project API keys" セクションで "anon" キー横の "Copy" をクリック
```

**キーの例（実際のキーをコピーしてください）**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（長いトークン）
```

---

### ステップ 2: Vercel に環境変数を追加

**Vercel ダッシュボードにアクセス**
```
URL: https://vercel.com/dashboard
```

**プロジェクト設定を開く**
```
1. "APS-auth-system" プロジェクトをクリック
2. "Settings" タブをクリック
3. 左側メニューで "Environment Variables" をクリック
```

**新しい環境変数を追加**
```
変数名: SUPABASE_ANON_KEY
値: （ステップ1でコピーしたキーを貼り付け）
Environment: Production, Preview, Development (All) を選択
```

**保存**
```
"Save" または "Add" ボタンをクリック
```

---

### ステップ 3: デプロイの自動開始

**Vercel が自動デプロイを開始します**
```
1. GitHub にプッシュされたコードが検出される
2. Vercel が自動的にビルドとデプロイを開始
3. 約 2-5分で デプロイが完了
```

**デプロイの進行状況を確認**
```
Vercel ダッシュボード → Deployments タブ
最新のデプロイが「Running」→「Ready」に変わるまで待機
```

---

### ステップ 4: 本番環境をテスト

**ヘルスチェック API をテスト**
```bash
curl https://aps-auth-system.vercel.app/api/v1/health
```

**期待される応答**
```json
{
  "status": "ok",
  "database": "connected",
  "server_time": "2026-05-03T...",
  "duration_ms": 500
}
```

**ブラウザでダッシュボードアクセス**
```
URL: https://aps-auth-system.vercel.app/dashboard
→ ログイン画面が表示されることを確認
```

**その他のエンドポイントをテスト**
```bash
# 統計情報
curl https://aps-auth-system.vercel.app/api/v1/dashboard/summary

# 連絡先一覧
curl https://aps-auth-system.vercel.app/api/v1/dashboard/contacts

# 入会申請一覧
curl https://aps-auth-system.vercel.app/api/v1/dashboard/join-requests
```

---

## ❌ トラブルシューティング

### "Failed to fetch" エラーが表示される場合

**原因**: Supabase ANON キーが設定されていない

**解決方法**:
```
1. Vercel に SUPABASE_ANON_KEY が設定されているか確認
2. キーが正しくコピーされたか再確認
3. キーに余分なスペースがないか確認
4. ページをリロード（Ctrl+F5）
5. 5分待機後、再度テスト
```

### "503 Service Unavailable" エラーが表示される場合

**原因**: Vercel がまだデプロイ中、または Supabase に接続できていない

**解決方法**:
```
1. Vercel のデプロイが完了しているか確認（"Ready" 状態か確認）
2. Supabase ダッシュボードでデータベースが稼働中か確認
3. DATABASE_URL 環境変数が設定されているか確認
4. 5-10分待機後、再度テスト
```

### ログイン画面が表示されない場合

**原因**: NextAuth セッション設定の問題

**解決方法**:
```
1. NEXTAUTH_SECRET が Vercel に設定されているか確認
2. NEXTAUTH_URL が正しく設定されているか確認
3. ブラウザキャッシュをクリア（Ctrl+Shift+Delete）
4. ページをリロード
```

---

## ✅ デプロイ完了後の確認項目

- [ ] ヘルスチェック API が 200 OK を返す
- [ ] ダッシュボードページがログイン画面を表示
- [ ] 統計 API が JSON を返す
- [ ] 連絡先一覧 API が JSON 配列を返す
- [ ] 入会申請一覧 API が JSON 配列を返す
- [ ] 学生プロフィール API が JSON 配列を返す
- [ ] エラーログに "Failed to fetch" がない

---

## 📊 本番環境 URL

```
メインサイト: https://aps-auth-system.vercel.app
ダッシュボード: https://aps-auth-system.vercel.app/dashboard
ログインページ: https://aps-auth-system.vercel.app/login
```

---

## 🎯 成功の指標

✅ **すべてのエンドポイントが 200 OK を返す**
✅ **ダッシュボードがログイン画面を表示**
✅ **エラーログに「Failed to fetch」がない**
✅ **データベースから統計情報が取得できる**

---

## 📞 問題が解決しない場合

1. **Vercel ログを確認**
   ```
   Vercel Dashboard → Deployments → Latest Deployment → Logs
   ```

2. **Supabase 接続確認**
   ```
   Supabase Dashboard → Database → Connection Status
   ```

3. **GitHub コードを確認**
   ```
   最新コミット: 51153147
   ファイル: frontend/src/app/api/v1/* が実装済みか確認
   ```

---

**完成度**: 100% デプロイ準備完了  
**実装日**: 2026年5月3日  
**ステータス**: 🚀 本番環境にデプロイ可能
