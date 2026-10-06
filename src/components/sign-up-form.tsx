"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";
import { Alert, Button, Spinner } from "./ui";
import { AuthField } from "./auth-field";
import { useApp } from "./providers";

export function SignUpForm() {
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
      if (data.needsConfirmation) {
        router.push("/login?checkEmail=1");
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
  );
}
