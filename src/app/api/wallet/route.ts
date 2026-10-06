import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { paymentSchema } from "@/lib/validations";
import { MIN_TOPUP_USDT, PANEL_CURRENCY } from "@/lib/currency";
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
    currency: PANEL_CURRENCY,
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

  const amount = Number(parsed.data.amount.toFixed(6));
  if (amount < MIN_TOPUP_USDT) {
    return NextResponse.json({ error: `Minimum top-up is ${MIN_TOPUP_USDT} USDT` }, { status: 400 });
  }

  const instant = method.instant;
  const payment = await prisma.$transaction(async (tx) => {
    const record = await tx.payment.create({
      data: {
        userId: user.id,
        amount,
        currency: PANEL_CURRENCY,
        method: method.id,
        status: instant ? "COMPLETED" : "PENDING",
        reference: generateReference(method.id.toUpperCase()),
      },
    });
    if (instant) {
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { increment: amount }, currency: PANEL_CURRENCY },
      });
    }
    return record;
  });

  const fresh = await prisma.user.findUnique({ where: { id: user.id } });

  return NextResponse.json({
    payment,
    balance: fresh?.balance ?? user.balance,
    message: instant
      ? "Wallet credited in USDT."
      : "USDT payment submitted. It will be credited after confirmation.",
  });
}
