import { Prisma } from "@/generated/prisma/client";
import { createSession } from "@/src/server/auth/session";
import { hashPassword, verifyPassword } from "@/src/server/auth/password";
import { prisma } from "@/src/server/db";
import { loginSchema, registerSchema } from "@/src/server/validation/schemas";

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
