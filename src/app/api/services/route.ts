import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categoryPlatform, isPlatformId } from "@/lib/platforms";

export async function GET(request: Request) {
  const platform = new URL(request.url).searchParams.get("platform");

  if (isPlatformId(platform)) {
    const categories = await prisma.category.findMany({
      where: { services: { some: { status: "active" } } },
      select: { id: true, name: true },
    });
    const matched = categories.filter((category) => categoryPlatform(category.name) === platform);
    const services = await prisma.service.findMany({
      where: { status: "active", categoryId: { in: matched.map((category) => category.id) } },
      orderBy: [{ rate: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        rate: true,
        min: true,
        max: true,
        averageTime: true,
        refill: true,
        category: { select: { name: true } },
      },
    });

    return NextResponse.json({
      platform,
      services: services.map((service) => ({
        id: service.id,
        name: service.name,
        rate: service.rate,
        min: service.min,
        max: service.max,
        averageTime: service.averageTime,
        refill: service.refill,
        category: service.category.name,
      })),
    });
  }

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      services: {
        where: { status: "active" },
        orderBy: { rate: "asc" },
      },
    },
  });

  return NextResponse.json({
    categories: categories.filter((category) => category.services.length > 0),
  });
}
