import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { orderSchema } from "@/lib/validations";
import { placePanelOrder, refreshOrdersFromProvider } from "@/lib/fulfill";
import type { OrderExtras } from "@/lib/service-types";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await refreshOrdersFromProvider(undefined, user.id);
  } catch {
    // Keep local status if the provider is unreachable.
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { service: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order" },
      { status: 400 },
    );
  }

  const service = await prisma.service.findUnique({
    where: { id: parsed.data.serviceId },
  });
  if (!service || service.status !== "active") {
    return NextResponse.json({ error: "Service is unavailable" }, { status: 404 });
  }

  const extras: OrderExtras = {
    comments: parsed.data.comments,
    usernames: parsed.data.usernames,
    keywords: parsed.data.keywords,
    hashtag: parsed.data.hashtag,
    username: parsed.data.username,
    groups: parsed.data.groups,
    answer_number: parsed.data.answer_number,
    runs: parsed.data.runs,
    interval: parsed.data.interval,
    min: parsed.data.min,
    max: parsed.data.max,
    posts: parsed.data.posts,
    old_posts: parsed.data.old_posts,
    delay: parsed.data.delay,
    expiry: parsed.data.expiry,
  };

  try {
    const order = await placePanelOrder({
      userId: user.id,
      balance: user.balance,
      service,
      link: parsed.data.link || "",
      quantity: parsed.data.quantity,
      extras,
    });
    return NextResponse.json({ order });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    const message = error instanceof Error ? error.message : "Order failed";
    return NextResponse.json({ error: message }, { status });
  }
}
