"use client";

import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Alert, Button, Card, Input } from "@/components/ui";

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
    <SiteShell>
      <div className="mx-auto max-w-lg px-4 py-24">
        <Card>
          <h1 className="font-display text-3xl">Forgot password</h1>
          <p className="mt-2 text-sm text-white/55">
            Enter your email and we will send a Supabase reset link.
          </p>
          {sent ? (
            <div className="mt-6">
              <Alert tone="success">If that email is registered, reset instructions are on the way.</Alert>
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              {error ? <Alert>{error}</Alert> : null}
              <Input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                Send reset link
              </Button>
            </form>
          )}
        </Card>
      </div>
    </SiteShell>
  );
}
