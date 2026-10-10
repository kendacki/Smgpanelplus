import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { paymentSchema } from "@/lib/validations";
import {
  localToUsdt,
  MIN_TOPUP_USDT,
  PANEL_CURRENCY,
  publicFxRates,
  type PayCurrency,
} from "@/lib/currency";
import { generateReference } from "@/lib/utils";
import { findPaymentMethod, publicPaymentMethods } from "@/lib/payments";
import { startFlutterwaveCheckout, startPaystackCheckout } from "@/lib/gateways";
import { buildUsdtCheckout, parseUsdtCheckout } from "@/lib/usdt-evm";

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
    rates: publicFxRates(),
    methods: publicPaymentMethods(),
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

  const method = findPaymentMethod(parsed.data.method);
  if (!method) {
    return NextResponse.json({ error: "Unknown payment method" }, { status: 400 });
  }

  const currency = parsed.data.currency as PayCurrency;
  if (!method.currencies.includes(currency)) {
    return NextResponse.json({ error: `This method does not accept ${currency}` }, { status: 400 });
  }

  const paidAmount = Number(parsed.data.amount.toFixed(currency === "USDT" ? 6 : 2));
  const credit = localToUsdt(paidAmount, currency);
  if (credit < MIN_TOPUP_USDT) {
    return NextResponse.json(
      { error: `Minimum top-up is ${MIN_TOPUP_USDT} USDT` },
      { status: 400 },
    );
  }

  const note = parsed.data.note?.trim() || null;
  const reference = generateReference(method.id.replaceAll("_", "").toUpperCase().slice(0, 8));
  const instant = method.instant;
  const metadata: Record<string, string> = {};
  let exactPaid = paidAmount;

  if (method.id === "crypto") {
    const pending = await prisma.payment.findMany({
      where: { method: "crypto", status: "PENDING" },
      select: { metadata: true },
    });
    const taken = new Set(
      pending
        .map((row) => parseUsdtCheckout(row.metadata)?.payUnits)
        .filter((value): value is string => Boolean(value)),
    );
    const checkout = buildUsdtCheckout(credit, taken);
    exactPaid = Number(checkout.payAmount);
    Object.assign(metadata, checkout);
  }

  if (method.kind === "gateway" && !method.live) {
    return NextResponse.json(
      { error: `${method.name} is not connected yet. Use a local transfer or USDT.` },
      { status: 400 },
    );
  }

  if (method.id === "paystack") {
    const checkout = await startPaystackCheckout({
      email: user.email,
      amountNgn: paidAmount,
      reference,
    });
    if ("error" in checkout) {
      return NextResponse.json({ error: checkout.error }, { status: 502 });
    }
    metadata.checkoutUrl = checkout.url;
    metadata.gateway = "paystack";
  }

  if (method.id === "flutterwave") {
    const checkout = await startFlutterwaveCheckout({
      email: user.email,
      name: user.username,
      amount: paidAmount,
      currency: currency as "NGN" | "GHS" | "KES",
      reference,
    });
    if ("error" in checkout) {
      return NextResponse.json({ error: checkout.error }, { status: 502 });
    }
    metadata.checkoutUrl = checkout.url;
    metadata.gateway = "flutterwave";
  }

  const payment = await prisma.$transaction(async (tx) => {
    const record = await tx.payment.create({
      data: {
        userId: user.id,
        amount: credit,
        paidAmount: exactPaid,
        currency,
        method: method.id,
        status: instant ? "COMPLETED" : "PENDING",
        reference,
        note,
        metadata: Object.keys(metadata).length ? JSON.stringify(metadata) : null,
      },
    });
    if (instant) {
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { increment: credit }, currency: PANEL_CURRENCY },
      });
    }
    return record;
  });

  const fresh = await prisma.user.findUnique({ where: { id: user.id } });
  const checkoutUrl = metadata.checkoutUrl;

  return NextResponse.json({
    payment,
    balance: fresh?.balance ?? user.balance,
    checkoutUrl: checkoutUrl || null,
    crypto: method.id === "crypto" ? metadata : null,
    message: instant
      ? "Wallet credited in USDT."
      : checkoutUrl
        ? `Redirecting to ${method.name}…`
        : method.id === "crypto"
          ? "Send the exact USDT amount before the timer ends."
          : `Payment ${payment.reference} submitted. Your wallet will be credited after confirmation.`,
  });
}
