import { randomBytes } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import { createSession } from "@/src/server/auth/session";
import { hashPassword, verifyPassword } from "@/src/server/auth/password";
import { prisma } from "@/src/server/db";
import { guestSchema, loginSchema, registerSchema } from "@/src/server/validation/schemas";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function registerUser(input: unknown) {
  const data = registerSchema.parse(input);
  const email = normalizeEmail(data.email);
  const passwordHash = await hashPassword(data.password);
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email,
        passwordHash,
        locale: data.locale,
        preference: { create: { sourceLanguage: "ru", targetLanguage: "uz" } },
      },
      select: { id: true, name: true, email: true, role: true, locale: true },
    });
    await createSession(user.id);
    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("EMAIL_EXISTS");
    }
    throw error;
  }
}

export async function loginUser(input: unknown) {
  const data = loginSchema.parse(input);
  const user = await prisma.user.findUnique({ where: { email: normalizeEmail(data.email) } });
  if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
    throw new Error("INVALID_CREDENTIALS");
  }
  if (data.locale && data.locale !== user.locale) {
    await prisma.user.update({ where: { id: user.id }, data: { locale: data.locale } });
  }
  await createSession(user.id);
  return { id: user.id, name: user.name, email: user.email, role: user.role, locale: data.locale ?? user.locale };
}

const GUEST_NAMES: Record<string, string> = { zh: "访客", ru: "Гость", uz: "Mehmon", en: "Guest" };
export const GUEST_EMAIL_DOMAIN = "guest.gapir.app";

/**
 * "Start without an account". The guest gets a normal user row and session but
 * no usable password: the stored value is not a bcrypt hash, so password login
 * can never match it. No bcrypt work either, which keeps this cheap on Workers.
 */
export async function createGuestUser(input: unknown) {
  const { locale } = guestSchema.parse(input ?? {});
  const id = randomBytes(9).toString("base64url").toLowerCase().replace(/[^a-z0-9]/g, "");
  const user = await prisma.user.create({
    data: {
      name: GUEST_NAMES[locale] ?? GUEST_NAMES.en,
      email: `guest-${id}-${Date.now().toString(36)}@${GUEST_EMAIL_DOMAIN}`,
      passwordHash: `guest:${randomBytes(16).toString("hex")}`,
      locale,
      // Chinese speakers are the main audience: zh → uz until onboarding says otherwise.
      preference: { create: { sourceLanguage: locale === "zh" ? "zh" : locale === "uz" ? "uz" : "ru", targetLanguage: locale === "uz" ? "zh" : "uz" } },
    },
    select: { id: true, name: true, email: true, role: true, locale: true },
  });
  await createSession(user.id);
  return user;
}
