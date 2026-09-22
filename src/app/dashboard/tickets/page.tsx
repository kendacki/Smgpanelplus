"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, EmptyState, Input, Spinner, Textarea } from "@/components/ui";

type Ticket = {
  id: string;
  subject: string;
  status: string;
  replies: { id: string; message: string; user: { username: string; role: string } }[];
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/tickets");
    const data = await res.json();
    setTickets(data.tickets || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function createTicket(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not open ticket");
        return;
      }
      setSubject("");
      setMessage("");
      await load();
      setActive(data.ticket.id);
    } finally {
      setLoading(false);
    }
  }

  async function sendReply(id: string) {
    await fetch(`/api/tickets/${id}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: reply }),
    });
    setReply("");
    await load();
  }

  const current = tickets.find((t) => t.id === active);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-3xl">Tickets</h1>
        <Card className="mt-6">
          <form onSubmit={createTicket} className="space-y-4">
            {error ? <Alert>{error}</Alert> : null}
            <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <Textarea rows={5} placeholder="Describe the issue" value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner /> : null} Open ticket
            </Button>
          </form>
        </Card>
        <div className="mt-6 space-y-2">
          {tickets.length === 0 ? (
            <EmptyState title="No tickets" body="Open one if an order needs attention." />
          ) : (
            tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className="block w-full rounded-2xl border border-white/10 px-4 py-3 text-left hover:bg-white/5"
              >
                <p className="font-medium">{t.subject}</p>
                <p className="text-xs text-white/45">{t.status}</p>
              </button>
            ))
          )}
        </div>
      </div>
      <Card>
        {current ? (
          <div>
            <h2 className="font-semibold">{current.subject}</h2>
            <div className="mt-4 space-y-3">
              {current.replies.map((r) => (
                <div key={r.id} className="rounded-2xl bg-white/5 p-3 text-sm">
                  <p className="text-xs text-white/40">
                    {r.user.username} · {r.user.role}
                  </p>
                  <p className="mt-1">{r.message}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply" />
              <Button type="button" onClick={() => sendReply(current.id)}>
                Send
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-white/50">Select a ticket to view the thread.</p>
        )}
      </Card>
    </div>
  );
}
