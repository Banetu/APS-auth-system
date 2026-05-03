// frontend/src/app/otp-login/page.tsx
// OTP ログインページ（シンプル版）

'use client';

import { useState } from 'react';
import { requestOtp, verifyOtp } from '@/actions/otp-auth';
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react';
import Link from 'next/link';

type Step = 'email' | 'otp';

export default function OtpLoginPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleRequestOtp() {
    setError(null);
    setSuccess(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const result = await requestOtp(email);
    setLoading(false);

    if (result.success) {
      setSuccess('OTP sent to your email');
      setStep('otp');
      // 10 分後に自動リセット
      setTimeout(() => {
        setStep('email');
        setSuccess(null);
      }, 10 * 60 * 1000);
    } else {
      setError(result.error);
    }
  }

  async function handleVerifyOtp() {
    setError(null);
    setSuccess(null);

    if (!otp || otp.length < 6) {
      setError('Please enter a valid OTP code');
      return;
    }

    setLoading(true);
    const result = await verifyOtp(email, otp);
    setLoading(false);

    if (result.success) {
      setSuccess('OTP verified! Redirecting...');
      // セッション情報を保存してリダイレクト
      localStorage.setItem('otp_session', JSON.stringify(result.data.session));
      setTimeout(() => {
        window.location.href = '/profile';
      }, 1000);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Sign In</h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your email to receive a one-time code
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
            <span className="text-red-600 flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-2">
            <span className="text-green-600 flex-1">{success}</span>
            <button
              onClick={() => setSuccess(null)}
              className="text-green-400 hover:text-green-600"
            >
              ✕
            </button>
          </div>
        )}

        {step === 'email' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleRequestOtp}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OTP Code
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Check your email: {email}
              </p>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    setError(null);
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-mono text-lg tracking-widest"
                />
              </div>
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            <button
              onClick={() => {
                setStep('email');
                setOtp('');
              }}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2"
            >
              ← Back to Email
            </button>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Just want to contact us?{' '}
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Send a message
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
