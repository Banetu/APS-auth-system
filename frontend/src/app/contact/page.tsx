"use client";

import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import Link from "next/link";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <main className="bg-slate-50 text-slate-900 font-sans min-h-screen">
        <section className="py-16 px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-8 space-y-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold">送信完了</h1>
                <p className="text-slate-600">
                  お問い合わせをお受けいたしました。
                </p>
                <p className="text-sm text-slate-500">
                  ご返信までお待ちください。
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
            <Link href="/" className="inline-flex p-2 hover:bg-slate-200 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">お問い合わせ</h1>
          </div>

          {/* フォーム */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-8">
            <p className="text-slate-600 text-sm mb-6">
              ご質問やご不明な点がありましたら、以下のフォームからお気軽にお問い合わせください。
            </p>
            <ContactForm onSuccess={() => setSubmitted(true)} />
          </div>
        </div>
      </section>
    </main>
  );
}
