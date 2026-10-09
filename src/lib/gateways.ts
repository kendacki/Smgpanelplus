import { createHmac } from "node:crypto";
import { SITE_URL } from "./site";

type CheckoutResult = { url: string } | { error: string };

function appUrl() {
  return SITE_URL;
}

export async function startPaystackCheckout(input: {
  email: string;
  amountNgn: number;
  reference: string;
}): Promise<CheckoutResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret) return { error: "Paystack is not configured" };

  const kobo = Math.round(input.amountNgn * 100);
  if (kobo < 100) return { error: "Paystack amount is too small" };

  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: kobo,
        currency: "NGN",
        reference: input.reference,
        callback_url: `${appUrl()}/dashboard/add-funds`,
        metadata: { panel: "smg", reference: input.reference },
      }),
      signal: AbortSignal.timeout(20_000),
    });
    const data = (await response.json()) as {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string };
    };
    const url = data.data?.authorization_url;
    if (!response.ok || !data.status || !url) {
      return { error: data.message || "Paystack checkout failed" };
    }
    return { url };
  } catch {
    return { error: "Could not reach Paystack" };
  }
}

export async function verifyPaystackReference(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret) return { ok: false as const, amount: 0, currency: "NGN" };

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
        signal: AbortSignal.timeout(20_000),
      },
    );
    const data = (await response.json()) as {
      status?: boolean;
      data?: { status?: string; amount?: number; currency?: string };
    };
    const paid = data.data?.status === "success";
    return {
      ok: Boolean(data.status && paid),
      amount: (data.data?.amount ?? 0) / 100,
      currency: data.data?.currency || "NGN",
    };
  } catch {
    return { ok: false as const, amount: 0, currency: "NGN" };
  }
}

export async function startFlutterwaveCheckout(input: {
  email: string;
  name: string;
  amount: number;
  currency: "NGN" | "GHS" | "KES";
  reference: string;
}): Promise<CheckoutResult> {
  const secret = process.env.FLW_SECRET_KEY?.trim();
  if (!secret) return { error: "Flutterwave is not configured" };

  try {
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: input.reference,
        amount: input.amount,
        currency: input.currency,
        redirect_url: `${appUrl()}/dashboard/add-funds`,
        customer: { email: input.email, name: input.name },
        customizations: {
          title: "SMG Panel",
          description: "Wallet top-up",
        },
        payment_options: "card,banktransfer,ussd,mobilemoneyghana,mpesa",
      }),
      signal: AbortSignal.timeout(20_000),
    });
    const data = (await response.json()) as {
      status?: string;
      message?: string;
      data?: { link?: string };
    };
    const url = data.data?.link;
    if (!response.ok || data.status !== "success" || !url) {
      return { error: data.message || "Flutterwave checkout failed" };
    }
    return { url };
  } catch {
    return { error: "Could not reach Flutterwave" };
  }
}

export async function verifyFlutterwaveReference(reference: string) {
  const secret = process.env.FLW_SECRET_KEY?.trim();
  if (!secret) return { ok: false as const, amount: 0, currency: "" };

  try {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
        signal: AbortSignal.timeout(20_000),
      },
    );
    const data = (await response.json()) as {
      status?: string;
      data?: { status?: string; amount?: number; currency?: string };
    };
    const paid = data.data?.status === "successful";
    return {
      ok: data.status === "success" && paid,
      amount: Number(data.data?.amount ?? 0),
      currency: data.data?.currency || "",
    };
  } catch {
    return { ok: false as const, amount: 0, currency: "" };
  }
}

export function paystackSignatureOk(rawBody: string, signature: string | null) {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret || !signature) return false;
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  return expected === signature;
}

export function flutterwaveSignatureOk(header: string | null) {
  const hash = process.env.FLW_SECRET_HASH?.trim();
  if (!hash || !header) return false;
  return hash === header;
}
