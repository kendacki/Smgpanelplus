"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card } from "@/components/ui";

export default function ApiPage() {
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setApiKey(d.user?.apiKey || ""));
  }, []);

  async function rotate() {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rotateApiKey: true }),
    });
    const data = await res.json();
    setApiKey(data.apiKey);
    setMessage("API key rotated. Update your scripts.");
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl">API</h1>
      <p className="mt-2 text-sm text-white/50">
        Standard SMM v2 endpoint: <code>/api/v2</code>
      </p>
      <Card className="mt-6 space-y-4">
        {message ? <Alert tone="success">{message}</Alert> : null}
        <div>
          <p className="text-xs uppercase tracking-wider text-white/40">API key</p>
          <code className="mt-2 block overflow-x-auto rounded-xl bg-black/50 p-3 text-sm text-orange-100">
            {apiKey || "Generating…"}
          </code>
        </div>
        <Button type="button" variant="outline" onClick={rotate}>
          Rotate key
        </Button>
        <pre className="overflow-x-auto rounded-2xl bg-black/50 p-4 text-xs text-white/70">{`curl -X POST ${typeof window !== "undefined" ? window.location.origin : ""}/api/v2 \\
  -H "Content-Type: application/json" \\
  -d '{"key":"${apiKey}","action":"balance"}'`}</pre>
      </Card>
    </div>
  );
}
