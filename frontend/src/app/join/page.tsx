import Link from "next/link";
import { Check, Plus, Mail, ChevronRight } from "lucide-react";

export default function JoinGuidePage() {
	return (
		<main className="bg-slate-50 text-slate-900 font-sans min-h-screen">

			{/* メインコンテンツ */}
			<section className="py-16 px-6">
				<div className="max-w-5xl mx-auto space-y-12">


					{/* カードグリッド */}
					<div className="grid gap-6 md:grid-cols-3">
						{/* 仮入会 */}
						<Link href="/join/form?mode=temporary" className="group">
							<div className="bg-white rounded-2xl border border-slate-100 p-8 h-full shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-emerald-200">
								<div className="flex items-start justify-between mb-4">
										<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
											<Plus className="w-6 h-6 text-emerald-600" />
										</div>
									<ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-400 transition-colors" />
								</div>
								<h3 className="text-xl font-bold text-slate-900 mb-2">仮入会（メール認証）</h3>
								<p className="text-sm text-slate-600 mb-6 leading-relaxed">
									メール認証で仮登録できます。まずはこちらを選んでください。
								</p>
								<div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">仮入会</div>
							</div>
						</Link>

						{/* 本入会 */}
						<Link href="/join/member" className="group">
							<div className="bg-white rounded-2xl border border-slate-100 p-8 h-full shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-emerald-200">
								<div className="flex items-start justify-between mb-4">
										<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
											<Check className="w-6 h-6 text-emerald-600" />
										</div>
									<ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-400 transition-colors" />
								</div>
								<h3 className="text-xl font-bold text-slate-900 mb-2">本入会（詳細フォーム）</h3>
								<p className="text-sm text-slate-600 mb-6 leading-relaxed">
									本登録用の詳細フォームです。必要書類や情報を準備してお進みください。
								</p>
								<div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">本入会</div>
							</div>
						</Link>

					

						{/* お問い合わせ */}
						<Link href="/contact" className="group">
							<div className="bg-white rounded-2xl border border-slate-100 p-8 h-full shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-emerald-200">
								<div className="flex items-start justify-between mb-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        	<Mail className="w-6 h-6 text-emerald-600" />
                                        </div>
									<ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-400 transition-colors" />
								</div>
								<h3 className="text-xl font-bold text-slate-900 mb-2">お問い合わせ</h3>
								<p className="text-sm text-slate-600 mb-6 leading-relaxed">
									ご質問やご不明な点がありましたら、こちらのフォームからお気軽にお問い合わせください。
								</p>
								<div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">全員対象</div>
							</div>
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
