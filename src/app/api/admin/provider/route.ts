import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { isProviderConfigured, providerBalance, PROVIDER_API_URL, getProviderMarkup } from "@/lib/provider";
import { syncProviderCatalog } from "@/lib/sync-services";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [services, providerServices] = await Promise.all([
    prisma.service.count({ where: { status: "active" } }),
    prisma.service.count({ where: { providerServiceId: { not: null }, status: "active" } }),
  ]);

  let balance: { balance?: string; currency?: string; error?: string } | null = null;
  if (isProviderConfigured()) {
    try {
      const data = await providerBalance();
      balance = "error" in data ? { error: data.error } : data;
    } catch (error) {
      balance = { error: error instanceof Error ? error.message : "Could not load provider balance" };
    }
  }

  return NextResponse.json({
    configured: isProviderConfigured(),
    url: PROVIDER_API_URL,
    markup: getProviderMarkup(),
    services,
    providerServices,
    balance,
  });
}

export async function POST() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await syncProviderCatalog();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 502 },
    );
  }
}
