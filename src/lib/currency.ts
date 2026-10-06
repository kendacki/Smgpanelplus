export type CurrencyCode = "USDT";

export const PANEL_CURRENCY: CurrencyCode = "USDT";
export const USDT_DECIMALS = 4;
export const MIN_TOPUP_USDT = 1;

export const CURRENCIES: {
  code: CurrencyCode;
  label: string;
  symbol: string;
}[] = [{ code: "USDT", label: "Tether", symbol: "USDT " }];

export function getUsdtDepositAddress() {
  return process.env.NEXT_PUBLIC_USDT_TRC20_ADDRESS?.trim() || "";
}

export function formatMoney(amount: number, _currency?: string) {
  const value = Number.isFinite(amount) ? amount : 0;
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: USDT_DECIMALS,
  })} USDT`;
}

export function getCurrency(_code?: string): CurrencyCode {
  return PANEL_CURRENCY;
}
