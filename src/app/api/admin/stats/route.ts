import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [users, orders, payments, services, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.payment.count({ where: { status: "COMPLETED" } }),
    prisma.service.count({ where: { status: "active" } }),
    prisma.order.aggregate({ _sum: { charge: true } }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { username: true } }, service: true },
  });

  return NextResponse.json({
    stats: {
      users,
      orders,
      payments,
      services,
      revenue: revenue._sum.charge ?? 0,
    },
    recentOrders,
  });
}
