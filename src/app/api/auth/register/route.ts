import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { signSession } from "@/lib/auth";
import { generateApiKey } from "@/lib/utils";

export async function POST(request: Request) {
  try {
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
      return NextResponse.json(
        { error: "Username or email already in use" },
        { status: 409 },
      );
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: await bcrypt.hash(parsed.data.password, 12),
        apiKey: generateApiKey(),
      },
    });

    await signSession({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      currency: user.currency,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to register" }, { status: 500 });
  }
}
