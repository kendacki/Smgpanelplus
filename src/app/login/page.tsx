import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui";
import { SignInForm } from "@/components/sign-in-form";
import { Logo } from "@/components/logo";

export const metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <SiteShell>
      <div className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
        <div>
          <Logo />
          <h1 className="mt-8 font-display text-4xl font-semibold">Access your SMG account</h1>
          <p className="mt-3 text-white/60">
            Take control of your social media growth. Demo login: <b>demo</b> / <b>Password123!</b>
          </p>
        </div>
        <Card className="orange-ring">
          <h2 className="mb-6 font-display text-2xl">Sign in</h2>
          <SignInForm />
          <p className="mt-4 text-center text-sm text-white/50">
            New here? <Link href="/register" className="text-smg">Create an account</Link>
          </p>
        </Card>
      </div>
    </SiteShell>
  );
}
