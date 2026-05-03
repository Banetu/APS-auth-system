"use client";

import { useState } from "react";
import { submitContact, ContactPayload } from "@/lib/api";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    affiliation: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // バリデーション
    if (!formData.name.trim()) {
      setError("お名前を入力してください");
      return;
    }
    if (!formData.email.trim()) {
      setError("メールアドレスを入力してください");
      return;
    }
    if (!formData.message.trim()) {
      setError("お問い合わせ内容を入力してください");
      return;
    }

    setLoading(true);

    try {
      const payload: ContactPayload = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || "お問い合わせ",
        affiliation: formData.affiliation,
        message: formData.message,
      };

      await submitContact(payload);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        affiliation: "",
        message: "",
      });

      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "送信に失敗しました";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-900 mb-2">送信完了</h3>
            <p className="text-green-800 text-sm">
              お問い合わせをお受けいたしました。
              ご返信までお待ちください。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          お名前 <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="山田 太郎"
          disabled={loading}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          メールアドレス <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@example.com"
          disabled={loading}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          所属（オプション）
        </label>
        <input
          type="text"
          name="affiliation"
          value={formData.affiliation}
          onChange={handleChange}
          placeholder="大学名・企業名など"
          disabled={loading}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          件名（オプション）
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="お問い合わせの件名"
          disabled={loading}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          お問い合わせ内容 <span className="text-red-600">*</span>
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="お問い合わせ内容をご入力ください"
          disabled={loading}
          rows={5}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 resize-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {loading ? "送信中..." : "送信"}
      </button>
    </form>
  );
}
