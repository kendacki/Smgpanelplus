import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { profileSchema } from "@/lib/validations";
import { generateApiKey } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (body.rotateApiKey) {
    const apiKey = generateApiKey();
    await prisma.user.update({ where: { id: user.id }, data: { apiKey } });
    return NextResponse.json({ apiKey });
  }

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid profile" },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  if (parsed.data.newPassword) {
    if (!parsed.data.currentPassword) {
      return NextResponse.json({ error: "Current password is required" }, { status: 400 });
    }
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: parsed.data.currentPassword,
    });
    if (verifyError) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }
    if (parsed.data.newPassword.length < 8) {
      return NextResponse.json({ error: "New password is too short" }, { status: 400 });
    }
    const { error } = await supabase.auth.updateUser({ password: parsed.data.newPassword });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  const email = parsed.data.email.toLowerCase();
  if (email !== user.email) {
    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      email,
      currency: "USDT",
    },
  });

  return NextResponse.json({
    user: {
      id: updated.id,
      username: updated.username,
      email: updated.email,
      currency: "USDT",
    },
  });
}
