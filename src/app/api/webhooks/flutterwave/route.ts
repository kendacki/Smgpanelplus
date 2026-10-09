import { NextResponse } from "next/server";
import { completePaymentByReference, failPayment } from "@/lib/credit-payment";
import { flutterwaveSignatureOk, verifyFlutterwaveReference } from "@/lib/gateways";

export async function POST(request: Request) {
  if (!flutterwaveSignatureOk(request.headers.get("verif-hash"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = (await request.json()) as {
    event?: string;
    data?: { tx_ref?: string; status?: string; amount?: number; currency?: string };
  };

  const reference = event.data?.tx_ref;
  if (!reference) {
    return NextResponse.json({ received: true });
  }

  const verified = await verifyFlutterwaveReference(reference);
  if (verified.ok) {
    await completePaymentByReference(reference, {
      amount: verified.amount,
      currency: verified.currency || event.data?.currency,
    });
  } else if (event.data?.status === "failed") {
    await failPayment(reference);
  }

  return NextResponse.json({ received: true });
}
