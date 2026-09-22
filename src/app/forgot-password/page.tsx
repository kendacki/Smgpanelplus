"use client";

import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Alert, Button, Card, Input } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <SiteShell>
      <div className="mx-auto max-w-lg px-4 py-24">
        <Card>
          <h1 className="font-display text-3xl">Forgot password</h1>
          <p className="mt-2 text-sm text-white/55">
            Enter your email. If an account exists, we will send reset instructions. For this demo,
            use <b>demo / Password123!</b> or ask an admin to reset it.
          </p>
          {sent ? (
            <div className="mt-6">
              <Alert tone="success">If that email is registered, reset instructions are on the way.</Alert>
            </div>
          ) : (
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <Input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full">
                Send reset link
              </Button>
            </form>
          )}
        </Card>
      </div>
    </SiteShell>
  );
}
