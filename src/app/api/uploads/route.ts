import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { uploadToStorage } from "@/lib/supabase/storage";

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a file" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "File must be under 8MB" }, { status: 400 });
  }

  const url = await uploadToStorage({
    userId: user.id,
    filename: file.name,
    body: Buffer.from(await file.arrayBuffer()),
    contentType: file.type || "application/octet-stream",
  });

  if (form.get("kind") === "avatar") {
    await prisma.user.update({ where: { id: user.id }, data: { avatarUrl: url } });
  }

  return NextResponse.json({ url });
}
