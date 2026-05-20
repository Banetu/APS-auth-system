"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle, FileText, AlertCircle, Info } from "lucide-react";
import { validateFullName } from "../../../../lib/validation";
import { submitJoinRequest } from "../../../../lib/api";

export default function OtherStudentFormPage() {
  const [universityName, setUniversityName] = useState("");
  const [name, setName] = useState("");
  const [furigana, setFurigana] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [lineName, setLineName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isNameValid = validateFullName(name);
  const nameHasHalfWidthSpace = name.trim().includes(" ");
  const showNameSpaceWarning = name.trim().length >= 2 && !nameHasHalfWidthSpace;

  const isFormValid =
    universityName.trim() &&
    isNameValid &&
    furigana.trim() &&
    faculty.trim() &&
    department.trim() &&
    schoolYear &&
    lineName.trim() &&
    phoneNumber.trim() &&
    email.trim();

  const handleSubmit = async () => {
    setFormError(null);
    if (!universityName.trim()) { setFormError("大学名を入力してください。"); return; }
    if (!isNameValid) { setFormError("氏名は「姓<半角スペース>名」の形式で入力してください。"); return; }
    if (!furigana.trim()) { setFormError("フリガナを入力してください。"); return; }
    if (!faculty.trim()) { setFormError("学部を入力してください。"); return; }
    if (!department.trim()) { setFormError("学科を入力してください。"); return; }
    if (!schoolYear) { setFormError("学年を選択してください。"); return; }
    if (!lineName.trim()) { setFormError("LINE 名を入力してください。"); return; }
    if (!phoneNumber.trim()) { setFormError("電話番号を入力してください。"); return; }
    if (!email.trim()) { setFormError("メールアドレスを入力してください。"); return; }
    const metadata = { furigana, faculty, department, school_year: schoolYear, line_name: lineName, phone_number: phoneNumber };
    setSubmitting(true);
    try {
      await submitJoinRequest({ email: email.trim(), name, form_type: "other", university_name: universityName.trim(), metadata });
      setSubmitted(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "送信に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-slate-50 text-slate-900 font-sans min-h-screen">
      <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-10 pb-10 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200/50 bg-blue-50/50">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">他大学の方向け</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">入会フォーム</h1>
        </div>
      </section>
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm mb-8">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }}>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">大学名<span className="text-red-600">*</span></label>
                <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="例: 東京大学" value={universityName} onChange={(e) => setUniversityName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">氏名<span className="text-red-600">*</span></label>
                <input type="text" className={`w-full px-4 py-3 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${showNameSpaceWarning ? "border-amber-400 bg-amber-50" : "border-slate-200"}`} placeholder="例: 山田 太郎" value={name} onChange={(e) => setName(e.target.value)} />
                {showNameSpaceWarning ? (
                  <p className="text-sm text-amber-600 flex items-start gap-2"><AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />姓と名の間を<strong>半角スペース</strong>で区切ってください</p>
                ) : (
                  <p className="text-sm text-slate-500 flex items-start gap-2"><Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />姓と名の間は<strong>半角スペース</strong>で区切ってください（例: 山田 太郎）</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">フリガナ<span className="text-red-600">*</span></label>
                <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="例: ヤマダ タロウ" value={furigana} onChange={(e) => setFurigana(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">学部<span className="text-red-600">*</span></label>
                <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="例: 理工学部" value={faculty} onChange={(e) => setFaculty(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">学科<span className="text-red-600">*</span></label>
                <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="例: 情報工学科" value={department} onChange={(e) => setDepartment(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">学年<span className="text-red-600">*</span></label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white" value={schoolYear} onChange={(e) => setSchoolYear(e.target.value)}>
                  <option value="">-- 選択してください --</option>
                  <option value="1年">1年</option>
                  <option value="2年">2年</option>
                  <option value="3年">3年</option>
                  <option value="4年">4年</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">LINE 名<span className="text-red-600">*</span></label>
                <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="例: Taro Yamada" value={lineName} onChange={(e) => setLineName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">電話番号<span className="text-red-600">*</span></label>
                <input type="tel" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="例: 09012345678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">メールアドレス<span className="text-red-600">*</span></label>
                <input type="email" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="例: taro.yamada@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 font-medium">{formError}</p>
                </div>
              )}
              <div className="pt-4">
                <button type="submit" className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isFormValid || submitting}>
                  {submitting ? "送信中..." : "送信する"}
                </button>
              </div>
            </form>
          </div>
          <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-6 md:p-8 mt-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />入会の流れ
            </h2>
            <ol className="space-y-3 ml-4 text-slate-700 leading-relaxed">
              <li className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</span><span>必要事項を入力して「送信する」をクリックしてください。</span></li>
              <li className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</span><span>送信後、APSのメンバーに学生証をお見せください。</span></li>
              <li className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</span><span>確認後、LINEグループに招待いたします。</span></li>
            </ol>
          </div>
        </div>
      </section>
      {submitted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-blue-500 mx-auto" />
            <h2 className="text-2xl font-bold">送信完了</h2>
            <p className="text-slate-600">入会リクエストを受け付けました。<br /><strong>青山ピアノソサイエティのメンバーに学生証をお見せください。その後ライングループに招待いたします。</strong></p>
            <Link href="/" className="block w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">ホームに戻る</Link>
          </div>
        </div>
      )}
    </main>
  );
}
