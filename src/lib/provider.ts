/**
 * SMMTurk v2 client — TypeScript port of the official PHP sample.
 * POST application/x-www-form-urlencoded to https://smmturk.org/api/v2
 */
export const PROVIDER_API_URL =
  process.env.SMM_API_URL ||
  process.env.AMAZINGSMM_API_URL ||
  "https://smmturk.org/api/v2";

const PROVIDER_USER_AGENT = "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)";

export function getProviderApiKey() {
  return (process.env.SMM_API_KEY || process.env.AMAZINGSMM_API_KEY || "")
    .trim()
    .replace(/^["']+|["']+$/g, "");
}

export function isProviderConfigured() {
  return Boolean(getProviderApiKey());
}

export function getProviderMarkup() {
  const raw = Number(process.env.PROVIDER_MARKUP ?? "1.35");
  return Number.isFinite(raw) && raw >= 1 ? raw : 1.35;
}

/** Flat USDT added to every sell rate (per 1,000, or the package price). */
export const PRICE_EXTRA_USDT = 1.04;

export function sellRateFromUsdt(usdtPerThousand: number) {
  return Number((usdtPerThousand * getProviderMarkup() + PRICE_EXTRA_USDT).toFixed(6));
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
  dripfeed?: boolean;
};

export type ProviderOrderInput = {
  service: number | string;
  link?: string;
  quantity?: number;
  runs?: number;
  interval?: number;
  comments?: string;
  usernames?: string;
  keywords?: string;
  hashtag?: string;
  username?: string;
  groups?: string;
  answer_number?: string | number;
  min?: number;
  max?: number;
  posts?: number;
  old_posts?: number;
  delay?: number;
  expiry?: string;
};

type ProviderError = { error: string };

/** Same wire format as the PHP `connect()` helper: form POST, urlencoded fields. */
async function connect(post: Record<string, string | number | undefined>) {
  const key = getProviderApiKey();
  if (!key) {
    throw new Error("Provider API key is not configured");
  }

  const body = new URLSearchParams();
  body.set("key", key);
  for (const [name, value] of Object.entries(post)) {
    if (value === undefined || value === "") continue;
    body.set(name, String(value));
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 180000);
  let response: Response;
  try {
    response = await fetch(PROVIDER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": PROVIDER_USER_AGENT,
      },
      body,
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  const text = await response.text();
  if (!text) {
    throw new Error("Provider returned an empty response");
  }

  let data: unknown;
  try {
    data = JSON.parse(text) as unknown;
  } catch {
    throw new Error(text.slice(0, 180) || "Provider returned a non-JSON response");
  }

  if (!response.ok) {
    throw new Error(providerErrorMessage(data, `HTTP ${response.status}`));
  }

  return data;
}

export function providerErrorMessage(data: unknown, fallback = "Provider request failed") {
  if (data && typeof data === "object" && "error" in data) {
    const error = (data as ProviderError).error;
    if (typeof error === "string" && error) return error;
  }
  return fallback;
}

export async function providerServices() {
  const data = await connect({ action: "services" });
  if (!Array.isArray(data)) {
    throw new Error(providerErrorMessage(data, "Could not load provider services"));
  }
  return data as ProviderService[];
}

export async function providerBalance() {
  return connect({ action: "balance" }) as Promise<{ balance: string; currency: string } | ProviderError>;
}

export async function providerAddOrder(input: ProviderOrderInput) {
  return connect({
    action: "add",
    service: input.service,
    link: input.link,
    quantity: input.quantity,
    runs: input.runs,
    interval: input.interval,
    comments: input.comments,
    usernames: input.usernames,
    keywords: input.keywords,
    hashtag: input.hashtag,
    username: input.username,
    groups: input.groups,
    answer_number: input.answer_number,
    min: input.min,
    max: input.max,
    posts: input.posts,
    old_posts: input.old_posts,
    delay: input.delay,
    expiry: input.expiry,
  }) as Promise<{ order: number | string } | ProviderError>;
}

export async function providerOrderStatuses(orderIds: Array<string | number>) {
  const ids = orderIds.map(String).filter(Boolean);
  if (ids.length === 0) return {} as Record<string, unknown>;
  if (ids.length === 1) {
    const data = (await connect({
      action: "status",
      order: ids[0],
    })) as Record<string, unknown>;
    return { [ids[0]]: data };
  }
  return connect({
    action: "status",
    orders: ids.join(","),
  }) as Promise<Record<string, unknown>>;
}

export async function providerRefill(orderId: string | number) {
  return connect({
    action: "refill",
    order: orderId,
  }) as Promise<{ refill: string | number } | ProviderError>;
}

export async function providerRefills(orderIds: Array<string | number>) {
  return connect({
    action: "refill",
    orders: orderIds.map(String).join(","),
  }) as Promise<
    Array<{ order: number | string; refill: number | string | { error: string } }> | ProviderError
  >;
}

export async function providerRefillStatus(refillId: string | number) {
  return connect({
    action: "refill_status",
    refill: refillId,
  }) as Promise<{ status: string } | ProviderError>;
}

export async function providerRefillStatuses(refillIds: Array<string | number>) {
  return connect({
    action: "refill_status",
    refills: refillIds.map(String).join(","),
  }) as Promise<
    Array<{ refill: number | string; status: string | { error: string } }> | ProviderError
  >;
}

export async function providerCancel(orderIds: Array<string | number>) {
  return connect({
    action: "cancel",
    orders: orderIds.map(String).join(","),
  }) as Promise<
    Array<{ order: number | string; cancel: number | string | { error: string } }> | ProviderError
  >;
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
