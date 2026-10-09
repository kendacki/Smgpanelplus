"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";
import { Alert, Button, Spinner } from "./ui";
import { AuthField } from "./auth-field";
import { AccountCreatedModal } from "./account-created-modal";
import { useApp } from "./providers";

export function SignUpForm() {
  const router = useRouter();
  const { setSession } = useApp();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<{ next: string; notice: string } | null>(null);
  const continued = useRef(false);

  const goNext = useCallback(() => {
    if (!created || continued.current) return;
    continued.current = true;
    router.push(created.next);
    router.refresh();
  }, [created, router]);

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
      if (data.needsConfirmation) {
        setCreated({
          next: "/login?checkEmail=1",
          notice: "Check your email to confirm, then sign in. Your wallet will be waiting.",
        });
        return;
      }
      setSession(data.user);
      setCreated({
        next: "/dashboard",
        notice: "Your wallet is ready. Opening the dashboard…",
      });
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {created ? <AccountCreatedModal notice={created.notice} onContinue={goNext} /> : null}
      <form onSubmit={onSubmit} className="space-y-3">
        {error ? <Alert>{error}</Alert> : null}
        <AuthField
          icon={<User className="h-4 w-4" />}
          autoComplete="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
        />
        <AuthField
          icon={<Mail className="h-4 w-4" />}
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthField
          icon={<Lock className="h-4 w-4" />}
          type="password"
          autoComplete="new-password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <Button type="submit" className="mt-1 w-full" disabled={loading}>
          {loading ? <Spinner /> : null}
          Create account
        </Button>
      </form>
    </>
  );
}
