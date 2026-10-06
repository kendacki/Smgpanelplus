import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      currency: "USDT",
      balance: user.balance,
      apiKey: user.apiKey,
      avatarUrl: user.avatarUrl,
    },
  });
}
