"use client";

import { useEffect, useState } from "react";
import { Badge, Button, EmptyState } from "@/components/ui";
import { orderStatusLabel } from "@/lib/utils";
import { formatMoney } from "@/lib/currency";

type Order = {
  id: string;
  link: string;
  quantity: number;
  charge: number;
  status: string;
  createdAt: string;
  service: { name: string; refill: boolean; cancel: boolean };
};

function tone(status: string) {
  if (status === "COMPLETED") return "green" as const;
  if (status === "CANCELED" || status === "REFUND") return "red" as const;
  if (status === "PENDING") return "yellow" as const;
  return "orange" as const;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders || []);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  async function act(id: string, action: "refill" | "cancel") {
    await fetch(`/api/orders/${id}/${action}`, { method: "POST" });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Orders</h1>
      <p className="mt-1 text-sm text-white/50">Track every boost from pending to completed.</p>
      <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10">
        {loading ? (
          <div className="h-40 animate-pulse bg-white/5" />
        ) : orders.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No orders yet" body="Place your first order from New Order." />
          </div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-white/50">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Link</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Charge</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-white/8">
                  <td className="px-4 py-3 font-mono text-xs">{order.id.slice(-8)}</td>
                  <td className="px-4 py-3">{order.service.name}</td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-white/60">{order.link}</td>
                  <td className="px-4 py-3">{order.quantity.toLocaleString()}</td>
                  <td className="px-4 py-3">{formatMoney(order.charge)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={tone(order.status)}>{orderStatusLabel(order.status)}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {order.service.refill ? (
                        <Button
                          variant="ghost"
                          className="rounded-lg px-2 py-1 text-xs"
                          onClick={() => act(order.id, "refill")}
                        >
                          Refill
                        </Button>
                      ) : null}
                      {order.service.cancel && !["COMPLETED", "CANCELED", "REFUND"].includes(order.status) ? (
                        <Button
                          variant="ghost"
                          className="rounded-lg px-2 py-1 text-xs"
                          onClick={() => act(order.id, "cancel")}
                        >
                          Cancel
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
