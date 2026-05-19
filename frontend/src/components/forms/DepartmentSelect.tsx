"use client";

import React, { forwardRef } from "react";

interface DepartmentSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  value?: string;
  onChange?: (value: string) => void;
}

const DEPARTMENTS = [
  "文学部 英米文学科",
  "文学部 フランス文学科",
  "文学部 日本文学科",
  "文学部 史学科",
  "文学部 比較芸術学科",
  "経済学部 経済学科",
  "経済学部 現代経済デザイン学科",
  "法学部 法学科",
  "法学部 ヒューマンライツ学科",
  "経営学部 経営学科",
  "経営学部 マーケティング学科",
  "理工学部 化学・生命科学科",
  "理工学部 電気電子工学科",
  "理工学部 機械創造工学科",
  "理工学部 経営システム工学科",
  "理工学部 情報テクノロジー学科",
  "理工学部 物理科学科",
  "理工学部 数理サイエンス学科",
  "国際政治経済学部 国際政治学科",
  "国際政治経済学部 国際経済学科",
  "国際政治経済学部 国際コミュニケーション学科",
  "総合文化政策学部 総合文化政策学科",
  "社会情報学部 社会情報学科",
  "教育人間科学部 教育学科",
  "教育人間科学部 心理学科",
  "地球社会共生学部 地球社会共生学科",
  "コミュニティ人間科学部 コミュニティ人間科学科",
];

const DepartmentSelect = forwardRef<HTMLSelectElement, DepartmentSelectProps>(
  ({ value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <select ref={ref} {...props} value={value ?? ""} onChange={handleChange}>
        <option value="">-- 選択してください --</option>
        {DEPARTMENTS.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
    );
  }
);

DepartmentSelect.displayName = "DepartmentSelect";

export default DepartmentSelect;
