"use client";

import { useState } from "react";
import { sendOTPRequest, JoinRequestPayload } from "@/lib/api";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";

interface JoinFormProps {
  onSuccess?: (joinRequestId: string) => void;
}

export function JoinForm({ onSuccess }: JoinFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    confirm_email: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [joinRequestId, setJoinRequestId] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!formData.email.trim()) {
      setError("メールアドレスを入力してください");
      return;
    }
    if (!formData.confirm_email.trim()) {
      setError("確認用メールアドレスを入力してください");
      return;
    }
    if (!formData.name.trim()) {
      setError("お名前を入力してください");
      return;
    }
    if (formData.email !== formData.confirm_email) {
      setError("メールアドレスが一致しません");
      return;
    }

    setLoading(true);

    try {
      const payload: JoinRequestPayload = {
        email: formData.email,
        confirm_email: formData.confirm_email,
        name: formData.name,
        form_type: "prospective-student",
      };

      const response = await sendOTPRequest(payload);
      setJoinRequestId(response.id);
      setSuccess(true);

      if (onSuccess) {
        onSuccess(response.id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "エラーが発生しました";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-green-900 mb-2">OTP送信完了</h3>
            <p className="text-green-800 text-sm mb-4">
              入力いただいたメールアドレスに認証コードを送信しました。
              メールを確認して、6桁のコードを入力してください。
            </p>
            <p className="text-xs text-green-700">
              Request ID: {joinRequestId}
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
          メールアドレス
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
          メールアドレス（確認用）
        </label>
        <input
          type="email"
          name="confirm_email"
          value={formData.confirm_email}
          onChange={handleChange}
          placeholder="example@example.com"
          disabled={loading}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          お名前
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

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {loading ? "送信中..." : "OTPを送信"}
      </button>
    </form>
  );
}
