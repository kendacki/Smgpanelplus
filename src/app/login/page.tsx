import { AuthShell } from "@/components/auth-shell";
import { SignInForm } from "@/components/sign-in-form";
import { Alert } from "@/components/ui";

export const metadata = { title: "Sign In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ checkEmail?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your SMG wallet and orders." tab="login">
      {params.checkEmail ? (
        <div className="mb-3">
          <Alert tone="success">Check your email to confirm the account, then sign in.</Alert>
        </div>
      ) : null}
      {params.error ? (
        <div className="mb-3">
          <Alert>{params.error}</Alert>
        </div>
      ) : null}
      <SignInForm />
    </AuthShell>
  );
}
