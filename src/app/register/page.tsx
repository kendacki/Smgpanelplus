import { AuthShell } from "@/components/auth-shell";
import { SignUpForm } from "@/components/sign-up-form";

export const metadata = { title: "Sign Up" };

export default function RegisterPage() {
  return (
    <AuthShell title="Create your account" subtitle="Wallet, orders, and reseller API in one place." tab="register">
      <SignUpForm />
    </AuthShell>
  );
}
