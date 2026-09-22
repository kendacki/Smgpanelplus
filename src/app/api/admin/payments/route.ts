import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const payments = await prisma.payment.findMany({
    include: { user: { select: { username: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 300,
  });
  return NextResponse.json({ payments });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, status } = (await request.json()) as { id?: string; status?: string };
  if (!id || !status) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const existing = await prisma.payment.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  const payment = await prisma.$transaction(async (tx) => {
    if (status === "COMPLETED" && existing.status !== "COMPLETED") {
      await tx.user.update({
        where: { id: existing.userId },
        data: { balance: { increment: existing.amount } },
      });
    }
    return tx.payment.update({ where: { id }, data: { status } });
  });

  return NextResponse.json({ payment });
}
