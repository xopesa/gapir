import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TeacherShell } from "@/src/features/quiz/components/teacher-shell";
import { getDictionary } from "@/src/i18n/config";
import { requireUser } from "@/src/server/auth/authorization";
import { GUEST_EMAIL_DOMAIN } from "@/src/server/services/auth-service";
import { toAppUser } from "@/src/server/presenters";
import { isTeacherSite, teacherOrigin } from "@/src/server/site";

export const metadata: Metadata = { title: "Teacher" };

// The teacher's office exists only on the teacher's address; the learners' site sends visitors there.
export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  if (!(await isTeacherSite())) redirect(`${teacherOrigin()}/teacher`);
  // No registration: the first visit creates a guest session (/start) and comes back here.
  const user = toAppUser(await requireUser("/teacher"));
  return <TeacherShell user={user} dictionary={getDictionary(user.locale)} guest={user.email.endsWith(`@${GUEST_EMAIL_DOMAIN}`)}>{children}</TeacherShell>;
}
