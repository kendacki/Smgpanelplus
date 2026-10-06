import { prisma } from "./prisma";
import { createSupabaseServerClient, isSupabaseConfigured } from "./supabase/server";
import { generateApiKey } from "./utils";

export type SessionUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  currency: string;
};

function uniqueUsername(base: string) {
  const cleaned = base.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20) || "user";
  return `${cleaned}_${Math.random().toString(36).slice(2, 6)}`;
}

export async function ensurePanelUser(authUser: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}) {
  const email = (authUser.email || "").toLowerCase();
  if (!email) return null;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ supabaseId: authUser.id }, { email }] },
  });
  if (existing) {
    const data: { supabaseId?: string; email?: string; currency?: string; balance?: number } = {};
    if (existing.supabaseId !== authUser.id) {
      data.supabaseId = authUser.id;
      data.email = email;
    }
    if (existing.currency !== "USDT") {
      data.currency = "USDT";
      if (existing.currency === "NGN" || existing.currency === "GHS" || existing.currency === "KES") {
        data.balance = Number((existing.balance / 1550).toFixed(6));
      }
    }
    if (Object.keys(data).length > 0) {
      return prisma.user.update({ where: { id: existing.id }, data });
    }
    return existing;
  }

  const metadataName = String(authUser.user_metadata?.username || email.split("@")[0]);
  const taken = await prisma.user.findUnique({ where: { username: metadataName.toLowerCase() } });
  const username = taken ? uniqueUsername(metadataName) : metadataName.toLowerCase();
  const role = authUser.app_metadata?.role === "ADMIN" ? "ADMIN" : "USER";

  return prisma.user.create({
    data: {
      supabaseId: authUser.id,
      username,
      email,
      passwordHash: "supabase-auth",
      role,
      apiKey: generateApiKey(),
      currency: "USDT",
    },
  });
}

export async function readSession(): Promise<SessionUser | null> {
  const user = await requireUser();
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    currency: "USDT",
  };
}

export async function requireUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const user = await ensurePanelUser(authUser);
  if (!user || user.status !== "active") return null;
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

export async function clearSession() {
  if (!isSupabaseConfigured()) return;
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}
