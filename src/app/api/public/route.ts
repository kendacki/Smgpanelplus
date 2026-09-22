import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [faqs, announcements, orderCount, userCount] = await Promise.all([
    prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.announcement.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } }),
    prisma.order.count(),
    prisma.user.count(),
  ]);

  return NextResponse.json({
    faqs,
    announcements,
    stats: {
      orders: 7_753_367 + orderCount,
      users: 286_547 + userCount,
      startingPrice: 20,
    },
  });
}
