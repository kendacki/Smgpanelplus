import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE = "smg_session";

function getSecret() {
  const value =
    process.env.AUTH_SECRET || "smg-panel-dev-secret-change-in-production-min-32-chars";
  return new TextEncoder().encode(value);
}

export type SessionUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  currency: string;
};

export async function signSession(user: SessionUser, remember = false) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(remember ? "30d" : "2d")
    .sign(getSecret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 2,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function readSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      id: String(payload.id),
      username: String(payload.username),
      email: String(payload.email),
      role: String(payload.role),
      currency: String(payload.currency ?? "NGN"),
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const session = await readSession();
  if (!session) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });
  if (!user || user.status !== "active") return null;
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}
