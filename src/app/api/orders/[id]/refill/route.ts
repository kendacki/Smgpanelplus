import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { refillPanelOrder } from "@/lib/fulfill";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    const order = await refillPanelOrder(id, user.id);
    return NextResponse.json({ order });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Refill failed" },
      { status },
    );
  }
}
