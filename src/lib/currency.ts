export type WalletCurrency = "USDT";
export type PayCurrency = "USDT" | "NGN" | "GHS" | "KES";
export type CurrencyCode = PayCurrency;

export const PANEL_CURRENCY: WalletCurrency = "USDT";
export const USDT_DECIMALS = 4;
export const MIN_TOPUP_USDT = 1;

export const PAY_CURRENCIES: {
  code: PayCurrency;
  label: string;
  symbol: string;
  locale: string;
}[] = [
  { code: "USDT", label: "Tether", symbol: "USDT ", locale: "en-US" },
  { code: "NGN", label: "Nigerian Naira", symbol: "₦", locale: "en-NG" },
  { code: "GHS", label: "Ghanaian Cedi", symbol: "GH₵ ", locale: "en-GH" },
  { code: "KES", label: "Kenyan Shilling", symbol: "KSh ", locale: "en-KE" },
];

export const CURRENCIES = PAY_CURRENCIES;

function envRate(name: string, fallback: number) {
  const raw = process.env[`NEXT_PUBLIC_${name}`] || process.env[name];
  const value = raw ? Number(raw) : NaN;
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

/** Local units per 1 USDT. Override with USDT_NGN / USDT_GHS / USDT_KES. */
export function fxRate(currency: PayCurrency): number {
  if (currency === "NGN") return envRate("USDT_NGN", 1550);
  if (currency === "GHS") return envRate("USDT_GHS", 12.2);
  if (currency === "KES") return envRate("USDT_KES", 129);
  return 1;
}

export function publicFxRates() {
  return {
    USDT: 1,
    NGN: fxRate("NGN"),
    GHS: fxRate("GHS"),
    KES: fxRate("KES"),
  } as Record<PayCurrency, number>;
}

export function localToUsdt(amount: number, currency: PayCurrency) {
  return Number((amount / fxRate(currency)).toFixed(6));
}

export function usdtToLocal(usdt: number, currency: PayCurrency) {
  const digits = currency === "USDT" ? 4 : 2;
  return Number((usdt * fxRate(currency)).toFixed(digits));
}

export function getUsdtDepositAddress() {
  return (
    process.env.USDT_EVM_ADDRESS?.trim() ||
    process.env.NEXT_PUBLIC_USDT_EVM_ADDRESS?.trim() ||
    "0x24ed5adac799eff29f619d25d1d2074762fe4220"
  );
}

export function formatPay(amount: number, currency: string = PANEL_CURRENCY) {
  const value = Number.isFinite(amount) ? amount : 0;
  const meta = PAY_CURRENCIES.find((item) => item.code === currency);
  const digits = currency === "USDT" ? USDT_DECIMALS : 2;
  const formatted = value.toLocaleString(meta?.locale ?? "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  });
  if (currency === "NGN") return `₦${formatted}`;
  if (currency === "GHS") return `GH₵ ${formatted}`;
  if (currency === "KES") return `KSh ${formatted}`;
  return `${formatted} USDT`;
}

export function formatMoney(amount: number, _currency?: string) {
  return formatPay(amount, PANEL_CURRENCY);
}

export function getCurrency(_code?: string): WalletCurrency {
  return PANEL_CURRENCY;
}
