import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { orderSchema } from "@/lib/validations";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  if (parsed.data.quantity < service.min || parsed.data.quantity > service.max) {
    return NextResponse.json(
      { error: `Quantity must be between ${service.min} and ${service.max}` },
      { status: 400 },
    );
  }

  const charge = (service.rate / 1000) * parsed.data.quantity;
  if (user.balance < charge) {
    return NextResponse.json(
      { error: "Insufficient balance. Add funds to continue." },
      { status: 402 },
    );
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
        link: parsed.data.link.trim(),
        quantity: parsed.data.quantity,
        charge,
        remains: parsed.data.quantity,
        status: "PENDING",
      },
      include: { service: true },
    });
  });

  return NextResponse.json({ order });
}
