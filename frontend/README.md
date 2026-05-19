# Frontend Dependency Policy

## 目的
このプロジェクトでは、認証基盤の整合性を優先し、`next-auth` v5 系を前提として依存を管理します。

## 現在の方針
- `npm audit` で残る 3 件（2 low, 1 moderate）は当面許容します。
- 上記 3 件は `nodemailer` 由来です。
- `npm audit fix --force` は使用しません。

## 理由
- `npm audit fix --force` により、`next-auth` が破壊的に変更される可能性があります。
- 過去に `next-auth` が 1 系へ意図せずダウングレードし、認証実装との不整合とビルド障害を引き起こしました。

## 運用ルール
- 定常確認:
	- `npm audit --omit=dev`
	- `npm ls next-auth nodemailer --depth=0`
- 禁止:
	- `npm audit fix --force`
- 依存更新時は、更新後に必ず `npm run build` を実行し、認証フローを確認します。

## 許容の見直し条件
- `next-auth` v5 系と整合する `nodemailer` の安全な更新先が利用可能になった場合
- 既存のメール送信機能を別実装へ移行できた場合

## 障害時の復旧メモ
依存が崩れた場合は以下で再生成します。

```powershell
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
npm run build
```
