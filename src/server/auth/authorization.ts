import type { UserRole } from "@/generated/prisma/client";
import { redirect } from "next/navigation";
import { isTeacherSite } from "@/src/server/site";
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

/**
 * Teacher API: works only on the teacher's address. No account or role is
 * needed there: like a learner, a teacher gets a guest session on the first
 * visit, and quizzes and rooms belong to that session.
 * Throws UNAUTHORIZED / FORBIDDEN.
 */
export async function requireTeacherApi() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  if (!(await isTeacherSite())) throw new Error("FORBIDDEN");
  return user;
}

export async function getApiUser() {
  return getCurrentUser();
}
