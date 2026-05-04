'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { logoutAction } from "@/app/actions/logout";

export default function HeaderContent() {
  const { data: session } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // サーバーアクションでログアウト
      await logoutAction();
    } catch (error) {
      console.error("Logout error:", error);
      // エラーが発生してもホームページにリダイレクト
      window.location.href = "/";
    }
  };

  return (
    <header className="w-full border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/50">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-wide">
          Aoyama Piano Society
        </Link>
        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              {session.user.email && (
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {session.user.email}
                </span>
              )}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-md bg-black px-3 py-1.5 text-sm text-white hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                {isLoggingOut ? "ロード中..." : "ログアウト"}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-black px-3 py-1.5 text-sm text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
            >
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}