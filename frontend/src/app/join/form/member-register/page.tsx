"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { CheckCircle, FileText, AlertCircle, Info } from "lucide-react";
import { validateFullName, getDepartmentsFromStudentId, validateStudentId, normalizeStudentId } from "../../../../lib/validation";
import { registerMember } from "../../../../lib/api";

function buildAoyamaEmail(studentId: string): string {
  const headMap: Record<string, string> = { "1": "a", "2": "b", "3": "c", "4": "d", S: "s" };
  const normalized = normalizeStudentId(studentId);
  const first = normalized.charAt(0).toUpperCase();
  const tail = normalized.slice(1).toLowerCase();
  const prefix = headMap[first];
  if (!prefix) return "";
  return `${prefix}${tail}@aoyama.ac.jp`;
}

export default function MemberRegisterPage() {
  const [universityType, setUniversityType] = useState<"aoyama" | "other">("aoyama");
  const [universityNameOther, setUniversityNameOther] = useState("");
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [furigana, setFurigana] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [lineName, setLineName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailOther, setEmailOther] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 青山の場合、学生番号から学部・学科を自動補完
  useEffect(() => {
    if (universityType !== "aoyama") return;
    const normalizedId = normalizeStudentId(studentId);
    if (normalizedId.length === 0) { setFaculty(""); setDepartment(""); return; }
    const departments = getDepartmentsFromStudentId(normalizedId);
    if (departments && departments.length > 0) {
      const parts = departments[0].split(" ");
      if (parts.length >= 2) { setFaculty(parts[0]); setDepartment(parts.slice(1).join(" ")); }
    }
  }, [studentId, universityType]);

  // 大学タイプ切替時にリセット
  useEffect(() => {
    setStudentId(""); setFaculty(""); setDepartment(""); setEmailOther(""); setUniversityNameOther("");
  }, [universityType]);

  const normalizedStudentId = useMemo(() => studentId.trim(), [studentId]);
  const isStudentIdValid = universityType === "aoyama" ? validateStudentId(normalizedStudentId) : true;
  const autoCompletedEmail = universityType === "aoyama" && isStudentIdValid ? buildAoyamaEmail(normalizedStudentId) : "";
  const finalEmail = universityType === "aoyama" ? autoCompletedEmail : emailOther.trim();
  const finalUniversity = universityType === "aoyama" ? "青山学院大学" : universityNameOther.trim();

  const isNameValid = validateFullName(name);
  const nameHasHalfWidthSpace = name.trim().includes(" ");
  const showNameSpaceWarning = name.trim().length >= 2 && !nameHasHalfWidthSpace;

  const isFormValid =
    (universityType === "aoyama" ? isStudentIdValid && autoCompletedEmail : universityNameOther.trim() && emailOther.trim() && faculty.trim() && department.trim()) &&
    isNameValid &&
    furigana.trim() &&
    (universityType === "aoyama" ? faculty : true) &&
    (universityType === "aoyama" ? department : true) &&
    schoolYear &&
    lineName.trim() &&
    phoneNumber.trim();

  const handleSubmit = async () => {
    setFormError(null);
    if (!isNameValid) { setFormError("氏名は「姓<半角スペース>名」の形式で入力してください。"); return; }
    if (!furigana.trim()) { setFormError("フリガナを入力してください。"); return; }
    if (universityType === "aoyama") {
      if (!isStudentIdValid) { setFormError("学生番号が正しくありません。"); return; }
      if (!autoCompletedEmail) { setFormError("学生番号からメールアドレスを生成できません。"); return; }
      if (!faculty) { setFormError("学部が自動入力されませんでした。学生番号を確認してください。"); return; }
    } else {
      if (!universityNameOther.trim()) { setFormError("大学名を入力してください。"); return; }
      if (!faculty.trim()) { setFormError("学部を入力してください。"); return; }
      if (!department.trim()) { setFormError("学科を入力してください。"); return; }
      if (!emailOther.trim()) { setFormError("メールアドレスを入力してください。"); return; }
    }
    if (!schoolYear) { setFormError("学年を選択してください。"); return; }
    if (!lineName.trim()) { setFormError("LINE 名を入力してください。"); return; }
    if (!phoneNumber.trim()) { setFormError("電話番号を入力してください。"); return; }

    const metadata: Record<string, unknown> = {
      furigana,
      faculty,
      department,
      school_year: schoolYear,
      line_name: lineName,
      phone_number: phoneNumber,
    };
    if (universityType === "aoyama") {
      metadata.student_id = studentId;
    }

    setSubmitting(true);
    try {
      await registerMember({
        email: finalEmail,
        name,
        university_name: finalUniversity,
        metadata,
      });
      setSubmitted(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "登録に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-slate-50 text-slate-900 font-sans min-h-screen">
      <section className="bg-gradient-to-br from-slate-50 via-white to-emerald-50 pt-10 pb-10 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200/50 bg-emerald-50/50">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">加入者向け</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">名簿登録フォーム</h1>
          <p className="text-slate-600 text-sm">すでにAPSに加入された方の名簿登録フォームです。</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm mb-8">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }}>

              {/* 大学選択 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  大学<span className="text-red-600">*</span>
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setUniversityType("aoyama")}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold text-sm transition ${universityType === "aoyama" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                  >
                    青山学院大学
                  </button>
                  <button
                    type="button"
                    onClick={() => setUniversityType("other")}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold text-sm transition ${universityType === "other" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                  >
                    その他の大学
                  </button>
                </div>
              </div>

              {/* 他大学の場合: 大学名入力 */}
              {universityType === "other" && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900">大学名<span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    placeholder="例: 東京大学"
                    value={universityNameOther}
                    onChange={(e) => setUniversityNameOther(e.target.value)}
                  />
                </div>
              )}

              {/* 青山の場合: 学生番号 */}
              {universityType === "aoyama" && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900">学生番号<span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    placeholder="例: 1A234567"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    aria-invalid={!isStudentIdValid && normalizedStudentId.length > 0}
                  />
                  {!isStudentIdValid && normalizedStudentId.length > 0 ? (
                    <p className="text-sm text-red-600 flex items-start gap-2"><AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />先頭3文字が有効な学科コードの8文字で入力してください。</p>
                  ) : (
                    <p className="text-sm text-slate-600 flex items-start gap-2"><Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />入力形式に合致すると、学部・学科とメールアドレスを自動補完します。</p>
                  )}
                </div>
              )}

              {/* 氏名 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">氏名<span className="text-red-600">*</span></label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${showNameSpaceWarning ? "border-amber-400 bg-amber-50" : "border-slate-200"}`}
                  placeholder="例: 山田 太郎"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {showNameSpaceWarning ? (
                  <p className="text-sm text-amber-600 flex items-start gap-2"><AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />姓と名の間を<strong>半角スペース</strong>で区切ってください（例: 山田 太郎）</p>
                ) : (
                  <p className="text-sm text-slate-500 flex items-start gap-2"><Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />姓と名の間は<strong>半角スペース</strong>で区切ってください（例: 山田 太郎）</p>
                )}
              </div>

              {/* フリガナ */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">フリガナ<span className="text-red-600">*</span></label>
                <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="例: ヤマダ タロウ" value={furigana} onChange={(e) => setFurigana(e.target.value)} />
              </div>

              {/* 学部 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">学部<span className="text-red-600">*</span></label>
                {universityType === "aoyama" ? (
                  <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-600 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-not-allowed" placeholder="学生番号から自動補完" value={faculty} readOnly title="学生番号から自動補完されます" />
                ) : (
                  <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="例: 理工学部" value={faculty} onChange={(e) => setFaculty(e.target.value)} />
                )}
              </div>

              {/* 学科 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">学科<span className="text-red-600">*</span></label>
                {universityType === "aoyama" ? (
                  <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-600 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-not-allowed" placeholder="学生番号から自動補完" value={department} readOnly title="学生番号から自動補完されます" />
                ) : (
                  <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="例: 情報工学科" value={department} onChange={(e) => setDepartment(e.target.value)} />
                )}
              </div>

              {/* 学年 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">学年<span className="text-red-600">*</span></label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white" value={schoolYear} onChange={(e) => setSchoolYear(e.target.value)}>
                  <option value="">-- 選択してください --</option>
                  <option value="1年">1年</option>
                  <option value="2年">2年</option>
                  <option value="3年">3年</option>
                  <option value="4年">4年</option>
                </select>
              </div>

              {/* LINE名 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">LINE 名<span className="text-red-600">*</span></label>
                <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="例: Taro Yamada" value={lineName} onChange={(e) => setLineName(e.target.value)} />
              </div>

              {/* 電話番号 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">電話番号<span className="text-red-600">*</span></label>
                <input type="tel" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="例: 09012345678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>

              {/* メールアドレス */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">メールアドレス<span className="text-red-600">*</span></label>
                {universityType === "aoyama" ? (
                  <input className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-600 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-not-allowed" type="email" placeholder="学生番号から自動補完" value={autoCompletedEmail} readOnly title="学生番号から自動補完されます" />
                ) : (
                  <input type="email" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder="例: taro.yamada@example.com" value={emailOther} onChange={(e) => setEmailOther(e.target.value)} />
                )}
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 font-medium">{formError}</p>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isFormValid || submitting}
                >
                  {submitting ? "登録中..." : "名簿登録する"}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 md:p-8 mt-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-emerald-600" />このフォームについて
            </h2>
            <p className="text-slate-700 leading-relaxed">
              このフォームはすでにAPSへの加入が承認された方向けの名簿登録フォームです。<br />
              入力内容はダッシュボードの学生プロフィール一覧に反映されます。
            </p>
          </div>
        </div>
      </section>

      {submitted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
            <h2 className="text-2xl font-bold">登録完了</h2>
            <p className="text-slate-600">名簿への登録が完了しました。<br />ダッシュボードの学生プロフィール一覧に反映されます。</p>
            <Link href="/" className="block w-full px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">
              ホームに戻る
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
