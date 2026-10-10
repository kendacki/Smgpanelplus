import type { PayCurrency } from "./currency";
import { getUsdtDepositAddress } from "./currency";

export type PaymentMethodId =
  | "crypto"
  | "paystack"
  | "flutterwave"
  | "bank_ngn"
  | "mpesa"
  | "momo"
  | "demo";

export type PaymentMethod = {
  id: PaymentMethodId;
  name: string;
  description: string;
  currencies: PayCurrency[];
  instant: boolean;
  kind: "crypto" | "gateway" | "manual" | "demo";
  region: string;
  live: boolean;
  instructions: string;
};

export function isPaystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY?.trim());
}

export function isFlutterwaveConfigured() {
  return Boolean(process.env.FLW_SECRET_KEY?.trim());
}

export function isDemoCreditEnabled() {
  return process.env.ALLOW_DEMO_CREDIT !== "0";
}

export function listPaymentMethods(): PaymentMethod[] {
  const methods: PaymentMethod[] = [
    {
      id: "crypto",
      name: "USDT (BEP-20)",
      description: "Send USDT on BNB Smart Chain. We confirm it on-chain.",
      currencies: ["USDT"],
      instant: false,
      kind: "crypto",
      region: "Global",
      live: true,
      instructions: usdtInstructions(),
    },
    {
      id: "paystack",
      name: "Paystack",
      description: "Naira cards, bank, USSD and transfer.",
      currencies: ["NGN"],
      instant: false,
      kind: "gateway",
      region: "Nigeria",
      live: isPaystackConfigured(),
      instructions: "You will be redirected to Paystack to complete payment.",
    },
    {
      id: "flutterwave",
      name: "Flutterwave",
      description: "Cards and mobile money in NGN, GHS and KES.",
      currencies: ["NGN", "GHS", "KES"],
      instant: false,
      kind: "gateway",
      region: "Nigeria · Ghana · Kenya",
      live: isFlutterwaveConfigured(),
      instructions: "You will be redirected to Flutterwave to complete payment.",
    },
    {
      id: "bank_ngn",
      name: "Bank transfer",
      description: "Pay in Naira to the SMG account. Admin confirms.",
      currencies: ["NGN"],
      instant: false,
      kind: "manual",
      region: "Nigeria",
      live: true,
      instructions:
        process.env.PAY_BANK_NGN?.trim() ||
        "Submit this request, then transfer Naira using the payment reference as narration. Ask support for the account if it is not shown here.",
    },
    {
      id: "mpesa",
      name: "M-Pesa",
      description: "Send Kenyan shillings via M-Pesa. Admin confirms.",
      currencies: ["KES"],
      instant: false,
      kind: "manual",
      region: "Kenya",
      live: true,
      instructions:
        process.env.PAY_MPESA_KES?.trim() ||
        "Submit this request, then pay via M-Pesa using the payment reference. Ask support for the till or paybill if it is not shown here.",
    },
    {
      id: "momo",
      name: "MTN MoMo",
      description: "Send Ghanaian cedis via MTN Mobile Money. Admin confirms.",
      currencies: ["GHS"],
      instant: false,
      kind: "manual",
      region: "Ghana",
      live: true,
      instructions:
        process.env.PAY_MOMO_GHS?.trim() ||
        "Submit this request, then pay via MTN MoMo using the payment reference. Ask support for the number if it is not shown here.",
    },
  ];

  if (isDemoCreditEnabled()) {
    methods.push({
      id: "demo",
      name: "Demo credit",
      description: "Instant USDT for testing the panel.",
      currencies: ["USDT"],
      instant: true,
      kind: "demo",
      region: "Testing",
      live: true,
      instructions: "Wallet is credited immediately. Turn this off in production with ALLOW_DEMO_CREDIT=0.",
    });
  }

  return methods;
}

export function publicPaymentMethods() {
  return listPaymentMethods().map((method) => ({
    ...method,
    instructions: method.kind === "demo" ? "" : method.instructions,
  }));
}

export function findPaymentMethod(id: string) {
  return listPaymentMethods().find((method) => method.id === id);
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  crypto: "USDT (BEP-20)",
  paystack: "Paystack",
  flutterwave: "Flutterwave",
  bank_ngn: "Bank transfer",
  mpesa: "M-Pesa",
  momo: "MTN MoMo",
  demo: "Demo credit",
};

export function paymentMethodName(id: string) {
  return PAYMENT_METHOD_LABELS[id] ?? id;
}

function usdtInstructions() {
  const address = getUsdtDepositAddress();
  if (address) {
    return `Send the exact USDT amount on BNB Smart Chain (BEP-20) to ${address}. The wallet is credited after the transfer is seen.`;
  }
  return "Start a USDT payment to get the exact amount, address and countdown.";
}
