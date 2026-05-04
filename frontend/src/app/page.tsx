'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

// ---- SVG icons ----
function IconBuilding({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<path d="M9 22V12h6v10" />
			<path d="M9 7h1m4 0h1M9 11h1m4 0h1" />
		</svg>
	);
}

function IconMail({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<rect x="2" y="4" width="20" height="16" rx="2" />
			<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
		</svg>
	);
}

function IconDashboard({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="7" height="9" rx="1" />
			<rect x="14" y="3" width="7" height="5" rx="1" />
			<rect x="14" y="12" width="7" height="9" rx="1" />
			<rect x="3" y="16" width="7" height="5" rx="1" />
		</svg>
	);
}

function IconLock({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="11" width="18" height="11" rx="2" />
			<path d="M7 11V7a5 5 0 0 1 10 0v4" />
			<circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
		</svg>
	);
}

export default function Home() {
	const { data: session, status } = useSession();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto px-6 py-14">

				{/* タイトル */}
				<div className="mb-3">
					<h1 className="text-2xl font-bold text-gray-900">入会フォーム</h1>
					<p className="mt-1 text-sm text-gray-500">青山ピアノソサイエティ（APS）へのご入会はこちらからどうぞ。</p>
				</div>

				{/* お知らせ */}
				<div className="mb-10 rounded-xl bg-white border border-gray-200 px-5 py-3 text-sm text-gray-600 shadow-sm">
					ご不明点やバグ報告がございましたら、
					<Link href="/contact" className="text-teal-600 hover:underline mx-1">お問い合わせページ</Link>
					をご利用ください。
				</div>

				{/* 3カラム カード */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

					{/* 在学生カード */}
					<Link href="/join/form/aoyama-student" className="group">
						<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col hover:shadow-md hover:border-teal-200 transition">
							<div className="flex items-start justify-between mb-5">
								<div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
									<IconBuilding className="w-6 h-6" />
								</div>
								<span className="text-gray-300 group-hover:text-teal-400 transition text-xl leading-none">›</span>
							</div>
							<h2 className="text-lg font-bold text-gray-900 mb-1">在学生</h2>
							<p className="text-sm text-gray-500 flex-1">
								青山学院大学に現在在学中の方向けです。学内メールで承認を行います。
							</p>
							<div className="mt-5">
								<span className="inline-block rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600 group-hover:border-teal-300 group-hover:text-teal-700 transition">
									青山学院大学
								</span>
							</div>
						</div>
					</Link>

					{/* お問い合わせカード */}
					<Link href="/contact" className="group">
						<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col hover:shadow-md hover:border-blue-200 transition">
							<div className="flex items-start justify-between mb-5">
								<div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
									<IconMail className="w-6 h-6" />
								</div>
								<span className="text-gray-300 group-hover:text-blue-400 transition text-xl leading-none">›</span>
							</div>
							<h2 className="text-lg font-bold text-gray-900 mb-1">お問い合わせ</h2>
							<p className="text-sm text-gray-500 flex-1">
								ご質問やご不明な点がある場合は、こちらからお問い合わせください。
							</p>
							<div className="mt-5">
								<span className="inline-block rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600 group-hover:border-blue-300 group-hover:text-blue-700 transition">
									お問い合わせフォーム
								</span>
							</div>
						</div>
					</Link>

					{/* ダッシュボード or ログインカード */}
					{status !== 'loading' && (
						session ? (
							<Link href="/dashboard" className="group">
								<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col hover:shadow-md hover:border-purple-200 transition">
									<div className="flex items-start justify-between mb-5">
										<div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
											<IconDashboard className="w-6 h-6" />
										</div>
										<span className="text-gray-300 group-hover:text-purple-400 transition text-xl leading-none">›</span>
									</div>
									<h2 className="text-lg font-bold text-gray-900 mb-1">ダッシュボード</h2>
									<p className="text-sm text-gray-500 flex-1">
										入会リクエストや学生プロフィールの一覧を確認・管理します。
									</p>
									<div className="mt-5">
										<span className="inline-block rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600 group-hover:border-purple-300 group-hover:text-purple-700 transition">
											管理者
										</span>
									</div>
								</div>
							</Link>
						) : (
							<Link href="/login" className="group">
								<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col hover:shadow-md hover:border-gray-400 transition">
									<div className="flex items-start justify-between mb-5">
										<div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
											<IconLock className="w-6 h-6" />
										</div>
										<span className="text-gray-300 group-hover:text-gray-500 transition text-xl leading-none">›</span>
									</div>
									<h2 className="text-lg font-bold text-gray-900 mb-1">管理者ログイン</h2>
									<p className="text-sm text-gray-500 flex-1">
										管理画面にアクセスするにはログインが必要です。
									</p>
									<div className="mt-5">
										<span className="inline-block rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600 group-hover:border-gray-400 group-hover:text-gray-800 transition">
											ログイン
										</span>
									</div>
								</div>
							</Link>
						)
					)}

				</div>

				{/* フッター */}
				<p className="mt-14 text-center text-xs text-gray-400">
					© 2026 Aoyama Piano Society (APS). All rights reserved.
				</p>
			</div>
		</div>
	);
}

