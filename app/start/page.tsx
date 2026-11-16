import { redirect } from "next/navigation";
import { Suspense } from "react";
import { StartPageClient } from "@/src/features/auth/components/auth-pages";
import { getCurrentUser } from "@/src/server/auth/session";
import { isTeacherSite } from "@/src/server/site";

// Entry point of the phone app: no login form, a guest session is created at once.
export default async function StartPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const teacher = await isTeacherSite();
  if (await getCurrentUser()) {
    const returnTo = (await searchParams).returnTo;
    redirect(returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/");
  }
  // On the teacher's address the guest is a teacher: Russian by default, straight to the office.
  return <Suspense><StartPageClient teacher={teacher} /></Suspense>;
}
