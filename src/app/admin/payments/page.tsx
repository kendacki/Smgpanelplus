"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { formatMoney } from "@/lib/currency";

type Payment = {
  id: string;
  amount: number;
  method: string;
  status: string;
  reference: string;
  user: { username: string };
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  async function load() {
    const res = await fetch("/api/admin/payments");
    const data = await res.json();
    setPayments(data.payments || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function update(id: string, status: string) {
    await fetch("/api/admin/payments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Payments</h1>
      <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-white/50">
            <tr>
              <th className="px-3 py-3">User</th>
              <th className="px-3 py-3">Method</th>
              <th className="px-3 py-3">Amount</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-white/8">
                <td className="px-3 py-3">{p.user.username}</td>
                <td className="px-3 py-3">{p.method}</td>
                <td className="px-3 py-3">{formatMoney(p.amount, "NGN")}</td>
                <td className="px-3 py-3">{p.status}</td>
                <td className="px-3 py-3">
                  {p.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <Button className="rounded-lg px-3 py-1 text-xs" onClick={() => update(p.id, "COMPLETED")}>
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-lg px-3 py-1 text-xs"
                        onClick={() => update(p.id, "REJECTED")}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    p.reference
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
