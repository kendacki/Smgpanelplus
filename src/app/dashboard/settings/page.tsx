"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, Input, Select, Spinner } from "@/components/ui";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { useApp } from "@/components/providers";

export default function SettingsPage() {
  const { setCurrency } = useApp();
  const [email, setEmail] = useState("");
  const [currency, setLocalCurrency] = useState<CurrencyCode>("NGN");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setEmail(d.user?.email || "");
        setLocalCurrency((d.user?.currency || "NGN") as CurrencyCode);
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          currency,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Update failed");
        return;
      }
      setCurrency(currency);
      setMessage("Settings saved");
      setCurrentPassword("");
      setNewPassword("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl">Settings</h1>
      <Card className="mt-6">
        <form onSubmit={save} className="space-y-4">
          {error ? <Alert>{error}</Alert> : null}
          {message ? <Alert tone="success">{message}</Alert> : null}
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Select
            value={currency}
            onChange={(e) => setLocalCurrency(e.target.value as CurrencyCode)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </Select>
          <Input
            type="password"
            placeholder="Current password (only if changing)"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : null} Save
          </Button>
        </form>
      </Card>
    </div>
  );
}
