"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/providers";
import { formatMoney } from "@/lib/currency";

type Category = {
  name: string;
  services: {
    id: string;
    name: string;
    rate: number;
    min: number;
    max: number;
    averageTime: string;
  }[];
};

export default function DashboardServicesPage() {
  const { currency } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl">Services</h1>
      <p className="mt-1 text-sm text-white/50">Copy a service ID for mass orders or the API.</p>
      <div className="mt-6 space-y-8">
        {categories.map((cat) => (
          <section key={cat.name}>
            <h2 className="text-xl font-semibold">{cat.name}</h2>
            <div className="mt-3 overflow-x-auto rounded-3xl border border-white/10">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/5 text-white/50">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Rate</th>
                    <th className="px-4 py-3">Min/Max</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.services.map((s) => (
                    <tr key={s.id} className="border-t border-white/8">
                      <td className="px-4 py-3 font-mono text-xs">{s.id}</td>
                      <td className="px-4 py-3">{s.name}</td>
                      <td className="px-4 py-3">{formatMoney(s.rate, currency)}/1K</td>
                      <td className="px-4 py-3">
                        {s.min} - {s.max.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
