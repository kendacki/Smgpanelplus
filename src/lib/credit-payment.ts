import { prisma } from "./prisma";

function amountsMatch(expected: number, received: number) {
  return Math.abs(expected - received) <= Math.max(1, expected * 0.01);
}

export async function completePaymentByReference(
  reference: string,
  paid?: { amount: number; currency?: string; metadata?: string },
) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { reference } });
    if (!payment) return { ok: false as const, reason: "not_found" as const, payment: null };
    if (payment.status === "COMPLETED") {
      return { ok: true as const, reason: "already" as const, payment };
    }
    if (payment.status === "REJECTED" || payment.status === "FAILED") {
      return { ok: false as const, reason: "closed" as const, payment };
    }
    if (paid) {
      if (paid.currency && paid.currency !== payment.currency) {
        return { ok: false as const, reason: "currency" as const, payment };
      }
      if (!amountsMatch(payment.paidAmount, paid.amount)) {
        return { ok: false as const, reason: "amount" as const, payment };
      }
    }
    await tx.user.update({
      where: { id: payment.userId },
      data: { balance: { increment: payment.amount } },
    });
    const updated = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        metadata: paid?.metadata ?? payment.metadata,
      },
    });
    return { ok: true as const, reason: "credited" as const, payment: updated };
  });
}

export async function failPayment(reference: string) {
  const payment = await prisma.payment.findUnique({ where: { reference } });
  if (!payment || payment.status !== "PENDING") return payment;
  return prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
}
