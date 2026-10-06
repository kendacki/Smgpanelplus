import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "./logo";

export function AuthShell({
  title,
  subtitle,
  tab,
  children,
}: {
  title: string;
  subtitle: string;
  tab: "login" | "register" | "forgot";
  children: ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-8">
      <div className="mesh pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative w-full max-w-[400px]">
        <div className="mb-6 flex justify-center">
          <Logo compact />
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/55 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {tab !== "forgot" ? (
            <div className="mb-5 grid grid-cols-2 rounded-full bg-white/5 p-1">
              <Link
                href="/login"
                className={
                  tab === "login"
                    ? "rounded-full smg-gradient py-2 text-center text-sm font-semibold text-black"
                    : "rounded-full py-2 text-center text-sm text-white/55 hover:text-white"
                }
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className={
                  tab === "register"
                    ? "rounded-full smg-gradient py-2 text-center text-sm font-semibold text-black"
                    : "rounded-full py-2 text-center text-sm text-white/55 hover:text-white"
                }
              >
                Sign up
              </Link>
            </div>
          ) : null}
          <h1 className="font-display text-xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-white/50">{subtitle}</p>
          <div className="mt-5">{children}</div>
        </div>
        <p className="mt-4 text-center text-xs text-white/35">
          <Link href="/" className="hover:text-white/70">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
