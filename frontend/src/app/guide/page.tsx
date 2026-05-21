import Link from 'next/link';

/* ---------- SVG アイコン ---------- */
const S = { w: '1.8', r: 'round' as const, lj: 'round' as const };

function IcPencil({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S.w} strokeLinecap={S.r} strokeLinejoin={S.lj}>
			<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
			<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
		</svg>
	);
}
function IcSend({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S.w} strokeLinecap={S.r} strokeLinejoin={S.lj}>
			<line x1="22" y1="2" x2="11" y2="13" />
			<polygon points="22 2 15 22 11 13 2 9 22 2" />
		</svg>
	);
}
function IcKey({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S.w} strokeLinecap={S.r} strokeLinejoin={S.lj}>
			<circle cx="7.5" cy="15.5" r="5.5" />
			<path d="M21 2l-9.6 9.6M15.5 7.5l3 3" />
		</svg>
	);
}
function IcCheckCircle({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S.w} strokeLinecap={S.r} strokeLinejoin={S.lj}>
			<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
			<polyline points="22 4 12 14.01 9 11.01" />
		</svg>
	);
}
function IcCard({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S.w} strokeLinecap={S.r} strokeLinejoin={S.lj}>
			<rect x="2" y="5" width="20" height="14" rx="2" />
			<line x1="2" y1="10" x2="22" y2="10" />
			<path d="M6 15h2M12 15h4" />
		</svg>
	);
}
function IcMessage({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S.w} strokeLinecap={S.r} strokeLinejoin={S.lj}>
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
		</svg>
	);
}
function IcClipboard({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S.w} strokeLinecap={S.r} strokeLinejoin={S.lj}>
			<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
			<rect x="8" y="2" width="8" height="4" rx="1" />
			<path d="M9 12h6M9 16h6" />
		</svg>
	);
}
function IcBuilding({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S.w} strokeLinecap={S.r} strokeLinejoin={S.lj}>
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<path d="M9 22V12h6v10" />
			<path d="M9 7h1m4 0h1M9 11h1m4 0h1" />
		</svg>
	);
}
function IcUserPlus({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S.w} strokeLinecap={S.r} strokeLinejoin={S.lj}>
			<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="8.5" cy="7" r="4" />
			<line x1="20" y1="8" x2="20" y2="14" />
			<line x1="23" y1="11" x2="17" y2="11" />
		</svg>
	);
}
function IcInfo({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S.w} strokeLinecap={S.r} strokeLinejoin={S.lj}>
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="16" x2="12" y2="12" />
			<line x1="12" y1="8" x2="12.01" y2="8" />
		</svg>
	);
}
function IcLightbulb({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S.w} strokeLinecap={S.r} strokeLinejoin={S.lj}>
			<line x1="9" y1="18" x2="15" y2="18" />
			<line x1="10" y1="22" x2="14" y2="22" />
			<path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A5 5 0 1 0 8.5 11.5c.76.76 1.23 1.52 1.41 2.5" />
		</svg>
	);
}
function IcAlert({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S.w} strokeLinecap={S.r} strokeLinejoin={S.lj}>
			<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
			<line x1="12" y1="9" x2="12" y2="13" />
			<line x1="12" y1="17" x2="12.01" y2="17" />
		</svg>
	);
}
function IcArrowDown({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S.w} strokeLinecap={S.r} strokeLinejoin={S.lj}>
			<line x1="12" y1="5" x2="12" y2="19" />
			<polyline points="19 12 12 19 5 12" />
		</svg>
	);
}
function IcChevronDown({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S.w} strokeLinecap={S.r} strokeLinejoin={S.lj}>
			<polyline points="6 9 12 15 18 9" />
		</svg>
	);
}

/* ---------- 小コンポーネント ---------- */

