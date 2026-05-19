"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";
import { completeJoinDomainVerification } from "@/lib/api";

interface OTPVerifyFormProps {
	joinRequestId: string;
	email?: string;
	onSuccess?: () => void;
}

const AOYAMA_DOMAIN = "aoyama.ac.jp";

export function OTPVerifyForm({ joinRequestId, email, onSuccess }: OTPVerifyFormProps) {
	const { data: session, status } = useSession();
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	const normalizedExpectedEmail = email?.trim().toLowerCase() || "";
	const normalizedSessionEmail = session?.user?.email?.trim().toLowerCase() || "";
	const normalizedEmail = normalizedExpectedEmail || normalizedSessionEmail;
	// ドメイン判定はセッションの実際のログインメールで行う（フォームのメールではなく）
	const isAoyamaDomain = useMemo(
		() => normalizedSessionEmail.endsWith(`@${AOYAMA_DOMAIN}`),
		[normalizedSessionEmail]
	);

	useEffect(() => {
		if (status !== "authenticated" || !isAoyamaDomain || !joinRequestId) {
			return;
		}

		let cancelled = false;
		const verify = async () => {
			try {
				setSubmitting(true);
				setError("");
				const res = await completeJoinDomainVerification({ joinRequestId });
				if (!cancelled && res.joined) {
					onSuccess?.();
				}
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : "認証に失敗しました");
				}
			} finally {
				if (!cancelled) {
					setSubmitting(false);
				}
			}
		};

		void verify();

		return () => {
			cancelled = true;
		};
	}, [status, isAoyamaDomain, joinRequestId, onSuccess]);

	const handleGoogleLogin = async () => {
		setError("");
		const loginParams: Record<string, string> = {
			prompt: "select_account",
		};
		if (normalizedExpectedEmail) {
			loginParams.login_hint = normalizedExpectedEmail;
		}
		await signIn("google", {
			callbackUrl: `/join/form?joinRequestId=${encodeURIComponent(joinRequestId)}${normalizedExpectedEmail ? `&email=${encodeURIComponent(normalizedExpectedEmail)}` : ""}`,
		}, loginParams);
	};

	if (status === "loading" || submitting) {
		return (
			<div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
				<div className="flex items-center gap-3 text-slate-700">
					<Loader className="w-5 h-5 animate-spin" />
					<p className="text-sm">認証状態を確認しています...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
					<AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
					<p className="text-red-800 text-sm">{error}</p>
				</div>
			)}

			{status !== "authenticated" ? (
				<>
					<p className="text-slate-600 text-sm">
						入会認証を完了するには、Googleでログインしてください。
					</p>
					<button
						type="button"
						onClick={handleGoogleLogin}
						className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
					>
						Googleでログインして認証
					</button>
				</>
			) : isAoyamaDomain ? (
				<div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
					<CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
					<div>
						<p className="text-green-800 text-sm font-medium">認証済みのアカウントです</p>
						<p className="text-green-700 text-xs mt-1">{normalizedEmail}</p>
						{normalizedExpectedEmail && normalizedExpectedEmail !== normalizedSessionEmail ? (
							<p className="text-green-700 text-xs mt-1">フォームのメール: {normalizedExpectedEmail}</p>
						) : null}
					</div>
				</div>
			) : (
				<>
					<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
						<p className="text-amber-900 text-sm font-medium">対象ドメインのGoogleアカウントではありません</p>
						<p className="text-amber-800 text-xs mt-1">
							入会認証は @aoyama.ac.jp のメールアドレスでログインした場合のみ完了します。
						</p>
					</div>
					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => signOut({ redirect: false })}
							className="flex-1 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
						>
							いまのアカウントからログアウト
						</button>
						<button
							type="button"
							onClick={handleGoogleLogin}
							className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
						>
							別アカウントで再ログイン
						</button>
					</div>
				</>
			)}
		</div>
	);
}
