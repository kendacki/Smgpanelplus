import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { ensurePanelUser } from "@/lib/auth";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase auth is not configured" }, { status: 503 });
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const identity = parsed.data.username.toLowerCase();
    const panelUser = await prisma.user.findFirst({
      where: { OR: [{ username: identity }, { email: identity }] },
    });
    const email = identity.includes("@") ? identity : panelUser?.email;
    if (!email) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: parsed.data.password,
    });
    if (error || !data.user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const user = await ensurePanelUser(data.user);
    if (!user || user.status !== "active") {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "Account is disabled" }, { status: 403 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        currency: "USDT",
        balance: user.balance,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to sign in" }, { status: 500 });
  }
}
