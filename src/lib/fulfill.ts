import type { Service } from "@prisma/client";
import { prisma } from "./prisma";
import {
  isProviderConfigured,
  mapProviderStatus,
  providerAddOrder,
  providerCancel,
  providerErrorMessage,
  providerOrderStatuses,
  providerRefill,
  type ProviderOrderInput,
} from "./provider";
import {
  extrasForFields,
  fieldsForService,
  isPackageType,
  isSubscriptionType,
  lineCount,
  sellCharge,
  type OrderExtras,
} from "./service-types";

const OPEN_STATUSES = ["PENDING", "PROCESSING", "IN_PROGRESS", "PARTIAL"];

function extraString(value: string | number | undefined) {
  return typeof value === "string" && value ? value : undefined;
}

function extraNumber(value: string | number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function orderCharge(service: Pick<Service, "rate" | "type">, quantity: number, runs = 1) {
  return sellCharge(service.rate, service.type, quantity, runs);
}

export function resolveOrderInput(
  service: Pick<Service, "type" | "dripfeed" | "min" | "max">,
  input: {
    link?: string;
    quantity?: number;
    extras?: OrderExtras;
  },
) {
  const fields = fieldsForService(service.type, service.dripfeed);
  const extras = input.extras || {};
  const link = (input.link || "").trim();
  let quantity = input.quantity;

  if (fields.includes("comments") && !quantity) {
    quantity = lineCount(extras.comments);
  }
  if (fields.includes("usernames") && !quantity) {
    quantity = lineCount(extras.usernames);
  }
  if (isPackageType(service.type)) {
    quantity = quantity && quantity > 0 ? quantity : 1;
  }
  if (isSubscriptionType(service.type)) {
    quantity = extras.posts && extras.posts > 0 ? extras.posts : extras.max || extras.min || service.min;
  }

  if (fields.includes("link") && !link) {
    throw Object.assign(new Error("Enter a valid link"), { status: 400 });
  }
  if (fields.includes("link") && link) {
    try {
      new URL(link);
    } catch {
      throw Object.assign(new Error("Enter a valid URL"), { status: 400 });
    }
  }
  if (fields.includes("username") && !extras.username?.trim()) {
    throw Object.assign(new Error("Username is required"), { status: 400 });
  }
  if (fields.includes("comments") && lineCount(extras.comments) < 1) {
    throw Object.assign(new Error("Enter at least one comment"), { status: 400 });
  }
  if (fields.includes("usernames") && lineCount(extras.usernames) < 1) {
    throw Object.assign(new Error("Enter at least one username"), { status: 400 });
  }
  if (fields.includes("keywords") && !extras.keywords?.trim()) {
    throw Object.assign(new Error("Keywords are required"), { status: 400 });
  }
  if (fields.includes("hashtag") && !extras.hashtag?.trim()) {
    throw Object.assign(new Error("Hashtag is required"), { status: 400 });
  }
  if (fields.includes("groups") && lineCount(extras.groups) < 1) {
    throw Object.assign(new Error("Enter at least one group"), { status: 400 });
  }
  if (fields.includes("answer_number") && !extras.answer_number?.trim()) {
    throw Object.assign(new Error("Poll answer number is required"), { status: 400 });
  }
  if (fields.includes("subscription")) {
    if (!extras.min || !extras.max || extras.max < extras.min) {
      throw Object.assign(new Error("Enter a valid min and max quantity"), { status: 400 });
    }
  }
  if (fields.includes("drip")) {
    if (extras.runs && extras.runs > 1 && !extras.interval) {
      throw Object.assign(new Error("Drip-feed interval is required"), { status: 400 });
    }
  }

  if (!quantity || quantity < 1) {
    throw Object.assign(new Error("Quantity must be greater than 0"), { status: 400 });
  }
  if (!isPackageType(service.type) && !isSubscriptionType(service.type)) {
    if (quantity < service.min || quantity > service.max) {
      throw Object.assign(new Error(`Quantity must be between ${service.min} and ${service.max}`), {
        status: 400,
      });
    }
  }

  return {
    link: link || extras.username?.trim() || "",
    sendLink: fields.includes("link"),
    quantity,
    extras: extrasForFields(fields, extras),
  };
}

export async function placePanelOrder(input: {
  userId: string;
  balance: number;
  service: Service;
  link: string;
  quantity?: number;
  extras?: OrderExtras;
}) {
  const resolved = resolveOrderInput(input.service, {
    link: input.link,
    quantity: input.quantity,
    extras: input.extras,
  });
  const runs = Number(resolved.extras.runs) > 1 ? Number(resolved.extras.runs) : undefined;
  const interval = Number(resolved.extras.interval) || undefined;
  const charge = orderCharge(input.service, resolved.quantity, runs ?? 1);
  if (input.balance < charge) {
    throw Object.assign(new Error("Insufficient balance. Add funds to continue."), { status: 402 });
  }

  const order = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: input.userId },
      data: { balance: { decrement: charge } },
    });
    return tx.order.create({
      data: {
        userId: input.userId,
        serviceId: input.service.id,
        link: resolved.link,
        quantity: resolved.quantity,
        charge,
        remains: resolved.quantity * (runs ?? 1),
        status: "PENDING",
        runs,
        interval,
        extras: Object.keys(resolved.extras).length ? resolved.extras : undefined,
      },
      include: { service: true },
    });
  });

  if (!isProviderConfigured() || !input.service.providerServiceId) {
    return order;
  }

  try {
    const extras = resolved.extras;
    const payload: ProviderOrderInput = {
      service: input.service.providerServiceId,
      link: resolved.sendLink ? resolved.link || undefined : undefined,
      quantity:
        isPackageType(input.service.type) || isSubscriptionType(input.service.type)
          ? undefined
          : resolved.quantity,
      comments: extraString(extras.comments),
      usernames: extraString(extras.usernames),
      keywords: extraString(extras.keywords),
      hashtag: extraString(extras.hashtag),
      username: extraString(extras.username),
      groups: extraString(extras.groups),
      answer_number: extraString(extras.answer_number),
      runs: extraNumber(extras.runs),
      interval: extraNumber(extras.interval),
      min: extraNumber(extras.min),
      max: extraNumber(extras.max),
      posts: extraNumber(extras.posts),
      old_posts: extraNumber(extras.old_posts),
      delay: extraNumber(extras.delay),
      expiry: extraString(extras.expiry),
    };
    const result = await providerAddOrder(payload);
    if ("error" in result) {
      throw new Error(result.error);
    }
    return prisma.order.update({
      where: { id: order.id },
      data: {
        providerOrderId: String(result.order),
        status: "IN_PROGRESS",
      },
      include: { service: true },
    });
  } catch (error) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: input.userId },
        data: { balance: { increment: charge } },
      }),
      prisma.order.delete({ where: { id: order.id } }),
    ]);
    const message = error instanceof Error ? error.message : "Provider rejected the order";
    throw Object.assign(new Error(message), { status: 502 });
  }
}

