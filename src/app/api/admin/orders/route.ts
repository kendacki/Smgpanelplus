import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ORDER_STATUSES } from "@/lib/constants";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    include: { user: { select: { username: true, email: true } }, service: true },
    orderBy: { createdAt: "desc" },
    take: 300,
  });
  return NextResponse.json({ orders });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { id, status } = body as { id?: string; status?: string };
  if (!id || !status || !ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
  }

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const refund = status === "REFUND" || status === "CANCELED";
  const shouldRefund =
    refund && !["REFUND", "CANCELED"].includes(existing.status);

  const order = await prisma.$transaction(async (tx) => {
    if (shouldRefund) {
      await tx.user.update({
        where: { id: existing.userId },
        data: { balance: { increment: existing.charge } },
      });
    }
    return tx.order.update({
      where: { id },
      data: {
        status,
        remains: status === "COMPLETED" ? 0 : existing.remains,
        startCount: status === "IN_PROGRESS" && existing.startCount === 0 ? 100 : existing.startCount,
      },
    });
  });

  return NextResponse.json({ order });
}
