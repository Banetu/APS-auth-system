import { auth } from "@/auth";
import { getStudentProfile } from "@/actions/student-registration";
import ProfileForm from "./ProfileForm";
import styles from "../join/join.module.css";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  const email = session?.user?.email;
  const role = session?.user?.role ?? "none";
  const callback = encodeURIComponent("/profile");

  if (!email) {
    redirect(`/login?callbackUrl=${callback}`);
  }

  const isMember = role === "member" || role === "admin" || role === "obog";
  if (!isMember) {
    // ログイン済みだが権限なし → /login に戻すと無限ループになるので / へ
    redirect("/");
  }

  // Fetch existing profile (may be null)
  const profile = await getStudentProfile();

  return (
    <main className={styles.page}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>プロフィール</h1>
      <p style={{ marginBottom: 18, color: "#6b7280" }}>
        学生情報が未登録の場合はここで登録・修正してください。
      </p>

      <ProfileForm initial={profile} />
    </main>
  );
}