export async function refreshOrdersFromProvider(orderIds?: string[], userId?: string) {
  if (!isProviderConfigured()) return 0;

  const orders = await prisma.order.findMany({
    where: {
      providerOrderId: { not: null },
      ...(userId ? { userId } : {}),
      ...(orderIds ? { id: { in: orderIds } } : { status: { in: OPEN_STATUSES } }),
    },
    take: 100,
  });
  if (orders.length === 0) return 0;

  const statuses = await providerOrderStatuses(orders.map((order) => order.providerOrderId as string));
  let updated = 0;

  for (const order of orders) {
    const payload = statuses[order.providerOrderId as string];
    if (!payload || typeof payload !== "object" || "error" in payload) continue;
    const row = payload as {
      charge?: string;
      start_count?: string;
      status?: string;
      remains?: string;
    };
    if (!row.status) continue;

    const nextStatus = mapProviderStatus(row.status);
    const startCount = Number(row.start_count ?? order.startCount);
    const remains = Number(row.remains ?? order.remains);
    const shouldRefund =
      (nextStatus === "CANCELED" || nextStatus === "REFUND") &&
      !["CANCELED", "REFUND"].includes(order.status);

    await prisma.$transaction(async (tx) => {
      if (shouldRefund) {
        await tx.user.update({
          where: { id: order.userId },
          data: { balance: { increment: order.charge } },
        });
      }
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: nextStatus,
          startCount: Number.isFinite(startCount) ? startCount : order.startCount,
          remains: Number.isFinite(remains) ? remains : order.remains,
        },
      });
    });
    updated += 1;
  }

  return updated;
}

export async function refillPanelOrder(orderId: string, userId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { service: true },
  });
  if (!order) throw Object.assign(new Error("Order not found"), { status: 404 });
  if (!order.service.refill) throw Object.assign(new Error("This service does not support refill"), { status: 400 });
  if (!order.providerOrderId) throw Object.assign(new Error("Order is not with the provider yet"), { status: 400 });

  const result = await providerRefill(order.providerOrderId);
  if ("error" in result) {
    throw Object.assign(new Error(result.error), { status: 400 });
  }
  return prisma.order.update({
    where: { id: order.id },
    data: { providerRefillId: String(result.refill) },
  });
}

export async function cancelPanelOrder(orderId: string, userId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
  });
  if (!order) throw Object.assign(new Error("Order not found"), { status: 404 });
  if (!order.providerOrderId) throw Object.assign(new Error("Order is not with the provider yet"), { status: 400 });

  const result = await providerCancel([order.providerOrderId]);
  if ("error" in result) {
    throw Object.assign(new Error(providerErrorMessage(result)), { status: 400 });
  }
  const row = Array.isArray(result) ? result[0] : null;
  if (row && typeof row.cancel === "object" && row.cancel && "error" in row.cancel) {
    throw Object.assign(new Error(row.cancel.error), { status: 400 });
  }
  return refreshOrdersFromProvider([order.id]);
}
