"use client";

import { useState } from "react";
import { JoinForm } from "@/components/JoinForm";
import { OTPVerifyForm } from "@/components/OTPVerifyForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function JoinFormPage() {
  const [joinRequestId, setJoinRequestId] = useState<string>("");
  const [verificationComplete, setVerificationComplete] = useState(false);

  if (verificationComplete) {
    return (
      <main className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <section className="py-16 px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-8 space-y-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold">登録完了</h1>
                <p className="text-slate-600">
                  メールアドレスの認証が完了しました。
                </p>
                <p className="text-sm text-slate-500">
                  確認メールをお送りしています。ご確認ください。
                </p>
              </div>

              <Link
                href="/"
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 text-center block"
              >
                ホームに戻る
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 text-slate-900 font-sans min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-md mx-auto">
          {/* ヘッダー */}
          <div className="mb-8 flex items-center gap-3">
            <Link href="/join" className="inline-flex p-2 hover:bg-slate-200 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">
              {joinRequestId ? "認証コード入力" : "入会申請"}
            </h1>
          </div>

          {/* フォーム */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-8">
            {!joinRequestId ? (
              <>
                <p className="text-slate-600 text-sm mb-6">
                  メールアドレスとお名前を入力してください。
                  認証コードをメール送信します。
                </p>
                <JoinForm onSuccess={setJoinRequestId} />
              </>
            ) : (
              <>
                <p className="text-slate-600 text-sm mb-6">
                  メールに記載された認証コードを入力してください。
                </p>
                <OTPVerifyForm
                  joinRequestId={joinRequestId}
                  onSuccess={() => setVerificationComplete(true)}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

