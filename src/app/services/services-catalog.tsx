"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { EmptyState, Input, Select } from "@/components/ui";
import { useApp } from "@/components/providers";
import { formatMoney } from "@/lib/currency";
import { isPlatformId, PUBLIC_PLATFORMS, type PlatformId } from "@/lib/platforms";

type Service = {
  id: string;
  name: string;
  rate: number;
  min: number;
  max: number;
  averageTime: string;
  refill: boolean;
  category: string;
};

const PAGE_SIZE = 40;

export function ServicesCatalog() {
  const params = useSearchParams();
  const router = useRouter();
  const { session } = useApp();
  const requested = params.get("cat");
  const platform: PlatformId | null = isPlatformId(requested) ? requested : null;
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!platform) {
      setServices([]);
      return;
    }
    setLoading(true);
    setQuery("");
    setGroup("all");
    setPage(1);
    fetch(`/api/services?platform=${platform}`)
      .then((response) => response.json())
      .then((data) => setServices(data.services || []))
      .finally(() => setLoading(false));
  }, [platform]);

  const groups = useMemo(() => {
    return [...new Set(services.map((service) => service.category))].sort((a, b) => a.localeCompare(b));
  }, [services]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return services.filter((service) => {
      if (group !== "all" && service.category !== group) return false;
      if (!needle) return true;
      return service.name.toLowerCase().includes(needle) || service.category.toLowerCase().includes(needle);
    });
  }, [services, query, group]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = PUBLIC_PLATFORMS.find((item) => item.id === platform);

  function openPlatform(id: PlatformId) {
    router.push(`/services?cat=${id}`, { scroll: false });
  }

  return (
    <>
      <p className="mt-2 max-w-2xl text-white/60">
        Choose a platform. Prices are in USDT per 1,000. Sign in to place an order.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
        {PUBLIC_PLATFORMS.map((item) => {
          const active = item.id === platform;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => openPlatform(item.id)}
              className={`rounded-2xl border px-3 py-4 text-sm font-medium transition ${
                active
                  ? "border-smg bg-smg text-black"
                  : "border-white/10 bg-white/5 text-white hover:border-smg/60"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {!platform ? (
        <div className="mt-12">
          <EmptyState title="Pick a platform" body="Instagram, TikTok, YouTube and the rest are listed above. Their services and prices open here." />
        </div>
      ) : (
        <section id="service-list" className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl">{selected?.label}</h2>
              <p className="mt-1 text-sm text-white/50">
                {loading ? "Loading prices…" : `${filtered.length.toLocaleString()} services`}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                value={query}
                placeholder="Search this platform"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
              <Select
                value={group}
                onChange={(event) => {
                  setGroup(event.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All service types</option>
                {groups.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 h-40 animate-pulse rounded-3xl bg-white/5" />
          ) : shown.length === 0 ? (
            <div className="mt-6">
              <EmptyState title="No services" body="Nothing matched this platform." />
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/5 text-white/60">
                  <tr>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Amount / 1K</th>
                    <th className="px-4 py-3">Min / Max</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((service) => (
                    <tr key={service.id} className="border-t border-white/8">
                      <td className="px-4 py-4">
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs text-white/45">{service.category}</p>
                      </td>
                      <td className="px-4 py-4 text-smg">{formatMoney(service.rate)}</td>
                      <td className="px-4 py-4">
                        {service.min.toLocaleString()} / {service.max.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <Link href={session ? "/dashboard" : "/register"} className="text-sm text-smg">
                          Order
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pages > 1 ? (
            <div className="mt-4 flex items-center justify-between text-sm text-white/60">
              <button
                type="button"
                className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-40"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} of {pages}
              </span>
              <button
                type="button"
                className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-40"
                disabled={page >= pages}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
            </div>
          ) : null}
        </section>
      )}
    </>
  );
}
