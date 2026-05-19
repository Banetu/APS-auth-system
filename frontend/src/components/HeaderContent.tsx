'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function HeaderContent() {
  const { data: session, status } = useSession();

  return (
    <header className="w-full border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/50">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-wide">
          Aoyama Piano Society
        </Link>
        <div className="flex items-center gap-2">
          {status === "authenticated" ? (
            <>
              <span className="text-sm text-slate-600 hidden sm:inline">{session.user?.email}</span>
              {(session.user as any)?.role === "admin" && (
                <Link
                  href="/dashboard"
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  ダッシュボード
                </Link>
              )}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md bg-black px-3 py-1.5 text-sm text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                ログアウト
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