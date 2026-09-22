import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { massOrderSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = massOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const lines = parsed.data.lines
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return NextResponse.json({ error: "No order lines found" }, { status: 400 });
  }
  if (lines.length > 50) {
    return NextResponse.json({ error: "Maximum 50 lines per mass order" }, { status: 400 });
  }

  const created: string[] = [];
  const errors: { line: number; message: string }[] = [];
  let balance = user.balance;

  for (const [index, line] of lines.entries()) {
    const parts = line.split("|").map((p) => p.trim());
    if (parts.length < 3) {
      errors.push({ line: index + 1, message: "Use serviceId | link | quantity" });
      continue;
    }
    const [serviceId, link, qtyRaw] = parts;
    const quantity = Number(qtyRaw);
    if (!serviceId || !link || !Number.isFinite(quantity)) {
      errors.push({ line: index + 1, message: "Invalid values" });
      continue;
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || service.status !== "active") {
      errors.push({ line: index + 1, message: "Unknown service" });
      continue;
    }
    if (quantity < service.min || quantity > service.max) {
      errors.push({
        line: index + 1,
        message: `Quantity must be ${service.min}-${service.max}`,
      });
      continue;
    }

    const charge = (service.rate / 1000) * quantity;
    if (balance < charge) {
      errors.push({ line: index + 1, message: "Insufficient balance" });
      continue;
    }

    try {
      new URL(link);
    } catch {
      errors.push({ line: index + 1, message: "Invalid URL" });
      continue;
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: charge } },
      });
      const order = await tx.order.create({
        data: {
          userId: user.id,
          serviceId: service.id,
          link,
          quantity,
          charge,
          remains: quantity,
          status: "PENDING",
        },
      });
      created.push(order.id);
    });
    balance -= charge;
  }

  return NextResponse.json({ created, errors, remainingBalance: balance });
}
