import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/src/server/db";

export const SESSION_COOKIE = "gapir_session";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function sessionExpiry() {
  const ttl = Number(process.env.SESSION_TTL_DAYS ?? 30);
  return new Date(Date.now() + Math.max(1, ttl) * 86_400_000);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = sessionExpiry();
  await prisma.session.create({
    data: { userId, tokenHash: hashToken(token), expiresAt },
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  const preference = await prisma.userPreference.findUnique({ where: { userId }, select: { theme: true } });
  const theme = preference?.theme === "light" || preference?.theme === "dark" ? preference.theme : "system";
  cookieStore.set("gapir_theme", theme, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 31_536_000,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      id: true,
      expiresAt: true,
      user: {
        select: {
          id: true, name: true, email: true, role: true, locale: true, xp: true, streak: true,
          longestStreak: true, lastActivityDate: true, createdAt: true, updatedAt: true, preference: true,
        },
      },
    },
  });
  if (!session || session.expiresAt <= new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }
  return session.user;
}

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
