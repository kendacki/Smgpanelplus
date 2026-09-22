export type CurrencyCode = "NGN" | "USD" | "GHS" | "KES";

export const CURRENCIES: {
  code: CurrencyCode;
  label: string;
  symbol: string;
  flag: string;
}[] = [
  { code: "NGN", label: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  { code: "USD", label: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "GHS", label: "Ghanaian Cedi", symbol: "GH₵", flag: "🇬🇭" },
  { code: "KES", label: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
];

/** How many units of a currency equal 1 NGN. */
export const NGN_RATES: Record<CurrencyCode, number> = {
  NGN: 1,
  USD: 1 / 1550,
  GHS: 1 / 105,
  KES: 1 / 11.8,
};

export function convertFromNgn(amountNgn: number, currency: CurrencyCode) {
  return amountNgn * NGN_RATES[currency];
}

export function convertToNgn(amount: number, currency: CurrencyCode) {
  return amount / NGN_RATES[currency];
}

export function formatMoney(amountNgn: number, currency: CurrencyCode) {
  const value = convertFromNgn(amountNgn, currency);
  const meta = CURRENCIES.find((c) => c.code === currency)!;
  const digits = currency === "NGN" || currency === "KES" ? 0 : 2;
  return `${meta.symbol}${value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

export function getCurrency(code: string): CurrencyCode {
  if (code === "USD" || code === "GHS" || code === "KES" || code === "NGN") {
    return code;
  }
  return "NGN";
}
