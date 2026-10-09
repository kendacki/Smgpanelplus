"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, Spinner } from "@/components/ui";

type ProviderInfo = {
  configured: boolean;
  url: string;
  markup: number;
  services: number;
  providerServices: number;
  balance: { balance?: string; currency?: string; error?: string } | null;
};

export default function AdminServicesPage() {
  const [info, setInfo] = useState<ProviderInfo | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/provider");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not load provider");
      return;
    }
    setInfo(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function sync() {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/provider", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sync failed");
        return;
      }
      setMessage(`Imported ${data.imported} provider services.`);
      await load();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Provider</h1>
      <p className="mt-2 text-sm text-white/50">
        SMG Panel sells through SMMTurk. Users order here; we fulfill on{" "}
        <code>smmturk.org/api/v2</code>.
      </p>
      {error ? (
        <div className="mt-4">
          <Alert>{error}</Alert>
        </div>
      ) : null}
      {message ? (
        <div className="mt-4">
          <Alert tone="success">{message}</Alert>
        </div>
      ) : null}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-white/40">Status</p>
          <p className="mt-2 font-display text-2xl">{info?.configured ? "Connected" : "Not configured"}</p>
          <p className="mt-2 break-all text-xs text-white/45">{info?.url}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-white/40">Provider balance</p>
          <p className="mt-2 font-display text-2xl">
            {info?.balance?.balance
              ? `${info.balance.balance} ${info.balance.currency ?? ""}`
              : info?.balance?.error || "—"}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-white/40">Live services</p>
          <p className="mt-2 font-display text-2xl">{info?.providerServices ?? "…"}</p>
          <p className="mt-2 text-xs text-white/45">Markup {info ? `${Math.round((info.markup - 1) * 100)}%` : "—"}</p>
        </Card>
      </div>
      <div className="mt-6">
        <Button onClick={sync} disabled={loading || !info?.configured}>
          {loading ? <Spinner /> : null} Sync service list
        </Button>
      </div>
    </div>
  );
}
