"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Input, Select, Spinner, Textarea } from "@/components/ui";
import { formatMoney } from "@/lib/currency";
import { fieldsForService, lineCount, sellCharge, type ServiceField } from "@/lib/service-types";

type Service = {
  id: string;
  name: string;
  description: string;
  type: string;
  rate: number;
  min: number;
  max: number;
  averageTime: string;
  refill: boolean;
  dripfeed: boolean;
};

type Category = { id: string; name: string; services: Service[] };

const emptyExtras = {
  comments: "",
  usernames: "",
  keywords: "",
  hashtag: "",
  username: "",
  groups: "",
  answer_number: "",
  runs: 1,
  interval: 0,
  min: 0,
  max: 0,
  posts: 0,
  old_posts: 0,
  delay: 0,
  expiry: "",
};

export default function NewOrderPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [extras, setExtras] = useState(emptyExtras);
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
  const fields: ServiceField[] = service ? fieldsForService(service.type, service.dripfeed) : ["link", "quantity"];

  useEffect(() => {
    if (!service) return;
    setQuantity(service.min);
    setExtras({
      ...emptyExtras,
      min: service.min,
      max: service.max,
    });
  }, [service?.id]);

  const effectiveQuantity = fields.includes("comments")
    ? lineCount(extras.comments) || quantity
    : fields.includes("usernames")
      ? lineCount(extras.usernames) || quantity
      : fields.includes("subscription")
        ? extras.posts || extras.max || quantity
        : quantity;
  const charge = service
    ? sellCharge(service.rate, service.type, effectiveQuantity || 1, extras.runs || 1)
    : 0;

  function setExtra<K extends keyof typeof extras>(key: K, value: (typeof extras)[K]) {
    setExtras((current) => ({ ...current, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          link,
          quantity: fields.includes("quantity") ? quantity : undefined,
          ...extras,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Order failed");
        return;
      }
      setMessage(`Order ${data.order.id} placed. SMMTurk is fulfilling it.`);
      setLink("");
      setExtras((current) => ({ ...emptyExtras, min: current.min, max: current.max }));
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
        <p className="mt-1 text-sm text-white/50">
          Orders go to SMMTurk through the same v2 API as their PHP sample.
        </p>
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
                    {s.name} — {formatMoney(s.rate)}/1K
                  </option>
                ))}
              </Select>
            </div>
            {fields.includes("link") ? (
              <div>
                <label className="mb-1 block text-xs text-white/50">Link</label>
                <Input
                  required
                  placeholder="https://instagram.com/username"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
            ) : null}
            {fields.includes("username") ? (
              <div>
                <label className="mb-1 block text-xs text-white/50">Username</label>
                <Input
                  required
                  placeholder="account name without @"
                  value={extras.username}
                  onChange={(e) => setExtra("username", e.target.value)}
                />
              </div>
            ) : null}
            {fields.includes("quantity") ? (
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
            ) : null}
            {fields.includes("comments") ? (
              <div>
                <label className="mb-1 block text-xs text-white/50">Comments (one per line)</label>
                <Textarea
                  rows={5}
                  value={extras.comments}
                  onChange={(e) => setExtra("comments", e.target.value)}
                  placeholder={"good pic\ngreat photo"}
                />
              </div>
            ) : null}
            {fields.includes("usernames") ? (
              <div>
                <label className="mb-1 block text-xs text-white/50">Usernames (one per line)</label>
                <Textarea
                  rows={5}
                  value={extras.usernames}
                  onChange={(e) => setExtra("usernames", e.target.value)}
                />
              </div>
            ) : null}
            {fields.includes("keywords") ? (
              <div>
                <label className="mb-1 block text-xs text-white/50">Keywords</label>
                <Input
                  value={extras.keywords}
                  onChange={(e) => setExtra("keywords", e.target.value)}
                  placeholder="test, testing"
                />
              </div>
            ) : null}
            {fields.includes("hashtag") ? (
              <div>
                <label className="mb-1 block text-xs text-white/50">Hashtag</label>
                <Input
                  value={extras.hashtag}
                  onChange={(e) => setExtra("hashtag", e.target.value)}
                  placeholder="test"
                />
              </div>
            ) : null}
            {fields.includes("groups") ? (
              <div>
                <label className="mb-1 block text-xs text-white/50">Groups (one per line)</label>
                <Textarea
                  rows={4}
                  value={extras.groups}
                  onChange={(e) => setExtra("groups", e.target.value)}
                />
              </div>
            ) : null}
            {fields.includes("answer_number") ? (
              <div>
                <label className="mb-1 block text-xs text-white/50">Poll answer number</label>
                <Input
                  value={extras.answer_number}
                  onChange={(e) => setExtra("answer_number", e.target.value)}
                />
              </div>
            ) : null}
            {fields.includes("drip") ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-white/50">Drip-feed runs</label>
                  <Input
                    type="number"
                    min={1}
                    value={extras.runs}
                    onChange={(e) => setExtra("runs", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/50">Interval (minutes)</label>
                  <Input
                    type="number"
                    min={0}
                    value={extras.interval}
                    onChange={(e) => setExtra("interval", Number(e.target.value))}
                  />
                </div>
              </div>
            ) : null}
            {fields.includes("subscription") ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-white/50">Min per post</label>
                  <Input
                    type="number"
                    value={extras.min}
                    onChange={(e) => setExtra("min", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/50">Max per post</label>
                  <Input
                    type="number"
                    value={extras.max}
                    onChange={(e) => setExtra("max", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/50">Old posts</label>
                  <Input
                    type="number"
                    value={extras.old_posts}
                    onChange={(e) => setExtra("old_posts", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/50">Delay (minutes)</label>
                  <Input
                    type="number"
                    value={extras.delay}
                    onChange={(e) => setExtra("delay", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/50">Expiry</label>
                  <Input
                    placeholder="11/11/2026"
                    value={extras.expiry}
                    onChange={(e) => setExtra("expiry", e.target.value)}
                  />
                </div>
              </div>
            ) : null}
            <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm">
              Charge: <span className="text-smg">{formatMoney(charge)}</span>
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
            <p>Type: {service.type}</p>
            <p>Average time: {service.averageTime}</p>
            <p>
              Min {service.min.toLocaleString()} / Max {service.max.toLocaleString()}
            </p>
            <p>{service.refill ? "30-day refill included" : "No refill"}</p>
            <p>{service.dripfeed ? "Drip-feed available" : "No drip-feed"}</p>
            <p>Rate: {formatMoney(service.rate)} / 1,000</p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-white/50">Choose a service to see details.</p>
        )}
      </Card>
    </div>
  );
}
