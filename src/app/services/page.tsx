import { Suspense } from "react";
import { SiteShell } from "@/components/site-shell";
import { ServicesCatalog } from "./services-catalog";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <p className="text-smg">Catalog</p>
        <h1 className="mt-2 font-display text-4xl">SMM services</h1>
        <Suspense fallback={<div className="mt-10 h-40 animate-pulse rounded-3xl bg-white/5" />}>
          <ServicesCatalog />
        </Suspense>
      </div>
    </SiteShell>
  );
}
