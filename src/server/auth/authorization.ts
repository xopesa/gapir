import type { UserRole } from "@/generated/prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./session";

const adminRoles: UserRole[] = ["CONTENT_EDITOR", "ADMIN", "OWNER"];

export function canAccessAdmin(role: UserRole | string) {
  return adminRoles.includes(role as UserRole);
}

export async function requireUser(returnTo = "/") {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  return user;
}

export async function requireAdmin(returnTo = "/admin") {
  const user = await requireUser(returnTo);
  if (!canAccessAdmin(user.role)) redirect("/");
  return user;
}

export async function getApiUser() {
  return getCurrentUser();
}
