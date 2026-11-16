import { Suspense } from "react";
import { LoginPageClient } from "@/src/features/auth/components/auth-pages";

export default function LoginPage() {
  return <Suspense><LoginPageClient /></Suspense>;
}
