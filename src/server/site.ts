import { headers } from "next/headers";

// Gapir answers on two addresses. Learners use the main one; the teacher's
// office (quizzes, hosting a game) lives on its own address and nowhere else.
// In production both come from wrangler.jsonc; locally the teacher site is
// http://teacher.localhost:3000 (browsers resolve *.localhost to this computer).
const DEV_TEACHER_ORIGIN = "http://teacher.localhost:3000";
const DEV_LEARNER_ORIGIN = "http://localhost:3000";

export function teacherOrigin() {
  return (process.env.TEACHER_ORIGIN || DEV_TEACHER_ORIGIN).replace(/\/$/, "");
}

export function learnerOrigin() {
  return (process.env.LEARNER_ORIGIN || DEV_LEARNER_ORIGIN).replace(/\/$/, "");
}

/** Compares host names only, so a different local port still works. */
export function isTeacherHost(host: string | null | undefined, origin = teacherOrigin()) {
  if (!host) return false;
  const name = host.split(",")[0].trim().toLowerCase().replace(/:\d+$/, "");
  return name === new URL(origin).hostname.toLowerCase();
}

/** Set by the teacher Worker (workers/teacher). The hosting layer rewrites the standard host headers, so it has its own name. */
export const SITE_HOST_HEADER = "x-gapir-host";

export async function isTeacherSite() {
  const list = await headers();
  // The address only chooses which site is shown; access is decided by the account's role.
  return [SITE_HOST_HEADER, "x-forwarded-host", "host"].some((name) => isTeacherHost(list.get(name)));
}
