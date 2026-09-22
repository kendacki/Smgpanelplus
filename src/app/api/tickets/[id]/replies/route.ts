import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ticketReplySchema } from "@/lib/validations";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }
  if (ticket.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (ticket.status === "CLOSED" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ticket is closed" }, { status: 400 });
  }

  const body = await request.json();
  const parsed = ticketReplySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid reply" },
      { status: 400 },
    );
  }

  const reply = await prisma.ticketReply.create({
    data: {
      ticketId: id,
      userId: user.id,
      message: parsed.data.message,
    },
  });

  await prisma.ticket.update({
    where: { id },
    data: {
      status: user.role === "ADMIN" ? "ANSWERED" : "OPEN",
    },
  });

  return NextResponse.json({ reply });
}
