'use client';

import Link from 'next/link';

function IconBuilding({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<path d="M9 22V12h6v10" />
			<path d="M9 7h1m4 0h1M9 11h1m4 0h1" />
		</svg>
	);
}

function IconUserPlus({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="8.5" cy="7" r="4" />
			<line x1="20" y1="8" x2="20" y2="14" />
			<line x1="23" y1="11" x2="17" y2="11" />
		</svg>
	);
}

function IconClipboard({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
			<rect x="8" y="2" width="8" height="4" rx="1" />
			<path d="M9 12h6M9 16h6" />
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

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-5xl mx-auto px-6 py-14">
				<div className="mb-3">
					<h1 className="text-2xl font-bold text-gray-900">入会フォーム</h1>
					<p className="mt-1 text-sm text-gray-500">青山ピアノソサイエティ（APS）へのご入会はこちらからどうぞ。</p>
				</div>
				<div className="mb-4 rounded-xl bg-white border border-gray-200 px-5 py-3 text-sm text-gray-600 shadow-sm">
					ご不明点やバグ報告がございましたら、
					<Link href="/contact" className="text-teal-600 hover:underline mx-1">お問い合わせページ</Link>
					をご利用ください。
				</div>
				<div className="mb-8">
					<Link href="/guide" className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800 hover:bg-amber-100 transition font-medium">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
						初めてご利用の方へ：使い方ガイドを見る
					</Link>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

					<Link href="/join/form/aoyama-student" className="group">
						<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col hover:shadow-md hover:border-teal-200 transition">
							<div className="flex items-start justify-between mb-5">
								<div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
									<IconBuilding className="w-6 h-6" />
								</div>
								<span className="text-gray-300 group-hover:text-teal-400 transition text-xl leading-none">›</span>
							</div>
							<h2 className="text-lg font-bold text-gray-900 mb-1">在学生の入会</h2>
							<p className="text-sm text-gray-500 flex-1">青山学院大学に現在在学中の方向けです。学内メールで承認を行います。</p>
							<div className="mt-5">
								<span className="inline-block rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600 group-hover:border-teal-300 group-hover:text-teal-700 transition">青山学院大学</span>
							</div>
						</div>
					</Link>

					<Link href="/join/form/other" className="group">
						<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col hover:shadow-md hover:border-blue-200 transition">
							<div className="flex items-start justify-between mb-5">
								<div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
									<IconUserPlus className="w-6 h-6" />
								</div>
								<span className="text-gray-300 group-hover:text-blue-400 transition text-xl leading-none">›</span>
							</div>
							<h2 className="text-lg font-bold text-gray-900 mb-1">他大学の方の入会</h2>
							<p className="text-sm text-gray-500 flex-1">青山学院大学以外の大学に在学中の方向けです。</p>
							<div className="mt-5">
								<span className="inline-block rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600 group-hover:border-blue-300 group-hover:text-blue-700 transition">他大学</span>
							</div>
						</div>
					</Link>

					<Link href="/join/form/member-register" className="group">
						<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col hover:shadow-md hover:border-emerald-200 transition">
							<div className="flex items-start justify-between mb-5">
								<div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
									<IconClipboard className="w-6 h-6" />
								</div>
								<span className="text-gray-300 group-hover:text-emerald-400 transition text-xl leading-none">›</span>
							</div>
							<h2 className="text-lg font-bold text-gray-900 mb-1">加入者用の名簿登録</h2>
							<p className="text-sm text-gray-500 flex-1">すでにAPSに加入された方の名簿登録はこちらからどうぞ。</p>
							<div className="mt-5">
								<span className="inline-block rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600 group-hover:border-emerald-300 group-hover:text-emerald-700 transition">名簿登録</span>
							</div>
						</div>
					</Link>

					<Link href="/dashboard" className="group">
						<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col hover:shadow-md hover:border-purple-200 transition">
							<div className="flex items-start justify-between mb-5">
								<div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
									<IconDashboard className="w-6 h-6" />
								</div>
								<span className="text-gray-300 group-hover:text-purple-400 transition text-xl leading-none">›</span>
							</div>
							<h2 className="text-lg font-bold text-gray-900 mb-1">ダッシュボード</h2>
							<p className="text-sm text-gray-500 flex-1">入会リクエストや学生プロフィールの一覧を確認・管理します。</p>
							<div className="mt-5">
								<span className="inline-block rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600 group-hover:border-purple-300 group-hover:text-purple-700 transition">管理者</span>
							</div>
						</div>
					</Link>

				</div>
			</div>
		</div>
	);
}
