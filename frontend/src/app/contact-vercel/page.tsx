// frontend/src/app/contact/page.tsx
// 簡潔なお問い合わせページ（Vercel 版）

'use client';

import { useState } from 'react';
import { submitContact } from '@/actions/otp-auth';
import { Mail, User, MessageSquare, Send, Loader } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    affiliation: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // バリデーション
    if (!formData.email || !formData.name || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.message.length < 10) {
      setError('Message must be at least 10 characters');
      return;
    }

    setLoading(true);
    const result = await submitContact(formData);
    setLoading(false);

    if (result.success) {
      setSuccess(
        `Thank you! Your inquiry (#${result.data.contact_id}) has been received.`
      );
      // フォームをリセット
      setFormData({
        email: '',
        name: '',
        affiliation: '',
        subject: '',
        message: '',
      });
      // 5 秒後にメッセージ消去
      setTimeout(() => setSuccess(null), 5000);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* ヘッダー */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact Us</h1>
            <p className="text-gray-600">
              We&apos;d love to hear from you. Send us a message and we&apos;ll respond as
              soon as possible.
            </p>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* 成功表示 */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          )}

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* メールアドレス */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 氏名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 所属（オプション） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Affiliation
              </label>
              <input
                type="text"
                name="affiliation"
                value={formData.affiliation}
                onChange={handleChange}
                placeholder="Your company or organization"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 件名（オプション） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* メッセージ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  required
                  rows={6}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.message.length}/5000
              </p>
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition duration-200"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>

          {/* その他の連絡方法 */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Other Ways to Reach Us
            </h3>
            <p className="text-gray-600">
              Email: support@example.com
              <br />
              Response time: Usually within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
