"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { ORDER_STATUSES } from "@/lib/constants";

type Order = {
  id: string;
  status: string;
  quantity: number;
  charge: number;
  link: string;
  user: { username: string };
  service: { name: string };
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function load() {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data.orders || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function update(id: string, status: string) {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Orders</h1>
      <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-white/50">
            <tr>
              <th className="px-3 py-3">User</th>
              <th className="px-3 py-3">Service</th>
              <th className="px-3 py-3">Link</th>
              <th className="px-3 py-3">Qty</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-white/8">
                <td className="px-3 py-3">{o.user.username}</td>
                <td className="px-3 py-3">{o.service.name}</td>
                <td className="max-w-[180px] truncate px-3 py-3">{o.link}</td>
                <td className="px-3 py-3">{o.quantity}</td>
                <td className="px-3 py-3">{o.status}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {ORDER_STATUSES.map((s) => (
                      <Button
                        key={s}
                        variant="ghost"
                        className="rounded-lg px-2 py-1 text-xs"
                        onClick={() => update(o.id, s)}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
