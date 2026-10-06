"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, Input, Spinner } from "@/components/ui";
import { PANEL_CURRENCY } from "@/lib/currency";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
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
        setAvatarUrl(d.user?.avatarUrl || "");
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
          currency: PANEL_CURRENCY,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Update failed");
        return;
      }
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
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
          ) : null}
          <input
            type="file"
            accept="image/*"
            className="text-sm text-white/70"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const form = new FormData();
              form.set("file", file);
              form.set("kind", "avatar");
              const res = await fetch("/api/uploads", { method: "POST", body: form });
              const data = await res.json();
              if (res.ok) setAvatarUrl(data.url);
              else setError(data.error || "Upload failed");
            }}
          />
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <p className="text-sm text-white/50">Wallet currency is USDT only.</p>
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
