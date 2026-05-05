"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Info, CheckCircle, FileText, AlertCircle } from "lucide-react";
import NameInput from "../../../../components/forms/NameInput";
import StudentNumberInput from "../../../../components/forms/StudentNumberInput";
import { validateFullName, getDepartmentsFromStudentId, validateStudentId } from "../../../../lib/validation";
import { sendOTPRequest, verifyOTP } from "../../../../lib/api";

const DEFAULT_LINE_INVITE_URL = process.env.NEXT_PUBLIC_LINE_INVITE_URL || "";

function buildAoyamaEmail(studentId: string): string {
  const headMap: Record<string, string> = {
    "1": "a",
    "2": "b",
    "3": "c",
    "4": "d",
    S: "s",
  };

  const normalized = studentId.trim();
  const first = normalized.charAt(0).toUpperCase();
  const tail = normalized.slice(1).toLowerCase();
  const prefix = headMap[first];

  if (!prefix) {
    return "";
  }

  return `${prefix}${tail}@aoyama.ac.jp`;
}

export default function AoyamaStudentFormPage() {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [furigana, setFurigana] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [lineName, setLineName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [joinRequestId, setJoinRequestId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lineInviteUrl, setLineInviteUrl] = useState(DEFAULT_LINE_INVITE_URL);
  // 学生番号が変更されたときに自動的に学部・学科を取得して設定
  useEffect(() => {
    const normalizedId = studentId.trim().toUpperCase();
    if (normalizedId.length === 0) {
      setFaculty("");
      setDepartment("");
      return;
    }

    const departments = getDepartmentsFromStudentId(normalizedId);
    if (departments && departments.length > 0) {
      // 最初の該当学部学科を自動入力
      const firstDepartment = departments[0];
      // "学部 学科" 形式で保存されているため、スペースで分割
      const parts = firstDepartment.split(" ");
      if (parts.length >= 2) {
        setFaculty(parts[0]);
        setDepartment(parts.slice(1).join(" "));
      }
    }
  }, [studentId]);

  const normalizedStudentId = useMemo(() => studentId.trim(), [studentId]);
  const isStudentIdValid = validateStudentId(normalizedStudentId);
  const autoCompletedEmail = isStudentIdValid ? buildAoyamaEmail(normalizedStudentId) : "";
  const isNameValid = validateFullName(name);
  // 半角スペースで姓名が区切られているかチェック
  const nameHasHalfWidthSpace = name.trim().includes(' ');
  const showNameSpaceWarning = name.trim().length >= 2 && !nameHasHalfWidthSpace;

  return (
    <main className="bg-slate-50 text-slate-900 font-sans min-h-screen">
      {/* ヒーロー部分 */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-emerald-50 pt-10 pb-10 md:pt-10 md:pb-10 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="inline-block">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200/50 bg-emerald-50/50">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">在学生向け</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="text-slate-900">入会フォーム</span>
          </h1>

        </div>
      </section>

      {/* メインコンテンツ */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* フォームカード */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm mb-8">
            <form className="space-y-6">
              {/* 学生番号 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  学生番号<span className="text-red-600">*</span>
                </label>
                <StudentNumberInput
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="例: 1A234567"
                  value={studentId}
                  onChange={(v) => setStudentId(v)}
                  aria-invalid={!isStudentIdValid && normalizedStudentId.length > 0}
                />
                {!isStudentIdValid && normalizedStudentId.length > 0 ? (
                  <p className="text-sm text-red-600 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    先頭3文字が有効な学科コードの8文字で入力してください。
                  </p>
                ) : (
                  <p className="text-sm text-slate-600 flex items-start gap-2">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
                    入力形式に合致すると、メールアドレスを自動補完します。
                  </p>
                )}
              </div>

              {/* 氏名 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  氏名<span className="text-red-600">*</span>
                </label>
                <NameInput
                  className={`w-full px-4 py-3 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${showNameSpaceWarning ? 'border-amber-400 bg-amber-50' : 'border-slate-200'}`}
                  placeholder="例: 山田 太郎"
                  value={name}
                  onChange={(v) => setName(v)}
                />
                {showNameSpaceWarning ? (
                  <p className="text-sm text-amber-600 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    姓と名の間を<strong>半角スペース</strong>で区切ってください（例: 山田 太郎）
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 flex items-start gap-2">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                    姓と名の間は<strong>半角スペース</strong>で区切ってください（例: 山田 太郎）
                  </p>
                )}
              </div>

              {/* フリガナ */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  フリガナ<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="例: ヤマダ タロウ"
                  value={furigana}
                  onChange={(e) => setFurigana(e.target.value)}
                />
              </div>

              {/* 学部 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  学部<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-600 bg-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition cursor-not-allowed"
                  placeholder="例: 理工学部"
                  value={faculty}
                  readOnly
                  title="学生番号から自動補完されます"
                />
              </div>

              {/* 学科 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  学科<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-600 bg-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition cursor-not-allowed"
                  placeholder="例: 情報テクノロジー学科"
                  value={department}
                  readOnly
                  title="学生番号から自動補完されます"
                />
              </div>

              {/* 学年 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  学年<span className="text-red-600">*</span>
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white"
                  value={schoolYear}
                  onChange={(e) => setSchoolYear(e.target.value)}
                >
                  <option value="">-- 選択してください --</option>
                  <option value="1年">1年</option>
                  <option value="2年">2年</option>
                  <option value="3年">3年</option>
                  <option value="4年">4年</option>
                </select>
              </div>

              {/* LINE名 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  LINE 名<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="例: Taro Yamada"
                  value={lineName}
                  onChange={(e) => setLineName(e.target.value)}
                />
              </div>

              {/* 電話番号 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  電話番号<span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="例: 09012345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              {/* メールアドレス */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  メールアドレス<span className="text-red-600">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-600 bg-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition cursor-not-allowed"
                  type="email"
                  placeholder="学生番号から自動補完"
                  value={autoCompletedEmail}
                  readOnly
                  title="学生番号から自動補完されるため編集できません"
                />
              </div>

              {/* エラーメッセージ */}
                {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 font-medium">{formError}</p>
                </div>
              )}

              {/* ボタン */}
              <div className="flex flex-col gap-3 pt-4">
                <button
                  type="button"
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isNameValid || !isStudentIdValid || !autoCompletedEmail || !furigana || !faculty || !department || !schoolYear || !lineName || !phoneNumber || submitting}
                  onClick={async () => {
                    setFormError(null);
                    if (!isNameValid) {
                      setFormError("氏名は「姓<半角スペース>名」の形式で入力してください。");
                      return;
                    }
                    if (!isStudentIdValid) {
                      setFormError("学生番号が正しくありません。");
                      return;
                    }
                    if (!autoCompletedEmail) {
                      setFormError("自動補完されたメールアドレスが生成できません。");
                      return;
                    }
                    if (!furigana) {
                      setFormError("フリガナを入力してください。");
                      return;
                    }
                    if (!faculty) {
                      setFormError("学部を入力してください。");
                      return;
                    }
                    if (!department) {
                      setFormError("学科を入力してください。");
                      return;
                    }
                    if (!schoolYear) {
                      setFormError("学年を選択してください。");
                      return;
                    }
                    if (!lineName) {
                      setFormError("LINE 名を入力してください。");
                      return;
                    }
                    if (!phoneNumber) {
                      setFormError("電話番号を入力してください。");
                      return;
                    }
                    const metadata = {
                      student_id: studentId,
                      furigana,
                      faculty,
                      department,
                      school_year: schoolYear,
                      line_name: lineName,
                      phone_number: phoneNumber,
                    };
                    setSubmitting(true);
                    try {
                      const otp = await sendOTPRequest({
                        email: autoCompletedEmail,
                        name,
                        form_type: "aoyama-student",
                        metadata,
                      });
                      setJoinRequestId(otp.id);
                      setOtpRequested(true);
                    } catch (err) {
                      setFormError(err instanceof Error ? err.message : "送信に失敗しました。");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {submitting ? "送信中..." : "送信してOTPを受け取る"}
                </button>
              </div>

              {otpRequested && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 space-y-3">
                  <p className="text-sm text-emerald-800">
                    ワンタイムパスワードを <strong>{autoCompletedEmail}</strong> に送信しました。6桁コードを入力してください。
                  </p>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-emerald-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="例: 123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  />
                  <button
                    type="button"
                    className="w-full px-6 py-3 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={verifyingOtp || otpCode.length !== 6 || !joinRequestId}
                    onClick={async () => {
                      setFormError(null);
                      setVerifyingOtp(true);
                      try {
                        const result = await verifyOTP({
                          joinRequestId,
                          otp: otpCode,
                        });
                        setLineInviteUrl(result.lineInviteUrl || DEFAULT_LINE_INVITE_URL);
                        setSubmitted(true);
                      } catch (err) {
                        setFormError(err instanceof Error ? err.message : "OTP検証に失敗しました。");
                      } finally {
                        setVerifyingOtp(false);
                      }
                    }}
                  >
                    {verifyingOtp ? "検証中..." : "OTPを検証して本入会を完了"}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* ステップ説明 */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 md:p-8 mt-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-emerald-600" />
              入会の流れ
            </h2>
            <ol className="space-y-3 ml-4 text-slate-700 leading-relaxed">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                <span>必要事項（氏名、学生番号 等）を入力して「送信」をクリックしてください。</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">2</span>
                <span>入力したメールアドレス宛に認証パスワード（ワンタイムコード）を送信します。</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">3</span>
                <span>メールに届いた認証パスワードをこのページの確認欄に入力して検証してください。</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">4</span>
                <span>検証成功後、ライングループ招待リンクが発行されます。リンクからグループに参加してください。</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {submitted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
            <h2 className="text-2xl font-bold">送信完了</h2>
            <p className="text-slate-600">本入会が完了しました。<br />以下のボタンからAPSライングループに参加してください。</p>
            {lineInviteUrl ? (
              <a
                href={lineInviteUrl}
                className="block w-full px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
              >
                APSライングループに加入する
              </a>
            ) : (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                LINE招待URLが設定されていません。管理者へお問い合わせください。
              </p>
            )}
            <Link href="/" className="block w-full px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">
              ホームに戻る
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
