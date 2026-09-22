import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      balance: true,
      currency: true,
      status: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });
  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const user = await prisma.user.update({
    where: { id: body.id },
    data: {
      ...(typeof body.balance === "number" ? { balance: body.balance } : {}),
      ...(body.status ? { status: body.status } : {}),
      ...(body.role ? { role: body.role } : {}),
    },
  });
  return NextResponse.json({ user });
}
