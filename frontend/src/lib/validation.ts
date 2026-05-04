export function getDepartmentsFromStudentId(studentId: string): string[] {
  // 学生番号の最初の文字で学部を判定
  const firstChar = studentId.charAt(0).toUpperCase();

  const departmentMap: Record<string, string[]> = {
    "1": ["文学部 日本文学専攻", "文学部 英米文学専攻"],
    "2": ["経営学部 経営学科", "経営学部 会計学科"],
    "3": ["理工学部 電子工学科", "理工学部 情報テクノロジー学科"],
    "4": ["法学部 法律学科", "法学部 政治学科"],
    "S": ["大学院 文学研究科", "大学院 経営学研究科"],
  };

  return departmentMap[firstChar] || [];
}

export function validateFullName(name: string): boolean {
  // 空でなく、3文字以上の名前をチェック
  return name.trim().length >= 3;
}

export function validateStudentId(studentId: string): boolean {
  // 形式: 先頭が 1-4 または S、その後英数字で7文字、計8文字
  const pattern = /^[1234S][A-Za-z0-9]{7}$/;
  return pattern.test(studentId.trim().toUpperCase());
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
