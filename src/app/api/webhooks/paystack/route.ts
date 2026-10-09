import { NextResponse } from "next/server";
import { completePaymentByReference, failPayment } from "@/lib/credit-payment";
import { paystackSignatureOk } from "@/lib/gateways";

export async function POST(request: Request) {
  const raw = await request.text();
  if (!paystackSignatureOk(raw, request.headers.get("x-paystack-signature"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    event?: string;
    data?: { reference?: string; status?: string; amount?: number; currency?: string };
  };
  try {
    event = JSON.parse(raw) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const reference = event.data?.reference;
  if (!reference) {
    return NextResponse.json({ received: true });
  }

  if (event.event === "charge.success" && event.data?.status === "success") {
    await completePaymentByReference(reference, {
      amount: (event.data.amount ?? 0) / 100,
      currency: event.data.currency,
    });
  } else if (event.data?.status === "failed") {
    await failPayment(reference);
  }

  return NextResponse.json({ received: true });
}
