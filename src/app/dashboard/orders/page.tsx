"use client";

import { useEffect, useState } from "react";
import { Badge, EmptyState } from "@/components/ui";
import { useApp } from "@/components/providers";
import { orderStatusLabel } from "@/lib/utils";
import { formatMoney } from "@/lib/currency";

type Order = {
  id: string;
  link: string;
  quantity: number;
  charge: number;
  status: string;
  createdAt: string;
  service: { name: string };
};

function tone(status: string) {
  if (status === "COMPLETED") return "green" as const;
  if (status === "CANCELED" || status === "REFUND") return "red" as const;
  if (status === "PENDING") return "yellow" as const;
  return "orange" as const;
}

export default function OrdersPage() {
  const { currency } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, []);

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
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-white/8">
                  <td className="px-4 py-3 font-mono text-xs">{order.id.slice(-8)}</td>
                  <td className="px-4 py-3">{order.service.name}</td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-white/60">{order.link}</td>
                  <td className="px-4 py-3">{order.quantity.toLocaleString()}</td>
                  <td className="px-4 py-3">{formatMoney(order.charge, currency)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={tone(order.status)}>{orderStatusLabel(order.status)}</Badge>
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
