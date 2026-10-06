export const PROVIDER_API_URL =
  process.env.AMAZINGSMM_API_URL || "https://amazingsmm.com/api/v2";

export function getProviderApiKey() {
  return process.env.AMAZINGSMM_API_KEY?.trim() || "";
}

export function isProviderConfigured() {
  return Boolean(getProviderApiKey());
}

export function getProviderMarkup() {
  const raw = Number(process.env.PROVIDER_MARKUP ?? "1.35");
  return Number.isFinite(raw) && raw >= 1 ? raw : 1.35;
}

export function sellRateFromUsdt(usdtPerThousand: number) {
  return Number((usdtPerThousand * getProviderMarkup()).toFixed(6));
}

export type ProviderService = {
  service: number | string;
  name: string;
  type?: string;
  category?: string;
  rate: string | number;
  min: string | number;
  max: string | number;
  refill?: boolean;
  cancel?: boolean;
};

type ProviderError = { error: string };

async function providerRequest<T>(params: Record<string, string | number | undefined>) {
  const key = getProviderApiKey();
  if (!key) {
    throw new Error("AmazingSMM API key is not configured");
  }

  const body = new URLSearchParams();
  body.set("key", key);
  for (const [name, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    body.set(name, String(value));
  }

  const response = await fetch(PROVIDER_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const text = await response.text();
  let data: unknown;
  try {
    data = JSON.parse(text) as unknown;
  } catch {
    throw new Error(text.slice(0, 180) || "AmazingSMM returned a non-JSON response");
  }

  if (!response.ok) {
    throw new Error(providerErrorMessage(data, `HTTP ${response.status}`));
  }

  return data as T;
}

export function providerErrorMessage(data: unknown, fallback = "Provider request failed") {
  if (data && typeof data === "object" && "error" in data) {
    const error = (data as ProviderError).error;
    if (typeof error === "string" && error) return error;
  }
  return fallback;
}

export async function providerServices() {
  const data = await providerRequest<ProviderService[] | ProviderError>({ action: "services" });
  if (!Array.isArray(data)) {
    throw new Error(providerErrorMessage(data, "Could not load provider services"));
  }
  return data;
}

export async function providerBalance() {
  return providerRequest<{ balance: string; currency: string } | ProviderError>({ action: "balance" });
}

export async function providerAddOrder(input: {
  service: number | string;
  link: string;
  quantity: number;
  runs?: number;
  interval?: number;
}) {
  return providerRequest<{ order: number | string } | ProviderError>({
    action: "add",
    service: input.service,
    link: input.link,
    quantity: input.quantity,
    runs: input.runs,
    interval: input.interval,
  });
}

export async function providerOrderStatuses(orderIds: Array<string | number>) {
  const ids = orderIds.map(String).filter(Boolean);
  if (ids.length === 0) return {} as Record<string, unknown>;
  if (ids.length === 1) {
    const data = await providerRequest<Record<string, unknown>>({
      action: "status",
      order: ids[0],
    });
    return { [ids[0]]: data } as Record<string, unknown>;
  }
  return providerRequest<Record<string, unknown>>({
    action: "status",
    orders: ids.join(","),
  });
}

export async function providerRefill(orderId: string | number) {
  return providerRequest<{ refill: string | number } | ProviderError>({
    action: "refill",
    order: orderId,
  });
}

export async function providerRefills(orderIds: Array<string | number>) {
  return providerRequest<
    Array<{ order: number | string; refill: number | string | { error: string } }> | ProviderError
  >({
    action: "refill",
    orders: orderIds.map(String).join(","),
  });
}

export async function providerRefillStatus(refillId: string | number) {
  return providerRequest<{ status: string } | ProviderError>({
    action: "refill_status",
    refill: refillId,
  });
}

export async function providerRefillStatuses(refillIds: Array<string | number>) {
  return providerRequest<
    Array<{ refill: number | string; status: string | { error: string } }> | ProviderError
  >({
    action: "refill_status",
    refills: refillIds.map(String).join(","),
  });
}

export async function providerCancel(orderIds: Array<string | number>) {
  return providerRequest<
    Array<{ order: number | string; cancel: number | string | { error: string } }> | ProviderError
  >({
    action: "cancel",
    orders: orderIds.map(String).join(","),
  });
}

export function mapProviderStatus(status: string) {
  const key = status.trim().toLowerCase().replace(/[\s-]+/g, "_");
  const map: Record<string, string> = {
    pending: "PENDING",
    awaiting: "PENDING",
    processing: "PROCESSING",
    in_progress: "IN_PROGRESS",
    inprogress: "IN_PROGRESS",
    completed: "COMPLETED",
    complete: "COMPLETED",
    partial: "PARTIAL",
    canceled: "CANCELED",
    cancelled: "CANCELED",
    refund: "REFUND",
    refunded: "REFUND",
  };
  return map[key] ?? "PROCESSING";
}
