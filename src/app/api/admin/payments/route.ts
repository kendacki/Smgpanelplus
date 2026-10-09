import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { completePaymentByReference } from "@/lib/credit-payment";

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

  if (status === "COMPLETED") {
    const result = await completePaymentByReference(existing.reference);
    if (!result.ok) {
      return NextResponse.json({ error: "Could not approve this payment" }, { status: 400 });
    }
    return NextResponse.json({ payment: result.payment });
  }

  if (existing.status === "COMPLETED") {
    return NextResponse.json({ error: "Completed payments cannot change" }, { status: 400 });
  }

  const payment = await prisma.payment.update({ where: { id }, data: { status } });
  return NextResponse.json({ payment });
}
