'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
	const { data: session, status } = useSession();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="max-w-6xl mx-auto px-4 py-16">
				{/* ヘッダーセクション */}
				<div className="text-center mb-12">
					<h1 className="text-5xl font-bold text-gray-900 mb-4">
						APS 認証システムへようこそ
					</h1>
					<p className="text-xl text-gray-600 mb-8">
						青山ピアノソサイエティ（APS）メンバーシップ管理システム
					</p>
				</div>

				{/* ユーザー状態表示 */}
				{status === 'loading' ? (
					<div className="text-center mb-8">
						<p className="text-gray-600">ロード中...</p>
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-lg p-6 mb-12 text-center">
						{session ? (
							<div>
								<p className="text-gray-700 mb-4">
									<span className="font-semibold">ログイン中:</span> {session.user?.email}
								</p>
								<p className="text-green-600 font-semibold">✓ 認証されています</p>
							</div>
						) : (
							<p className="text-gray-600">ログインして詳細情報を表示します</p>
						)}
					</div>
				)}

				{/* メインコンテンツグリッド */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
					{/* 入会ページ */}
				<Link href="/join/form/aoyama-student">
						<div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 p-8 cursor-pointer h-full">
							<div className="text-center">
								<div className="text-5xl mb-4">📝</div>
								<h2 className="text-2xl font-bold text-gray-900 mb-3">
									新規入会
								</h2>
								<p className="text-gray-600 mb-4">
									新しいメンバーとして入会します。メール認証とOTP認証を行います。
								</p>
								<div className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition">
									入会フォームへ →
								</div>
							</div>
						</div>
					</Link>

					{/* お問い合わせページ */}
					<Link href="/contact">
						<div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 p-8 cursor-pointer h-full">
							<div className="text-center">
								<div className="text-5xl mb-4">💬</div>
								<h2 className="text-2xl font-bold text-gray-900 mb-3">
									お問い合わせ
								</h2>
								<p className="text-gray-600 mb-4">
									ご質問やご不明な点がある場合は、こちらからお問い合わせください。
								</p>
								<div className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition">
									お問い合わせへ →
								</div>
							</div>
						</div>
					</Link>

					{/* ダッシュボード（ログイン時のみ） */}
					{session && (
						<Link href="/dashboard">
							<div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 p-8 cursor-pointer h-full">
								<div className="text-center">
									<div className="text-5xl mb-4">📊</div>
									<h2 className="text-2xl font-bold text-gray-900 mb-3">
										ダッシュボード
									</h2>
									<p className="text-gray-600 mb-4">
										入会リクエストと学生プロフィールの一覧を閲覧できます。
									</p>
									<div className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded transition">
										ダッシュボードへ →
									</div>
								</div>
							</div>
						</Link>
					)}

					{/* ログインページ（未ログイン時のみ） */}
					{!session && status !== 'loading' && (
						<Link href="/login">
							<div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 p-8 cursor-pointer h-full">
								<div className="text-center">
									<div className="text-5xl mb-4">🔐</div>
									<h2 className="text-2xl font-bold text-gray-900 mb-3">
										管理画面
									</h2>
									<p className="text-gray-600 mb-4">
										ログインして管理画面や詳細情報にアクセスします。
									</p>
									<div className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded transition">
										ログインへ →
									</div>
								</div>
							</div>
						</Link>
					)}
				</div>

				{/* 説明セクション */}
				<div className="bg-white rounded-lg shadow-lg p-8 mb-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
						利用可能な機能
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="text-3xl mb-3">✉️</div>
							<h3 className="font-bold text-gray-900 mb-2">メール認証</h3>
							<p className="text-gray-600 text-sm">
								安全なメールアドレス検証とOTP認証プロセス
							</p>
						</div>
						<div className="text-center">
							<div className="text-3xl mb-3">🔑</div>
							<h3 className="font-bold text-gray-900 mb-2">Google OAuth</h3>
							<p className="text-gray-600 text-sm">
								Google アカウントを使用したシンプルなログイン
							</p>
						</div>
						<div className="text-center">
							<div className="text-3xl mb-3">📱</div>
							<h3 className="font-bold text-gray-900 mb-2">レスポンシブ対応</h3>
							<p className="text-gray-600 text-sm">
								PC・タブレット・スマートフォン対応
							</p>
						</div>
					</div>
				</div>

				{/* フッター */}
				<div className="text-center text-gray-600">
					<p className="text-sm">
						© 2026 Aoyama Postgraduate Society (APS). All rights reserved.
					</p>
				</div>
			</div>
		</div>
	);
}
