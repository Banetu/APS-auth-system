export interface StudentProfile {
  student_number: string;
  name: string;
  furigana: string;
  department: string;
  gender: string | null;
  phone: string;
}

export interface EligibilityCheckResult {
  can_register: boolean;
  is_pre_member: boolean;
  is_paid: boolean;
  reason?: string;
}

export async function submitStudentProfile(data: StudentProfile) {
  // Implementation would be added later
  console.log("submitStudentProfile called with:", data);
}

export async function getStudentProfile() {
  // Implementation would be added later
  return null;
}

export async function sendOTP(studentNumber: string): Promise<{ success: boolean; error?: string }> {
  // Implementation would be added later
  return { success: true };
}

export async function verifyOTP(studentNumber: string, code: string): Promise<{ success: boolean; error?: string }> {
  // Implementation would be added later
  return { success: true };
}

export async function checkEligibility(): Promise<{ eligible: boolean; reason?: string }> {
  // Implementation would be added later
  return { eligible: true };
}
