import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { ensurePanelUser } from "@/lib/auth";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase auth is not configured" }, { status: 503 });
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const username = parsed.data.username.toLowerCase();
    const email = parsed.data.email.toLowerCase();

    const exists = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (exists) {
      return NextResponse.json({ error: "Username or email already in use" }, { status: 409 });
    }

    const supabase = await createSupabaseServerClient();
    const origin = new URL(request.url).origin;
    const { data, error } = await supabase.auth.signUp({
      email,
      password: parsed.data.password,
      options: {
        data: { username },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (!data.user) {
      return NextResponse.json({ error: "Unable to register" }, { status: 500 });
    }

    const user = await ensurePanelUser({
      ...data.user,
      email: data.user.email || email,
      user_metadata: { ...data.user.user_metadata, username },
    });

    if (!data.session) {
      return NextResponse.json({
        needsConfirmation: true,
        message: "Check your email to confirm the account, then sign in.",
      });
    }

    return NextResponse.json({
      user: {
        id: user?.id,
        username: user?.username,
        email: user?.email,
        role: user?.role,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to register" }, { status: 500 });
  }
}
