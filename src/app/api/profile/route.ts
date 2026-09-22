import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireUser, signSession } from "@/lib/auth";
import { profileSchema } from "@/lib/validations";
import { generateApiKey } from "@/lib/utils";

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

  let passwordHash = user.passwordHash;
  if (parsed.data.newPassword) {
    if (!parsed.data.currentPassword) {
      return NextResponse.json({ error: "Current password is required" }, { status: 400 });
    }
    const ok = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }
    if (parsed.data.newPassword.length < 8) {
      return NextResponse.json({ error: "New password is too short" }, { status: 400 });
    }
    passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      email: parsed.data.email.toLowerCase(),
      currency: parsed.data.currency,
      passwordHash,
    },
  });

  await signSession({
    id: updated.id,
    username: updated.username,
    email: updated.email,
    role: updated.role,
    currency: updated.currency,
  });

  return NextResponse.json({
    user: {
      id: updated.id,
      username: updated.username,
      email: updated.email,
      currency: updated.currency,
    },
  });
}
