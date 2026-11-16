import { Suspense } from "react";
import { LoginPageClient } from "@/src/features/auth/components/auth-pages";
import { isTeacherSite } from "@/src/server/site";

export default async function LoginPage() {
  return <Suspense><LoginPageClient teacher={await isTeacherSite()} /></Suspense>;
}
