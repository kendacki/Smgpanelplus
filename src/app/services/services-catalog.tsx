"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { EmptyState } from "@/components/ui";
import { useApp } from "@/components/providers";
import { formatMoney } from "@/lib/currency";

type Service = {
  id: string;
  name: string;
  description: string;
  rate: number;
  min: number;
  max: number;
  refill: boolean;
  averageTime: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  services: Service[];
};

export function ServicesCatalog() {
  const params = useSearchParams();
  const { currency } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const selected = params.get("cat") || "all";

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    if (selected === "all") return categories;
    return categories.filter((c) => c.slug === selected);
  }, [categories, selected]);

  return (
    <>
      <p className="mt-2 max-w-2xl text-white/60">
        Prices shown in {currency}. Rates are per 1,000. Sign in to place an order.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/services"
          className={`rounded-full px-4 py-2 text-sm ${selected === "all" ? "smg-gradient text-black" : "bg-white/5"}`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/services?cat=${c.slug}`}
            className={`rounded-full px-4 py-2 text-sm ${selected === c.slug ? "smg-gradient text-black" : "bg-white/5"}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {loading ? (
        <div className="mt-12 h-40 animate-pulse rounded-3xl bg-white/5" />
      ) : visible.length === 0 ? (
        <div className="mt-12">
          <EmptyState title="No services" body="Nothing in this category yet." />
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {visible.map((cat) => (
            <section key={cat.id}>
              <h2 className="font-display text-2xl">{cat.name}</h2>
              <div className="mt-4 overflow-x-auto rounded-3xl border border-white/10">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-white/5 text-white/60">
                    <tr>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Rate / 1K</th>
                      <th className="px-4 py-3">Min / Max</th>
                      <th className="px-4 py-3">Avg time</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.services.map((s) => (
                      <tr key={s.id} className="border-t border-white/8">
                        <td className="px-4 py-4">
                          <p className="font-medium">{s.name}</p>
                          <p className="text-xs text-white/45">{s.description}</p>
                        </td>
                        <td className="px-4 py-4 text-smg">{formatMoney(s.rate, currency)}</td>
                        <td className="px-4 py-4">
                          {s.min} / {s.max.toLocaleString()}
                        </td>
                        <td className="px-4 py-4">{s.averageTime}</td>
                        <td className="px-4 py-4">
                          <Link href="/dashboard" className="text-sm text-smg">
                            Order
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
