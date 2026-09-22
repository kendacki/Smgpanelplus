import type { CurrencyCode } from "./currency";

export const APP_NAME = "SMG Panel";
export const APP_TAGLINE = "Private-grade social media growth for Africa";

export const PAYMENT_METHODS: {
  id: string;
  name: string;
  description: string;
  currencies: CurrencyCode[];
  instant: boolean;
}[] = [
  {
    id: "paystack",
    name: "Paystack / Card",
    description: "Visa, Mastercard and local cards",
    currencies: ["NGN", "USD", "GHS"],
    instant: true,
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    description: "Cards, bank and mobile money",
    currencies: ["NGN", "USD", "GHS", "KES"],
    instant: true,
  },
  {
    id: "mpesa",
    name: "M-Pesa",
    description: "Kenya mobile money",
    currencies: ["KES"],
    instant: false,
  },
  {
    id: "momo",
    name: "MoMo",
    description: "Ghana Mobile Money",
    currencies: ["GHS"],
    instant: false,
  },
  {
    id: "bank",
    name: "Bank Transfer",
    description: "Nigerian bank transfer with auto-reference",
    currencies: ["NGN"],
    instant: false,
  },
  {
    id: "crypto",
    name: "USDT",
    description: "USDT (TRC20) manual confirmation",
    currencies: ["USD"],
    instant: false,
  },
  {
    id: "demo",
    name: "Demo Credit",
    description: "Instant wallet credit for testing the panel",
    currencies: ["NGN", "USD", "GHS", "KES"],
    instant: true,
  },
];

export const ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "IN_PROGRESS",
  "COMPLETED",
  "PARTIAL",
  "CANCELED",
  "REFUND",
] as const;
