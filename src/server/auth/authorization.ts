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

const teacherRoles: UserRole[] = ["TEACHER", "ADMIN", "OWNER"];

/** Who may write quizzes and host games: teachers, and the admins who appoint them. */
export function canTeach(role: UserRole | string) {
  return teacherRoles.includes(role as UserRole);
}

/** Teacher API: only on the teacher's address and only for teachers. Throws UNAUTHORIZED / FORBIDDEN. */
export async function requireTeacherApi() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  if (!canTeach(user.role) || !(await isTeacherSite())) throw new Error("FORBIDDEN");
  return user;
}

export async function getApiUser() {
  return getCurrentUser();
}
