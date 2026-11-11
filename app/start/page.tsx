import { redirect } from "next/navigation";
import { Suspense } from "react";
import { StartPageClient } from "@/src/features/auth/components/auth-pages";
import { getCurrentUser } from "@/src/server/auth/session";

// Entry point of the phone app: no login form, a guest session is created at once.
export default async function StartPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  if (await getCurrentUser()) {
    const returnTo = (await searchParams).returnTo;
    redirect(returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/");
  }
  return <Suspense><StartPageClient /></Suspense>;
}
