"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Input, Select, Spinner } from "@/components/ui";
import { useApp } from "@/components/providers";
import { formatMoney } from "@/lib/currency";

type Service = {
  id: string;
  name: string;
  description: string;
  rate: number;
  min: number;
  max: number;
  averageTime: string;
  refill: boolean;
};

type Category = { id: string; name: string; services: Service[] };

export default function NewOrderPage() {
  const { currency } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories || []);
        if (d.categories?.[0]) {
          setCategoryId(d.categories[0].id);
          setServiceId(d.categories[0].services[0]?.id || "");
        }
      });
  }, []);

  const services = useMemo(
    () => categories.find((c) => c.id === categoryId)?.services ?? [],
    [categories, categoryId],
  );
  const service = services.find((s) => s.id === serviceId);

  useEffect(() => {
    if (service) setQuantity(service.min);
  }, [service?.id]);

  const charge = service ? (service.rate / 1000) * quantity : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, link, quantity }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Order failed");
        return;
      }
      setMessage(`Order ${data.order.id} placed successfully.`);
      setLink("");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h1 className="font-display text-3xl">New order</h1>
        <p className="mt-1 text-sm text-white/50">Select a service, paste the link, set quantity.</p>
        <Card className="mt-6">
          <form onSubmit={submit} className="space-y-4">
            {error ? <Alert>{error}</Alert> : null}
            {message ? <Alert tone="success">{message}</Alert> : null}
            <div>
              <label className="mb-1 block text-xs text-white/50">Category</label>
              <Select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  const next = categories.find((c) => c.id === e.target.value);
                  setServiceId(next?.services[0]?.id || "");
                }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/50">Service</label>
              <Select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {formatMoney(s.rate, currency)}/1K
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/50">Link</label>
              <Input
                required
                placeholder="https://instagram.com/username"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/50">Quantity</label>
              <Input
                type="number"
                value={quantity}
                min={service?.min}
                max={service?.max}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm">
              Charge: <span className="text-smg">{formatMoney(charge, currency)}</span>
            </div>
            <Button type="submit" disabled={loading || !service}>
              {loading ? <Spinner /> : null} Submit order
            </Button>
          </form>
        </Card>
      </div>
      <Card>
        <h2 className="font-semibold">Service description</h2>
        {service ? (
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p>{service.description}</p>
            <p>Average time: {service.averageTime}</p>
            <p>
              Min {service.min.toLocaleString()} / Max {service.max.toLocaleString()}
            </p>
            <p>{service.refill ? "30-day refill included" : "No refill"}</p>
            <p>Rate: {formatMoney(service.rate, currency)} / 1,000</p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-white/50">Choose a service to see details.</p>
        )}
      </Card>
    </div>
  );
}
