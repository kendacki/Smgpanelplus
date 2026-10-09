import { prisma } from "./prisma";
import { isProviderConfigured, providerServices, sellRateFromUsdt } from "./provider";

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return slug || "other";
}

function categoryIcon(name: string) {
  const value = name.toLowerCase();
  if (value.includes("instagram")) return "instagram";
  if (value.includes("tiktok")) return "tiktok";
  if (value.includes("twitter") || /\bx\b/.test(value)) return "twitter";
  if (value.includes("facebook")) return "facebook";
  if (value.includes("youtube")) return "youtube";
  if (value.includes("telegram")) return "telegram";
  if (value.includes("spotify")) return "spotify";
  return "globe";
}

function asInt(value: string | number, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : fallback;
}

function asRate(value: string | number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

let inflight: Promise<{ imported: number; categories: number }> | null = null;

export function syncProviderCatalog() {
  if (inflight) return inflight;
  inflight = runSync().finally(() => {
    inflight = null;
  });
  return inflight;
}

export async function ensureProviderCatalog() {
  if (!isProviderConfigured()) return { imported: 0, categories: 0, skipped: true as const };
  const live = await prisma.service.count({ where: { providerServiceId: { not: null } } });
  if (live > 0) return { imported: live, categories: 0, skipped: true as const };
  return syncProviderCatalog();
}

async function runSync() {
  if (!isProviderConfigured()) {
    throw new Error("Set AMAZINGSMM_API_KEY to import services");
  }

  const remote = await providerServices();
  console.log(`Provider returned ${remote.length} services`);
  const categoryRecords = await prisma.category.findMany();
  const categories = new Map(categoryRecords.map((row) => [row.slug, row]));
  let sortOrder = categoryRecords.reduce((max, item) => Math.max(max, item.sortOrder), 0);

  async function categoryIdFor(name: string) {
    const label = name.trim() || "Other";
    let slug = slugify(label);
    const existing = categories.get(slug);
    if (existing) return existing.id;

    let suffix = 1;
    let unique = slug;
    while (categories.has(unique)) {
      unique = `${slug}-${suffix}`;
      suffix += 1;
    }
    sortOrder += 1;
    const created = await prisma.category.create({
      data: { name: label, slug: unique, icon: categoryIcon(label), sortOrder },
    });
    categories.set(unique, created);
    return created.id;
  }

  const existing = await prisma.service.findMany({
    where: { providerServiceId: { not: null } },
    select: { id: true, providerServiceId: true },
  });
  const byProviderId = new Map(existing.map((row) => [row.providerServiceId as number, row.id]));
  const seen = new Set<number>();
  const creates: Array<{
    name: string;
    description: string;
    type: string;
    rate: number;
    min: number;
    max: number;
    refill: boolean;
    cancel: boolean;
    providerRate: number;
    providerServiceId: number;
    categoryId: string;
    status: string;
    averageTime: string;
  }> = [];
  const updates: Array<{ id: string; data: (typeof creates)[number] }> = [];

  for (const item of remote) {
    const providerId = asInt(item.service, 0);
    if (!providerId || seen.has(providerId)) continue;
    seen.add(providerId);

    const categoryId = await categoryIdFor(item.category || "Other");
    const providerRate = asRate(item.rate);
    const min = Math.max(1, asInt(item.min, 1));
    const data = {
      name: item.name,
      description: item.name,
      type: item.type || "Default",
      rate: sellRateFromUsdt(providerRate),
      min,
      max: Math.max(asInt(item.max, min), min),
      refill: Boolean(item.refill),
      cancel: Boolean(item.cancel),
      providerRate,
      providerServiceId: providerId,
      categoryId,
      status: "active",
      averageTime: "0-24 hours",
    };

    const currentId = byProviderId.get(providerId);
    if (currentId) updates.push({ id: currentId, data });
    else creates.push(data);
  }

  for (let i = 0; i < creates.length; i += 80) {
    await prisma.service.createMany({ data: creates.slice(i, i + 80) });
  }
  for (let i = 0; i < updates.length; i += 20) {
    const chunk = updates.slice(i, i + 20);
    await Promise.all(
      chunk.map((row) => prisma.service.update({ where: { id: row.id }, data: row.data })),
    );
  }
  const imported = creates.length + updates.length;

  if (seen.size > 0) {
    const stored = await prisma.service.findMany({
      where: { providerServiceId: { not: null } },
      select: { id: true, providerServiceId: true },
    });
    const staleIds = stored
      .filter((row) => !seen.has(row.providerServiceId as number))
      .map((row) => row.id);
    for (let i = 0; i < staleIds.length; i += 200) {
      await prisma.service.updateMany({
        where: { id: { in: staleIds.slice(i, i + 200) } },
        data: { status: "inactive" },
      });
    }
    await prisma.service.updateMany({
      where: { providerServiceId: null },
      data: { status: "inactive" },
    });
  }

  return { imported, categories: categories.size };
}
