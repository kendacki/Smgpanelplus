import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { placePanelOrder, refreshOrdersFromProvider, refillPanelOrder, cancelPanelOrder } from "@/lib/fulfill";
import {
  isProviderConfigured,
  providerRefillStatus,
  providerRefillStatuses,
  providerErrorMessage,
} from "@/lib/provider";

function asRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

async function handle(request: Request) {
  const url = new URL(request.url);
  let payload: Record<string, string> = Object.fromEntries(url.searchParams.entries());

  if (request.method === "POST") {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = asRecord(await request.json());
      payload = {
        ...payload,
        ...Object.fromEntries(Object.entries(json).map(([key, value]) => [key, String(value ?? "")])),
      };
    } else {
      const form = await request.formData();
      form.forEach((value, key) => {
        payload[key] = String(value);
      });
    }
  }

  const key = payload.key;
  const action = payload.action;
  if (!key) {
    return NextResponse.json({ error: "API key is required" });
  }

  const user = await prisma.user.findUnique({ where: { apiKey: key } });
  if (!user || user.status !== "active") {
    return NextResponse.json({ error: "Invalid API key" });
  }

  if (action === "balance") {
    return NextResponse.json({ balance: user.balance.toFixed(5), currency: "USDT" });
  }

  if (action === "services") {
    const services = await prisma.service.findMany({
      where: { status: "active" },
      include: { category: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(
      services.map((s) => ({
        service: s.id,
        name: s.name,
        type: s.type,
        category: s.category.name,
        rate: s.rate.toFixed(4),
        min: String(s.min),
        max: String(s.max),
        refill: s.refill,
        cancel: s.cancel,
        dripfeed: s.dripfeed,
      })),
    );
  }

  if (action === "add") {
    const service = await prisma.service.findUnique({ where: { id: payload.service } });
    if (!service || service.status !== "active") {
      return NextResponse.json({ error: "Incorrect request" });
    }
    const quantity = payload.quantity ? Number(payload.quantity) : undefined;
    const asNumber = (value?: string) => {
      if (!value) return undefined;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    };
    try {
      const order = await placePanelOrder({
        userId: user.id,
        balance: user.balance,
        service,
        link: payload.link || "",
        quantity: Number.isFinite(quantity) ? quantity : undefined,
        extras: {
          comments: payload.comments,
          usernames: payload.usernames,
          keywords: payload.keywords,
          hashtag: payload.hashtag,
          username: payload.username,
          groups: payload.groups,
          answer_number: payload.answer_number,
          runs: asNumber(payload.runs),
          interval: asNumber(payload.interval),
          min: asNumber(payload.min),
          max: asNumber(payload.max),
          posts: asNumber(payload.posts),
          old_posts: asNumber(payload.old_posts),
          delay: asNumber(payload.delay),
          expiry: payload.expiry,
        },
      });
      return NextResponse.json({ order: order.id });
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Incorrect request" });
    }
  }

  if (action === "status") {
    const ids = (payload.orders || payload.order || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    try {
      await refreshOrdersFromProvider(ids);
    } catch {
      // local fallback
    }
    const orders = await prisma.order.findMany({
      where: { id: { in: ids }, userId: user.id },
    });
    const byId = new Map(orders.map((order) => [order.id, order]));
    if (ids.length === 1) {
      const order = byId.get(ids[0]);
      if (!order) return NextResponse.json({ error: "Incorrect order ID" });
      return NextResponse.json({
        charge: order.charge.toFixed(5),
        start_count: String(order.startCount),
        status: order.status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
        remains: String(order.remains),
        currency: "USDT",
      });
    }
    const result: Record<string, object> = {};
    for (const id of ids) {
      const order = byId.get(id);
      result[id] = order
        ? {
            charge: order.charge.toFixed(5),
            start_count: String(order.startCount),
            status: order.status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
            remains: String(order.remains),
            currency: "USDT",
          }
        : { error: "Incorrect order ID" };
    }
    return NextResponse.json(result);
  }

  if (action === "refill") {
    const ids = (payload.orders || payload.order || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    if (ids.length === 1) {
      try {
        const order = await refillPanelOrder(ids[0], user.id);
        return NextResponse.json({ refill: order.providerRefillId });
      } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Incorrect order ID" });
      }
    }
    const rows = [];
    for (const id of ids.slice(0, 100)) {
      try {
        const order = await refillPanelOrder(id, user.id);
        rows.push({ order: id, refill: order.providerRefillId });
      } catch (error) {
        rows.push({
          order: id,
          refill: { error: error instanceof Error ? error.message : "Incorrect order ID" },
        });
      }
    }
    return NextResponse.json(rows);
  }

  if (action === "refill_status") {
    if (!isProviderConfigured()) {
      return NextResponse.json({ error: "Provider is not configured" });
    }
    if (payload.refill) {
      const data = await providerRefillStatus(payload.refill);
      if ("error" in data) return NextResponse.json({ error: data.error });
      return NextResponse.json(data);
    }
    const ids = (payload.refills || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .slice(0, 100);
    const data = await providerRefillStatuses(ids);
    if ("error" in data) return NextResponse.json({ error: providerErrorMessage(data) });
    return NextResponse.json(data);
  }

  if (action === "cancel") {
    const ids = (payload.orders || payload.order || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .slice(0, 100);
    const rows = [];
    for (const id of ids) {
      try {
        await cancelPanelOrder(id, user.id);
        const order = await prisma.order.findFirst({ where: { id, userId: user.id } });
        rows.push({ order: id, cancel: order?.providerOrderId ?? 1 });
      } catch (error) {
        rows.push({
          order: id,
          cancel: { error: error instanceof Error ? error.message : "Incorrect order ID" },
        });
      }
    }
    return NextResponse.json(rows);
  }

  return NextResponse.json({ error: "Incorrect request" });
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