function Step({ num, title, desc, tip, warn, color = 'teal' }: {
	num: number; title: string; desc: string; tip?: string; warn?: string; color?: 'teal' | 'blue' | 'emerald';
}) {
	const bg = { teal: 'bg-teal-600', blue: 'bg-blue-600', emerald: 'bg-emerald-600' }[color];
	return (
		<div className="flex gap-4">
			<div className={`flex-shrink-0 w-8 h-8 rounded-full ${bg} text-white flex items-center justify-center font-bold text-xs mt-0.5`}>
				{num}
			</div>
			<div className="pt-0.5 pb-6">
				<p className="font-semibold text-gray-900 text-sm">{title}</p>
				<p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
				{tip && (
					<span className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs text-amber-700">
						<IcLightbulb className="w-3.5 h-3.5 flex-shrink-0" />{tip}
					</span>
				)}
				{warn && (
					<span className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-2.5 py-1 text-xs text-red-700">
						<IcAlert className="w-3.5 h-3.5 flex-shrink-0" />{warn}
					</span>
				)}
			</div>
		</div>
	);
}

function FlowBox({ colorClass, iconEl, label }: { colorClass: string; iconEl: React.ReactNode; label: string }) {
	return (
		<div className={`${colorClass} rounded-xl px-4 py-3 text-center flex flex-col items-center gap-1.5 shadow-sm w-full`}>
			<div className="w-7 h-7 flex items-center justify-center opacity-70">{iconEl}</div>
			<p className="text-xs font-semibold text-gray-800 leading-snug whitespace-pre-line">{label}</p>
		</div>
	);
}

function Arrow() {
	return (
		<div className="flex justify-center my-1 text-gray-300">
			<IcArrowDown className="w-5 h-5" />
		</div>
	);
}

function SectionHeader({ colorClass, title, badge }: { colorClass: string; title: string; badge: string }) {
	return (
		<div className="flex items-center gap-3 mb-6">
			<span className={`inline-block rounded-full px-3 py-1 text-xs font-bold text-white ${colorClass}`}>{badge}</span>
			<h2 className="text-xl font-bold text-gray-900">{title}</h2>
		</div>
	);
}

function NoteBox({ colorClass, borderClass, textClass, iconEl, title, items }: {
	colorClass: string; borderClass: string; textClass: string; iconEl: React.ReactNode; title: string; items: string[];
}) {
	return (
		<div className={`mt-4 rounded-xl ${colorClass} border ${borderClass} p-4`}>
			<p className={`font-bold mb-2 flex items-center gap-1.5 text-sm ${textClass}`}>
				<span className="w-4 h-4 flex-shrink-0">{iconEl}</span>{title}
			</p>
			<ul className={`space-y-1 text-xs ${textClass} opacity-80`}>
				{items.map((item, i) => (
					<li key={i} className="flex items-start gap-1.5">
						<span className="mt-0.5 flex-shrink-0">–</span>{item}
					</li>
				))}
			</ul>
		</div>
	);
}

/* ---------- メインページ ---------- */

