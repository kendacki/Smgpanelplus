import type { CurrencyCode } from "./currency";
import { PANEL_CURRENCY } from "./currency";

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
    id: "crypto",
    name: "USDT (TRC20)",
    description: "Send USDT on TRON. Admin confirms the deposit, then your wallet is credited.",
    currencies: [PANEL_CURRENCY],
    instant: false,
  },
  {
    id: "demo",
    name: "Demo Credit",
    description: "Instant USDT credit for testing the panel",
    currencies: [PANEL_CURRENCY],
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
