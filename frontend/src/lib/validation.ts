export function getDepartmentsFromStudentId(studentId: string): string[] {
  // 学生番号の先頭3文字（学科コード）で学部学科を判定
  const normalized = studentId.trim().toUpperCase();
  const code = normalized.slice(0, 3);

  const departmentMap: Record<string, string[]> = {
    "113": ["文学部 英米文学科"],
    "114": ["文学部 フランス文学科"],
    "115": ["文学部 日本文学科"],
    "116": ["文学部 史学科"],
    "118": ["文学部 比較芸術学科"],
    "121": ["経済学部 経済学科"],
    "122": ["経済学部 現代経済デザイン学科"],
    "131": ["法学部 法学科"],
    "132": ["法学部 ヒューマンライツ学科"],
    "141": ["経営学部 経営学科"],
    "142": ["経営学部 マーケティング学科"],
    "152": ["理工学部 化学・生命科学科"],
    "154": ["理工学部 電気電子工学科"],
    "156": ["理工学部 機械創造工学科"],
    "157": ["理工学部 経営システム工学科"],
    "158": ["理工学部 情報テクノロジー学科"],
    "159": ["理工学部 物理科学科"],
    "15A": ["理工学部 数理サイエンス学科"],
    "161": ["国際政治経済学部 国際政治学科"],
    "162": ["国際政治経済学部 国際経済学科"],
    "164": ["国際政治経済学部 国際コミュニケーション学科"],
    "171": ["総合文化政策学部 総合文化政策学科"],
    "181": ["社会情報学部 社会情報学科"],
    "191": ["教育人間科学部 教育学科"],
    "192": ["教育人間科学部 心理学科"],
    "1A1": ["地球社会共生学部 地球社会共生学科"],
    "1B1": ["コミュニティ人間科学部 コミュニティ人間科学科"],
  };

  return departmentMap[code] || [];
}

export function validateFullName(name: string): boolean {
  // 「姓<半角スペース>名」形式を必須とし、3文字以上
  const trimmed = name.trim();
  return trimmed.length >= 3 && trimmed.includes(' ');
}

export function validateStudentId(studentId: string): boolean {
  // 形式: 先頭3文字が定義済み学科コードで、全8文字
  const normalized = studentId.trim().toUpperCase();
  if (!/^[A-Z0-9]{8}$/.test(normalized)) {
    return false;
  }

  const validCodes = new Set([
    "113", "114", "115", "116", "118",
    "121", "122",
    "131", "132",
    "141", "142",
    "152", "154", "156", "157", "158", "159", "15A",
    "161", "162", "164",
    "171",
    "181",
    "191", "192",
    "1A1", "1B1",
  ]);

  return validCodes.has(normalized.slice(0, 3));
}

export function validateEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  // シンプルなチェック - ハイフンを含む日本の電話番号形式
  const pattern = /^[\d\-]{10,}$/;
  return pattern.test(phone.trim());
}
