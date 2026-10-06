import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui";
import { SignInForm } from "@/components/sign-in-form";
import { Logo } from "@/components/logo";

export const metadata = { title: "Sign In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ checkEmail?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <SiteShell>
      <div className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
        <div>
          <Logo />
          <h1 className="mt-8 font-display text-4xl font-semibold">Welcome back</h1>
          <p className="mt-3 text-white/60">
            Sign in with your SMG account. Auth is powered by Supabase.
          </p>
        </div>
        <Card className="orange-ring">
          <h2 className="mb-6 font-display text-2xl">Sign in</h2>
          {params.checkEmail ? (
            <p className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              Check your email to confirm the account, then sign in.
            </p>
          ) : null}
          {params.error ? (
            <p className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {params.error}
            </p>
          ) : null}
          <SignInForm />
          <p className="mt-4 text-center text-sm text-white/50">
            New here? <Link href="/register" className="text-smg">Create an account</Link>
          </p>
        </Card>
      </div>
    </SiteShell>
  );
}
