import type { UserRole } from "@/generated/prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./session";

const adminRoles: UserRole[] = ["CONTENT_EDITOR", "ADMIN", "OWNER"];

export function canAccessAdmin(role: UserRole | string) {
  return adminRoles.includes(role as UserRole);
}

// Learners start without an account (guest session via /start); staff sign in.
export async function requireUser(returnTo = "/", entry: "/start" | "/login" = "/start") {
  const user = await getCurrentUser();
  if (!user) redirect(`${entry}?returnTo=${encodeURIComponent(returnTo)}`);
  return user;
}

export async function requireAdmin(returnTo = "/admin") {
  const user = await requireUser(returnTo, "/login");
  if (!canAccessAdmin(user.role)) redirect("/");
  return user;
}

export async function getApiUser() {
  return getCurrentUser();
}
