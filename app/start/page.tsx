import { redirect } from "next/navigation";
import { Suspense } from "react";
import { StartPageClient } from "@/src/features/auth/components/auth-pages";
import { getCurrentUser } from "@/src/server/auth/session";
import { isTeacherSite } from "@/src/server/site";

// Entry point of the phone app: no login form, a guest session is created at once.
export default async function StartPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  // No guests on the teacher's address: a teacher signs in with an account.
  if (await isTeacherSite()) redirect("/login?returnTo=%2Fteacher");
  if (await getCurrentUser()) {
    const returnTo = (await searchParams).returnTo;
    redirect(returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/");
  }
  return <Suspense><StartPageClient /></Suspense>;
}
