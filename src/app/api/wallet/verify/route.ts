import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { completePaymentByReference, failPayment } from "@/lib/credit-payment";
import { verifyFlutterwaveReference, verifyPaystackReference } from "@/lib/gateways";
import { findUsdtTransfer, parseUsdtCheckout } from "@/lib/usdt-evm";

export async function GET(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const reference =
    url.searchParams.get("reference") ||
    url.searchParams.get("trxref") ||
    url.searchParams.get("tx_ref") ||
    "";
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const payment = await prisma.payment.findFirst({
    where: { reference, userId: user.id },
  });
  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  if (payment.status === "COMPLETED") {
    const fresh = await prisma.user.findUnique({ where: { id: user.id } });
    return NextResponse.json({
      payment,
      balance: fresh?.balance ?? user.balance,
      message: "Wallet already credited.",
    });
  }

  let verified = { ok: false, amount: 0, currency: payment.currency };
  let nextMetadata = payment.metadata;
  if (payment.method === "paystack") {
    verified = await verifyPaystackReference(reference);
  } else if (payment.method === "flutterwave") {
    verified = await verifyFlutterwaveReference(reference);
  } else if (payment.method === "crypto") {
    const checkout = parseUsdtCheckout(payment.metadata);
    if (!checkout) {
      return NextResponse.json({ error: "This USDT payment is missing its amount." }, { status: 400 });
    }
    if (Date.now() > new Date(checkout.expiresAt).getTime()) {
      await failPayment(reference);
      return NextResponse.json({
        payment: { ...payment, status: "FAILED" },
        expired: true,
        message: "This payment window expired. Start a new USDT payment.",
      });
    }
    const transfer = await findUsdtTransfer({
      payUnits: checkout.payUnits,
      address: checkout.address,
      createdAt: payment.createdAt,
      expiresAt: new Date(checkout.expiresAt),
    }).catch(() => null);
    if (!transfer) {
      return NextResponse.json({
        payment,
        crypto: checkout,
        message: "Waiting for the USDT transfer on BNB Smart Chain.",
      });
    }
    const used = await prisma.payment.findFirst({
      where: { status: "COMPLETED", metadata: { contains: transfer.txHash } },
    });
    if (used) {
      return NextResponse.json({ error: "This transfer was already credited." }, { status: 409 });
    }
    verified = { ok: true, amount: payment.paidAmount, currency: "USDT" };
    nextMetadata = JSON.stringify({ ...checkout, txHash: transfer.txHash });
  } else {
    return NextResponse.json({
      payment,
      message: "This payment is waiting for admin confirmation.",
    });
  }

  if (!verified.ok) {
    return NextResponse.json({
      payment,
      message: "Payment is not confirmed yet. If you were charged, wait a minute and refresh.",
    });
  }

  const result = await completePaymentByReference(reference, {
    amount: verified.amount,
    currency: verified.currency || payment.currency,
    metadata: nextMetadata || undefined,
  });
  if (!result.ok) {
    if (result.reason === "amount" || result.reason === "currency") {
      await failPayment(reference);
    }
    return NextResponse.json({ error: "Could not credit this payment" }, { status: 400 });
  }

  const fresh = await prisma.user.findUnique({ where: { id: user.id } });
  return NextResponse.json({
    payment: result.payment,
    balance: fresh?.balance ?? user.balance,
    message: "Wallet credited in USDT.",
  });
}