export default function GuidePage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-3xl mx-auto px-5 py-12">

				{/* ヘッダー */}
				<div className="mb-2">
					<Link href="/" className="inline-flex items-center gap-1 text-sm text-teal-600 hover:underline">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="15 18 9 12 15 6"/></svg>
						トップページに戻る
					</Link>
				</div>
				<h1 className="text-3xl font-bold text-gray-900 mt-3 mb-2">使い方ガイド</h1>
				<p className="text-gray-500 text-sm mb-10 leading-relaxed">
					青山ピアノソサイエティ（APS）の入会・名簿登録システムの使い方を説明します。
					初めて利用する方はこのページを最初にご覧ください。
				</p>

				{/* 全体マップ */}
				<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-10">
					<h2 className="text-base font-bold text-gray-900 mb-4">どのフォームを使えばいい？</h2>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm">
						<div className="rounded-xl border-2 border-teal-200 bg-teal-50 p-4 flex flex-col items-center gap-2">
							<div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
								<IcBuilding className="w-5 h-5" />
							</div>
							<p className="font-bold text-teal-800 text-sm">青山学院大学の<br />在学生</p>
							<p className="text-teal-600 text-xs font-medium">→ 在学生の入会</p>
						</div>
						<div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 flex flex-col items-center gap-2">
							<div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
								<IcUserPlus className="w-5 h-5" />
							</div>
							<p className="font-bold text-blue-800 text-sm">他大学の<br />在学生</p>
							<p className="text-blue-600 text-xs font-medium">→ 他大学の方の入会</p>
						</div>
						<div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 flex flex-col items-center gap-2">
							<div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
								<IcClipboard className="w-5 h-5" />
							</div>
							<p className="font-bold text-emerald-800 text-sm">すでにAPSに<br />加入している方</p>
							<p className="text-emerald-600 text-xs font-medium">→ 加入者用の名簿登録</p>
						</div>
					</div>
				</div>

				{/* ======== フロー1: 在学生の入会 ======== */}
				<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 mb-8">
					<SectionHeader colorClass="bg-teal-600" title="在学生の入会" badge="フロー 1" />
					<p className="text-sm text-gray-500 mb-6 leading-relaxed">
						青山学院大学に在学中の方が対象です。大学が発行した
						<span className="font-semibold text-gray-700"> @aoyama.ac.jp </span>
						メールアドレスのGoogle アカウントで認証することで、在学証明が自動的に行われます。
					</p>

					{/* フロー図 */}
					<div className="bg-gray-50 rounded-xl p-5 mb-7">
						<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">フロー概略</p>
						<div className="flex flex-col items-center max-w-xs mx-auto">
							<FlowBox colorClass="bg-teal-100" iconEl={<IcPencil className="w-full h-full text-teal-600" />} label="フォームに情報を入力" />
							<Arrow />
							<FlowBox colorClass="bg-teal-100" iconEl={<IcSend className="w-full h-full text-teal-600" />} label="「申請を送信」ボタンを押す" />
							<Arrow />
							<FlowBox colorClass="bg-yellow-100" iconEl={<IcKey className="w-full h-full text-yellow-600" />} label={"青山Googleアカウントで\nログイン（@aoyama.ac.jp）"} />
							<Arrow />
							<FlowBox colorClass="bg-green-100" iconEl={<IcCheckCircle className="w-full h-full text-green-600" />} label="認証完了・入会完了！" />
						</div>
					</div>

					{/* ステップ詳細 */}
					<div className="pl-4 border-l-2 border-teal-100">
						<Step color="teal" num={1} title="トップページで「在学生の入会」をクリック" desc="緑色のカードを選んでフォームページに進みます。" />
						<Step color="teal" num={2} title="学生番号を入力する" desc="学籍番号（例：B123456）を入力すると、学部・学科・メールアドレスが自動的に補完されます。" tip="学籍番号を入力するだけで学部・学科が自動入力されます" />
						<Step color="teal" num={3} title="残りの項目を入力する" desc="氏名（姓 名の形式）・フリガナ・学年・LINE名・電話番号を入力します。" />
						<Step color="teal" num={4} title="「申請を送信」を押す" desc="入力内容が保存されます。この時点ではまだ在学確認が完了していません。" />
						<Step color="teal" num={5} title="青山学院大学のGoogle アカウントでログイン" desc="@aoyama.ac.jp で終わるメールアドレスのGoogle アカウントでログインします。大学のメールアドレス以外では認証できません。" warn="必ず @aoyama.ac.jp のアカウントを使ってください" />
						<Step color="teal" num={6} title="入会完了！" desc="認証が成功すると「入会完了」と表示されます。管理者がダッシュボードで確認できる状態になります。" />
					</div>

					<NoteBox
						colorClass="bg-teal-50" borderClass="border-teal-200" textClass="text-teal-800"
						iconEl={<IcInfo className="w-full h-full" />}
						title="注意事項"
						items={[
							'Google アカウントへのログインは申請送信後に行います（申請前でも可）',
							'すでに @aoyama.ac.jp でログイン済みの場合は自動的に認証されます',
						]}
					/>
				</div>

				{/* ======== フロー2: 他大学の入会 ======== */}
				<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 mb-8">
					<SectionHeader colorClass="bg-blue-600" title="他大学の方の入会" badge="フロー 2" />
					<p className="text-sm text-gray-500 mb-6 leading-relaxed">
						青山学院大学以外の大学に在学中の方が対象です。フォーム送信後、
						APS のメンバーに直接学生証を見せることで在学確認を行います。
					</p>

					{/* フロー図 */}
					<div className="bg-gray-50 rounded-xl p-5 mb-7">
						<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">フロー概略</p>
						<div className="flex flex-col items-center max-w-xs mx-auto">
							<FlowBox colorClass="bg-blue-100" iconEl={<IcPencil className="w-full h-full text-blue-600" />} label="フォームに情報を入力" />
							<Arrow />
							<FlowBox colorClass="bg-blue-100" iconEl={<IcSend className="w-full h-full text-blue-600" />} label="「送信」ボタンを押す" />
							<Arrow />
							<FlowBox colorClass="bg-yellow-100" iconEl={<IcCard className="w-full h-full text-yellow-600" />} label={"APSメンバーに\n学生証を見せる"} />
							<Arrow />
							<FlowBox colorClass="bg-green-100" iconEl={<IcMessage className="w-full h-full text-green-600" />} label="LINEグループに招待" />
						</div>
					</div>

					{/* ステップ詳細 */}
					<div className="pl-4 border-l-2 border-blue-100">
						<Step color="blue" num={1} title="トップページで「他大学の方の入会」をクリック" desc="青色のカードを選んでフォームページに進みます。" />
						<Step color="blue" num={2} title="大学名を入力する" desc="在籍している大学の名前を正式名称で入力してください。" />
						<Step color="blue" num={3} title="その他の項目を入力する" desc="氏名・フリガナ・学部・学科・学年・LINE名・電話番号・メールアドレスを入力します。" />
						<Step color="blue" num={4} title="「送信」を押す" desc="送信が完了すると確認メッセージが表示されます。" />
						<Step color="blue" num={5} title="APSメンバーに学生証を見せる" desc="申請後、APS のメンバーと直接会ったときに学生証を提示してください。確認が取れ次第、LINE グループに招待されます。" tip="学生証（学生手帳・学生証カードなど）を持参してください" />
					</div>

					<NoteBox
						colorClass="bg-blue-50" borderClass="border-blue-200" textClass="text-blue-800"
						iconEl={<IcInfo className="w-full h-full" />}
						title="注意事項"
						items={[
							'フォーム送信だけでは入会完了になりません。学生証の確認が必要です',
							'Google アカウントのログインは不要です',
						]}
					/>
				</div>

				{/* ======== フロー3: 名簿登録 ======== */}
				<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 mb-8">
					<SectionHeader colorClass="bg-emerald-600" title="加入者用の名簿登録" badge="フロー 3" />
					<p className="text-sm text-gray-500 mb-6 leading-relaxed">
						すでに APS に加入している方が名簿に情報を登録するためのフォームです。
						大学の種類に応じて入力方法が変わります。
					</p>

					{/* フロー図 */}
					<div className="bg-gray-50 rounded-xl p-5 mb-7">
						<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">フロー概略</p>
						<div className="max-w-sm mx-auto">
							<div className="flex flex-col items-center">
								<FlowBox colorClass="bg-emerald-100" iconEl={<IcClipboard className="w-full h-full text-emerald-600" />} label="フォームを開く" />
								<Arrow />
								<div className="rounded-xl bg-gray-200 px-5 py-2 text-xs font-bold text-gray-700 w-full text-center">大学を選択</div>
							</div>
							<div className="flex gap-3 mt-3">
								<div className="flex-1 flex flex-col items-center gap-1">
									<div className="rounded-lg bg-teal-100 px-3 py-2 text-xs font-bold text-teal-800 text-center w-full">青山学院大学</div>
									<IcArrowDown className="w-4 h-4 text-gray-300" />
									<div className="rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-600 text-center w-full">学生番号を入力<br />→ 自動補完</div>
								</div>
								<div className="flex-1 flex flex-col items-center gap-1">
									<div className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-bold text-blue-800 text-center w-full">その他の大学</div>
									<IcArrowDown className="w-4 h-4 text-gray-300" />
									<div className="rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-600 text-center w-full">大学名・学部・<br />学科を手動入力</div>
								</div>
							</div>
							<div className="flex flex-col items-center mt-3">
								<Arrow />
								<FlowBox colorClass="bg-emerald-100" iconEl={<IcPencil className="w-full h-full text-emerald-600" />} label="氏名・LINE名等を入力して送信" />
								<Arrow />
								<FlowBox colorClass="bg-green-100" iconEl={<IcCheckCircle className="w-full h-full text-green-600" />} label="名簿登録完了！" />
							</div>
						</div>
					</div>

					{/* ステップ詳細 */}
					<div className="pl-4 border-l-2 border-emerald-100">
						<Step color="emerald" num={1} title="トップページで「加入者用の名簿登録」をクリック" desc="緑のカードを選んでフォームページに進みます。" />
						<Step color="emerald" num={2} title="大学を選択する" desc="「青山学院大学」または「その他の大学」のボタンを押して切り替えます。" />
						<Step color="emerald" num={3} title="（青山学院大学の場合）学生番号を入力する" desc="学籍番号を入力すると、学部・学科・メールアドレスが自動的に補完されます。" tip="学生番号さえ入力すれば学部・学科・メールは自動入力されます" />
						<Step color="emerald" num={3} title="（その他の大学の場合）大学情報を手動入力する" desc="大学名・学部・学科・メールアドレスをそれぞれ入力します。" />
						<Step color="emerald" num={4} title="共通項目を入力する" desc="氏名（姓 名の形式）・フリガナ・学年・LINE名・電話番号を入力します。" />
						<Step color="emerald" num={5} title="「登録する」を押す" desc="送信が完了すると「名簿への登録が完了しました」と表示されます。" />
					</div>

					<NoteBox
						colorClass="bg-emerald-50" borderClass="border-emerald-200" textClass="text-emerald-800"
						iconEl={<IcInfo className="w-full h-full" />}
						title="注意事項"
						items={[
							'このフォームはすでに APS に加入済みの方向けです。新規入会の方は「在学生の入会」または「他大学の方の入会」を使ってください',
							'同じメールアドレスで再登録すると情報が上書きされます',
							'登録後はダッシュボードの「学生プロフィール一覧」に反映されます',
						]}
					/>
				</div>

				{/* よくある質問 */}
				<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 mb-10">
					<h2 className="text-xl font-bold text-gray-900 mb-5">よくある質問</h2>
					<div className="space-y-3">
						{[
							{
								q: 'どのフォームを使えばいいかわかりません',
								a: 'ページ上部の「どのフォームを使えばいい？」を参考にしてください。青山学院大学在学生は「在学生の入会」、他大学の方は「他大学の方の入会」、すでに加入済みの方は「加入者用の名簿登録」をお使いください。',
							},
							{
								q: '@aoyama.ac.jp のメールアドレスがわかりません',
								a: '学籍番号から生成できます。例: 学籍番号が B123456 の場合、b123456@aoyama.ac.jp になります。先頭の英字を小文字にして残りの数字をそのまま繋げた形です。',
							},
							{
								q: '送信後に何も起きません（他大学フォーム）',
								a: '他大学の入会フォームは送信後に自動で何かが起きるわけではありません。送信完了のメッセージが表示されたら、次は APS のメンバーと直接会って学生証を見せてください。',
							},
							{
								q: '同じメールで二重登録してしまいました',
								a: '同じメールアドレスで再度送信すると情報が上書きされます。最新の送信内容が有効になります。',
							},
						].map(({ q, a }) => (
							<details key={q} className="group border border-gray-200 rounded-xl">
								<summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-gray-800 list-none">
									<span>Q. {q}</span>
									<IcChevronDown className="ml-3 w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
								</summary>
								<div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
									A. {a}
								</div>
							</details>
						))}
					</div>
				</div>

				{/* 戻るボタン */}
				<div className="text-center">
					<Link
						href="/"
						className="inline-flex items-center gap-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 text-sm transition"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="15 18 9 12 15 6"/></svg>
						トップページに戻る
					</Link>
				</div>
			</div>
		</div>
	);
}
