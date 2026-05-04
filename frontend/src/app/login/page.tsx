"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

function LoginContent() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") ?? "/profile";
	const error = searchParams.get("error");

	return (
		<main className="bg-slate-50 text-slate-900 font-sans min-h-screen">
			<section className="py-16 px-6">
				<div className="max-w-md mx-auto">
					{/* ヘッダー */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold mb-2">ログイン</h1>
						<p className="text-slate-600">
							アカウントにログインして、プロフィールにアクセスしてください。
						</p>
					</div>

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

						<GoogleLoginButton callbackUrl={callbackUrl} text="Google でログイン" />
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