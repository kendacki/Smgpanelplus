"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Alert, Spinner } from "./ui";
import { useApp } from "./providers";

export function SignInForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { setSession } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, remember }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to sign in");
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
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? <Alert>{error}</Alert> : null}
      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Username</label>
        <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="demo" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-white/70">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="accent-orange-500"
          />
          Remember me
        </label>
        <a href="/forgot-password" className="text-smg hover:underline">
          Forgot Password?
        </a>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Spinner /> : null}
        Sign In
      </Button>
      {!compact ? (
        <p className="text-center text-sm text-white/55">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-smg">
            Sign up
          </a>
        </p>
      ) : null}
    </form>
  );
}
