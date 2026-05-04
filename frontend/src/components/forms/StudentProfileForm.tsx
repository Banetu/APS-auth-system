"use client";

import React, { useState } from 'react';
import { StudentProfile } from "@/actions/student-registration";
import DepartmentSelect from "./DepartmentSelect";
import FuriganaInput from "./FuriganaInput";

interface StudentProfileFormProps {
  initialData?: StudentProfile | null;
  hasExistingProfile?: boolean;
  onSubmit: (data: StudentProfile) => void;
  onBack?: () => void;
  submitLabel?: string;
}

export default function StudentProfileForm({
  initialData,
  hasExistingProfile = false,
  onSubmit,
  onBack,
  submitLabel = "送信",
}: StudentProfileFormProps) {
  const [formData, setFormData] = useState<StudentProfile>(
    initialData || {
      student_number: "",
      name: "",
      furigana: "",
      department: "",
      gender: null,
      phone: "",
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.student_number.trim()) {
      newErrors.student_number = "学生番号は必須です";
    }
    if (!formData.name.trim()) {
      newErrors.name = "氏名は必須です";
    }
    if (!formData.furigana.trim()) {
      newErrors.furigana = "フリガナは必須です";
    }
    if (!formData.department) {
      newErrors.department = "学部・学科は必須です";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "電話番号は必須です";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof StudentProfile, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 学生番号 */}
      <div>
        <label htmlFor="student_number" className="block text-sm font-bold text-slate-900 mb-2">
          学生番号<span className="text-red-600">*</span>
        </label>
        <input
          id="student_number"
          type="text"
          value={formData.student_number}
          onChange={(e) => handleChange("student_number", e.target.value.toUpperCase())}
          className={`w-full px-4 py-3 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
            errors.student_number ? "border-red-500" : "border-slate-200"
          }`}
          placeholder="例: 1A234567"
          disabled={isLoading}
        />
        {errors.student_number && (
          <p className="text-sm text-red-600 mt-1">{errors.student_number}</p>
        )}
      </div>

      {/* 氏名 */}
      <div>
        <label htmlFor="name" className="block text-sm font-bold text-slate-900 mb-2">
          氏名<span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
            errors.name ? "border-red-500" : "border-slate-200"
          }`}
          placeholder="例: 山田 太郎"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name}</p>
        )}
      </div>

      {/* フリガナ */}
      <div>
        <label htmlFor="furigana" className="block text-sm font-bold text-slate-900 mb-2">
          フリガナ<span className="text-red-600">*</span>
        </label>
        <FuriganaInput
          id="furigana"
          value={formData.furigana}
          onChange={(value) => handleChange("furigana", value)}
          placeholder="例: ヤマダ タロウ"
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
            errors.furigana ? "border-red-500" : "border-slate-200"
          }`}
        />
        {errors.furigana && (
          <p className="text-sm text-red-600 mt-1">{errors.furigana}</p>
        )}
      </div>

      {/* 学部・学科 */}
      <div>
        <label htmlFor="department" className="block text-sm font-bold text-slate-900 mb-2">
          学部・学科<span className="text-red-600">*</span>
        </label>
        <DepartmentSelect
          id="department"
          value={formData.department}
          onChange={(value) => handleChange("department", value)}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
            errors.department ? "border-red-500" : "border-slate-200"
          }`}
        />
        {errors.department && (
          <p className="text-sm text-red-600 mt-1">{errors.department}</p>
        )}
      </div>

      {/* 性別 */}
      <div>
        <label htmlFor="gender" className="block text-sm font-bold text-slate-900 mb-2">
          性別
        </label>
        <select
          id="gender"
          value={formData.gender || ""}
          onChange={(e) => handleChange("gender", e.target.value || null)}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          disabled={isLoading}
        >
          <option value="">選択してください</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
      </div>

      {/* 電話番号 */}
      <div>
        <label htmlFor="phone" className="block text-sm font-bold text-slate-900 mb-2">
          電話番号<span className="text-red-600">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
            errors.phone ? "border-red-500" : "border-slate-200"
          }`}
          placeholder="例: 090-1234-5678"
          disabled={isLoading}
        />
        {errors.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
        )}
      </div>

      {/* ボタン */}
      <div className="flex gap-3 pt-6">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="px-6 py-3 border border-slate-300 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
          >
            戻る
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {isLoading ? "送信中..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
