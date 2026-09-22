"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { formatMoney } from "@/lib/currency";

type Stats = {
  users: number;
  orders: number;
  payments: number;
  services: number;
  revenue: number;
};

export default function AdminHome() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<{ id: string; status: string; charge: number; user: { username: string }; service: { name: string } }[]>([]);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setRecent(d.recentOrders || []);
      });
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl">Admin overview</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          ["Users", stats?.users],
          ["Orders", stats?.orders],
          ["Payments", stats?.payments],
          ["Revenue", stats ? formatMoney(stats.revenue, "NGN") : "—"],
        ].map(([label, value]) => (
          <Card key={String(label)}>
            <p className="text-xs uppercase tracking-wider text-white/40">{label}</p>
            <p className="mt-2 font-display text-3xl">{value ?? "…"}</p>
          </Card>
        ))}
      </div>
      <h2 className="mt-10 text-xl font-semibold">Latest orders</h2>
      <div className="mt-4 overflow-x-auto rounded-3xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-white/50">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">Charge</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id} className="border-t border-white/8">
                <td className="px-4 py-3">{o.user.username}</td>
                <td className="px-4 py-3">{o.service.name}</td>
                <td className="px-4 py-3">{formatMoney(o.charge, "NGN")}</td>
                <td className="px-4 py-3">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
