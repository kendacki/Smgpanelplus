import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function handle(request: Request) {
  const url = new URL(request.url);
  let payload: Record<string, string> = Object.fromEntries(url.searchParams.entries());

  if (request.method === "POST") {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      payload = { ...payload, ...(await request.json()) };
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
    return NextResponse.json({ error: "API key is required" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { apiKey: key } });
  if (!user || user.status !== "active") {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  if (action === "balance") {
    return NextResponse.json({ balance: user.balance.toFixed(2), currency: "NGN" });
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
        rate: s.rate.toFixed(2),
        min: s.min,
        max: s.max,
        refill: s.refill,
        dripfeed: s.dripfeed,
      })),
    );
  }

  if (action === "add") {
    const service = await prisma.service.findUnique({ where: { id: payload.service } });
    const quantity = Number(payload.quantity);
    const link = payload.link;
    if (!service || !link || !Number.isFinite(quantity)) {
      return NextResponse.json({ error: "Incorrect request" }, { status: 400 });
    }
    if (quantity < service.min || quantity > service.max) {
      return NextResponse.json({ error: "Incorrect quantity" }, { status: 400 });
    }
    const charge = (service.rate / 1000) * quantity;
    if (user.balance < charge) {
      return NextResponse.json({ error: "Not enough funds" }, { status: 400 });
    }
    const order = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: charge } },
      });
      return tx.order.create({
        data: {
          userId: user.id,
          serviceId: service.id,
          link,
          quantity,
          charge,
          remains: quantity,
          status: "PENDING",
        },
      });
    });
    return NextResponse.json({ order: order.id, charge: charge.toFixed(4) });
  }

  if (action === "status") {
    const ids = (payload.orders || payload.order || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    const orders = await prisma.order.findMany({
      where: { id: { in: ids }, userId: user.id },
    });
    const result: Record<string, object> = {};
    for (const order of orders) {
      result[order.id] = {
        charge: order.charge.toFixed(4),
        start_count: String(order.startCount),
        status: order.status.toLowerCase(),
        remains: String(order.remains),
        currency: "NGN",
      };
    }
    return NextResponse.json(ids.length === 1 ? result[ids[0]] ?? { error: "Incorrect order ID" } : result);
  }

  return NextResponse.json({ error: "Incorrect request" }, { status: 400 });
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
