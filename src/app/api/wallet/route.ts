import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { paymentSchema } from "@/lib/validations";
import { convertToNgn, getCurrency } from "@/lib/currency";
import { generateReference } from "@/lib/utils";
import { PAYMENT_METHODS } from "@/lib/constants";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payments = await prisma.payment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({
    balance: user.balance,
    currency: user.currency,
    payments,
  });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = paymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payment" },
      { status: 400 },
    );
  }

  const method = PAYMENT_METHODS.find((m) => m.id === parsed.data.method);
  if (!method) {
    return NextResponse.json({ error: "Unknown payment method" }, { status: 400 });
  }
  if (!method.currencies.includes(parsed.data.currency)) {
    return NextResponse.json(
      { error: `${method.name} does not support ${parsed.data.currency}` },
      { status: 400 },
    );
  }

  const amountNgn = convertToNgn(parsed.data.amount, getCurrency(parsed.data.currency));
  if (amountNgn < 500) {
    return NextResponse.json({ error: "Minimum top-up is ₦500 equivalent" }, { status: 400 });
  }

  const instant = method.instant;
  const payment = await prisma.$transaction(async (tx) => {
    const record = await tx.payment.create({
      data: {
        userId: user.id,
        amount: amountNgn,
        currency: parsed.data.currency,
        method: method.id,
        status: instant ? "COMPLETED" : "PENDING",
        reference: generateReference(method.id.toUpperCase()),
      },
    });
    if (instant) {
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { increment: amountNgn } },
      });
    }
    return record;
  });

  const fresh = await prisma.user.findUnique({ where: { id: user.id } });

  return NextResponse.json({
    payment,
    balance: fresh?.balance ?? user.balance,
    message: instant
      ? "Wallet credited instantly."
      : "Payment submitted. It will be confirmed after verification.",
  });
}
