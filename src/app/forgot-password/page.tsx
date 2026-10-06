"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { AuthField } from "@/components/auth-field";
import { Alert, Button, Spinner } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not send reset email");
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Reset password" subtitle="We’ll email a reset link if that account exists." tab="forgot">
      {sent ? (
        <Alert tone="success">If that email is registered, reset instructions are on the way.</Alert>
      ) : (
        <form className="space-y-3" onSubmit={onSubmit}>
          {error ? <Alert>{error}</Alert> : null}
          <AuthField
            icon={<Mail className="h-4 w-4" />}
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner /> : null}
            Send reset link
          </Button>
        </form>
      )}
      <p className="mt-4 text-center text-sm text-white/50">
        <Link href="/login" className="text-smg hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
