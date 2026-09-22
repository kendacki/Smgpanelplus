"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, EmptyState, Input, Select, Spinner } from "@/components/ui";
import { PAYMENT_METHODS } from "@/lib/constants";
import { useApp } from "@/components/providers";
import { formatMoney, getCurrency } from "@/lib/currency";
import { paymentStatusLabel } from "@/lib/utils";

type Payment = {
  id: string;
  amount: number;
  method: string;
  status: string;
  reference: string;
  createdAt: string;
};

export default function AddFundsPage() {
  const { currency } = useApp();
  const [amount, setAmount] = useState(5000);
  const [method, setMethod] = useState("demo");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/wallet");
    const data = await res.json();
    setPayments(data.payments || []);
    setBalance(data.balance || 0);
  }

  useEffect(() => {
    load();
  }, []);

  const methods = PAYMENT_METHODS.filter((m) => m.currencies.includes(currency));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, method, currency }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Payment failed");
        return;
      }
      setMessage(`${data.message} Reference: ${data.payment.reference}`);
      await load();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-3xl">Add funds</h1>
        <p className="mt-1 text-sm text-white/50">
          Wallet balance: <span className="text-smg">{formatMoney(balance, getCurrency(currency))}</span>
        </p>
        <Card className="mt-6">
          <form onSubmit={submit} className="space-y-4">
            {error ? <Alert>{error}</Alert> : null}
            {message ? <Alert tone="success">{message}</Alert> : null}
            <div>
              <label className="mb-1 block text-xs text-white/50">Amount ({currency})</label>
              <Input type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/50">Method</label>
              <Select value={method} onChange={(e) => setMethod(e.target.value)}>
                {methods.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </Select>
              <p className="mt-2 text-xs text-white/45">
                {methods.find((m) => m.id === method)?.description}
              </p>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner /> : null} Pay now
            </Button>
          </form>
        </Card>
      </div>
      <div>
        <h2 className="font-semibold">Payment history</h2>
        <div className="mt-4 overflow-x-auto rounded-3xl border border-white/10">
          {payments.length === 0 ? (
            <div className="p-4">
              <EmptyState title="No payments" body="Fund your wallet to start ordering." />
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-white/50">
                <tr>
                  <th className="px-3 py-2 text-left">Ref</th>
                  <th className="px-3 py-2 text-left">Method</th>
                  <th className="px-3 py-2 text-left">Amount</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-white/8">
                    <td className="px-3 py-2 font-mono text-xs">{p.reference}</td>
                    <td className="px-3 py-2">{p.method}</td>
                    <td className="px-3 py-2">{formatMoney(p.amount, getCurrency(currency))}</td>
                    <td className="px-3 py-2">{paymentStatusLabel(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
