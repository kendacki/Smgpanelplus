"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { Alert, Button, Card, Input, Spinner } from "@/components/ui";
import { useApp } from "@/components/providers";

export default function RegisterPage() {
  const router = useRouter();
  const { setSession } = useApp();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to register");
        return;
      }
      setSession(data.user);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell>
      <div className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
        <div>
          <p className="text-smg">Create account</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">Start growing with SMG Panel</h1>
          <p className="mt-3 text-white/60">
            Wallet, API, mass orders and child panels — all in one African SMM panel.
          </p>
        </div>
        <Card className="orange-ring">
          <form onSubmit={onSubmit} className="space-y-4">
            {error ? <Alert>{error}</Alert> : null}
            <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              placeholder="Password (min 8 characters)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner /> : null} Sign Up
            </Button>
            <p className="text-center text-sm text-white/50">
              Already registered? <Link href="/login" className="text-smg">Sign in</Link>
            </p>
          </form>
        </Card>
      </div>
    </SiteShell>
  );
}
