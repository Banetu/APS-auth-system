"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

function LoginContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { data: session, status } = useSession();
	const callbackUrl = searchParams.get("callbackUrl") ?? "";
	const queryEmail = searchParams.get("email") ?? "";
	const error = searchParams.get("error");
	const [email, setEmail] = useState(queryEmail);
	const [redirecting, setRedirecting] = useState(false);

	// 入会フロー（email パラメータあり）かつ @aoyama.ac.jp のアカウントでログイン済みかどうか
	const isJoinFlow = queryEmail.toLowerCase().endsWith("@aoyama.ac.jp");
	const sessionEmail = session?.user?.email?.trim().toLowerCase() ?? "";
	const isCorrectDomainSession = sessionEmail.endsWith("@aoyama.ac.jp");

	useEffect(() => {
		setEmail(queryEmail);
	}, [queryEmail]);

	useEffect(() => {
		if (status !== "authenticated") {
			return;
		}
		// 入会フローで @aoyama.ac.jp 以外のアカウントでログイン済みの場合はリダイレクトしない
		if (isJoinFlow && !isCorrectDomainSession) {
			return;
		}

		// callbackUrl が未指定の場合、管理者は / へ、一般ユーザーは /profile へ
		const role = (session?.user as any)?.role;
		const defaultUrl = role === "admin" ? "/" : "/profile";
		const dest = callbackUrl.startsWith("/") ? callbackUrl : defaultUrl;
		setRedirecting(true);
		router.replace(dest);
	}, [callbackUrl, router, status, isJoinFlow, isCorrectDomainSession, session]);

	return (
		<main className="bg-slate-50 text-slate-900 font-sans min-h-screen">
			<section className="py-16 px-6">
				<div className="max-w-md mx-auto">
					{redirecting ? (
						<div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
							ログインが完了しました。元のページへ戻っています...
						</div>
					) : null}

				{/* ヘッダー */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">ログイン</h1>
					<p className="text-slate-600">
						アカウントにログインして、プロフィールにアクセスしてください。
					</p>
				</div>

				{/* 入会フローで間違ったアカウントでログイン済みの場合の警告 */}
				{status === "authenticated" && isJoinFlow && !isCorrectDomainSession ? (
					<div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex flex-col gap-3 mb-6">
						<div className="flex items-start gap-2">
							<AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
							<div>
								<p className="text-amber-900 text-sm font-medium">別のアカウントでログインしています</p>
								<p className="text-amber-800 text-xs mt-1">
									入会認証には <strong>@aoyama.ac.jp</strong> のGoogleアカウントが必要です。
									現在 <strong>{sessionEmail}</strong> でログイン中です。
								</p>
							</div>
						</div>
						<button
							type="button"
							onClick={() => signOut({ redirect: false })}
							className="text-sm text-amber-800 underline text-left"
						>
							ログアウトして別のアカウントで続ける
						</button>
					</div>
				) : null}

					{/* フォーム */}
					<div className="bg-white rounded-lg shadow-sm border border-slate-100 p-8 space-y-6">
						{error && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
								<AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
								<div>
									<p className="text-red-800 text-sm font-medium">ログインに失敗しました</p>
									<p className="text-red-700 text-xs mt-1">
										{error === "auth_callback_error"
											? "認証に失敗しました。もう一度お試しください。"
											: "エラーが発生しました。"}
									</p>
								</div>
							</div>
						)}

						<div className="space-y-2">
							<label className="block text-sm font-medium text-slate-700">メールアドレス</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="your-name@aoyama.ac.jp"
								className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<p className="text-xs text-slate-500">入会フォームで入力したメールアドレスが自動入力されます。</p>
						</div>

						<GoogleLoginButton callbackUrl={callbackUrl} text="Google でログイン" email={email} />
					</div>

					{/* フッター */}
					
				</div>
			</section>
		</main>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<div>ローディング中...</div>}>
			<LoginContent />
		</Suspense>
	);
}