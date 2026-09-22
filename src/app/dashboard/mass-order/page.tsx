"use client";

import { useState } from "react";
import { Alert, Button, Card, Spinner, Textarea } from "@/components/ui";

export default function MassOrderPage() {
  const [lines, setLines] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders/mass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Mass order failed");
        return;
      }
      setResult(
        `Created ${data.created.length} order(s). ${data.errors.length} line(s) skipped.${
          data.errors.length
            ? " " + data.errors.map((e: { line: number; message: string }) => `L${e.line}: ${e.message}`).join(" | ")
            : ""
        }`,
      );
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl">Mass order</h1>
      <p className="mt-2 text-sm text-white/50">
        One order per line: <code>serviceId | link | quantity</code>
      </p>
      <Card className="mt-6">
        <form onSubmit={submit} className="space-y-4">
          {error ? <Alert>{error}</Alert> : null}
          {result ? <Alert tone="success">{result}</Alert> : null}
          <Textarea
            rows={12}
            value={lines}
            onChange={(e) => setLines(e.target.value)}
            placeholder="clxyz123 | https://instagram.com/p/xxxxx | 1000"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : null} Submit mass order
          </Button>
        </form>
      </Card>
    </div>
  );
}
