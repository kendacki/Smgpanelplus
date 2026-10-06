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
} from "./provider";

const OPEN_STATUSES = ["PENDING", "PROCESSING", "IN_PROGRESS", "PARTIAL"];

export function orderCharge(service: Pick<Service, "rate">, quantity: number, runs = 1) {
  return (service.rate / 1000) * quantity * Math.max(1, runs);
}

export async function placePanelOrder(input: {
  userId: string;
  balance: number;
  service: Service;
  link: string;
  quantity: number;
  runs?: number;
  interval?: number;
}) {
  const runs = input.runs && input.runs > 1 ? input.runs : undefined;
  const charge = orderCharge(input.service, input.quantity, runs ?? 1);
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
        link: input.link.trim(),
        quantity: input.quantity,
        charge,
        remains: input.quantity * (runs ?? 1),
        status: "PENDING",
        runs,
        interval: input.interval,
      },
      include: { service: true },
    });
  });

  if (!isProviderConfigured() || !input.service.providerServiceId) {
    return order;
  }

  try {
    const result = await providerAddOrder({
      service: input.service.providerServiceId,
      link: input.link.trim(),
      quantity: input.quantity,
      runs,
      interval: input.interval,
    });
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
