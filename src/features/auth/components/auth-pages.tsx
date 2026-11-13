"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, BookOpen, CheckCircle, Eye, EyeSlash, LockKey, User } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { LocaleSwitcher, usePublicLocale } from "@/src/components/i18n/locale-switcher";
import { Mascot } from "@/src/components/mascots/mascot";
import { ThemeSwitcher } from "@/src/components/theme/theme-switcher";
import { Button } from "@/src/components/ui";
import { getDictionary } from "@/src/i18n/config";
import { loginSchema, registerSchema } from "@/src/server/validation/schemas";

function AuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="login-shell">
      <section className="login-brand-panel" aria-label="Gapir">
        <div className="login-brand"><span className="login-logo"><Image src="/gapir-logo.png" alt="Gapir" width={96} height={96} priority unoptimized className="brand-logo-image" /></span><strong>Gapir</strong></div>
        <div className="login-promise"><span className="login-kicker"><BookOpen weight="fill" /> Gapir</span><h1>Til — yangi imkoniyatlar eşigi.</h1><p>Короткие уроки, реальный прогресс и четыре языка интерфейса.</p></div>
        <div className="login-proof"><span><CheckCircle weight="fill" /> 5 минут в день</span><span><CheckCircle weight="fill" /> Прогресс в аккаунте</span></div>
      </section>
      <section className="login-form-panel">{children}</section>
    </main>
  );
}

function safeReturnTo(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : null;
}

/** "Start without an account": creates a guest session at once, then onboarding. */
export function StartPageClient() {
  const router = useRouter();
  const search = useSearchParams();
  const { locale } = usePublicLocale("zh");
  const dictionary = getDictionary(locale);
  const [failed, setFailed] = useState(false);
  const started = useRef(false);
  const start = useCallback(async () => {
    setFailed(false);
    const response = await fetch("/api/auth/guest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale }) }).catch(() => null);
    if (!response?.ok) {
      // No network on the very first launch: the app's offline screen explains what to do.
      if (!response && typeof navigator !== "undefined" && !navigator.onLine) { window.location.replace("/offline"); return; }
      setFailed(true); return;
    }
    const returnTo = safeReturnTo(search.get("returnTo"));
    router.replace(returnTo && returnTo !== "/" ? returnTo : "/onboarding");
    router.refresh();
  }, [locale, router, search]);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void start();
  }, [start]);
  return <main className="guest-start">
    <Mascot kind="panda" mood={failed ? "sad" : "happy"} size={132} />
    <h1>Gapir</h1>
    <p>{failed ? dictionary.common.error : dictionary.offline.starting}</p>
    {failed && <Button type="button" size="lg" onClick={() => void start()}>{dictionary.offline.retry}</Button>}
    <p className="guest-start-hint">{dictionary.offline.startHint}</p>
    <Link href="/login">{dictionary.offline.haveAccount}</Link>
  </main>;
}

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPageClient() {
  const router = useRouter();
  const search = useSearchParams();
  const { locale, setLocale } = usePublicLocale();
  const dictionary = getDictionary(locale);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "", locale } });
  const onSubmit = async (values: LoginValues) => {
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, locale }) });
    if (!response.ok) { form.setError("root", { message: dictionary.auth.invalid }); return; }
    const returnTo = search.get("returnTo");
    router.replace(returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/");
    router.refresh();
  };
  return <AuthFrame><div className="login-form-wrap">
    <div className="auth-toolbar"><ThemeSwitcher label={dictionary.settings.theme} locale={locale} /><LocaleSwitcher locale={locale} onChange={setLocale} /></div>
    <div className="login-heading"><p className="eyebrow">Gapir Account</p><h2>{dictionary.auth.loginTitle}</h2><p>{dictionary.auth.loginSubtitle}</p></div>
    <form className="login-form" onSubmit={form.handleSubmit(onSubmit)}>
      <label htmlFor="email">{dictionary.auth.email}</label><div className="login-input"><User weight="bold" /><input id="email" type="email" autoComplete="email" placeholder="name@example.com" {...form.register("email")} /></div>{form.formState.errors.email && <p className="field-error">{form.formState.errors.email.message}</p>}
      <label htmlFor="password">{dictionary.auth.password}</label><div className="login-input"><LockKey weight="bold" /><input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" {...form.register("password")} /><button type="button" className="password-toggle" aria-label="Toggle password" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeSlash /> : <Eye />}</button></div>
      {form.formState.errors.root && <p className="login-error" role="alert">{form.formState.errors.root.message}</p>}
      <div className="auth-form-links"><Link href="/forgot-password">{dictionary.auth.forgot}</Link></div>
      <Button type="submit" size="lg" loading={form.formState.isSubmitting}>{dictionary.auth.login} <ArrowRight weight="bold" /></Button>
    </form>
    <p className="auth-switch">{dictionary.auth.noAccount} <Link href="/register">{dictionary.auth.register}</Link></p>
    <Link className="guest-start-link" href={`/start${search.get("returnTo") ? `?returnTo=${encodeURIComponent(search.get("returnTo") ?? "/")}` : ""}`}>{dictionary.offline.start} <ArrowRight weight="bold" /></Link>
  </div></AuthFrame>;
}

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterPageClient() {
  const router = useRouter();
  const { locale, setLocale } = usePublicLocale();
  const dictionary = getDictionary(locale);
  const form = useForm<RegisterValues>({ resolver: zodResolver(registerSchema), defaultValues: { name: "", email: "", password: "", confirmPassword: "", locale, acceptedTerms: false as true } });
  const onSubmit = async (values: RegisterValues) => {
    const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, locale }) });
    const payload = await response.json() as { error?: string };
    if (!response.ok) { form.setError("root", { message: payload.error === "EMAIL_EXISTS" ? "Email уже зарегистрирован" : dictionary.common.error }); return; }
    router.replace("/onboarding"); router.refresh();
  };
  return <AuthFrame><div className="login-form-wrap register-wrap">
    <div className="auth-toolbar"><ThemeSwitcher label={dictionary.settings.theme} locale={locale} /><LocaleSwitcher locale={locale} onChange={setLocale} /></div>
    <div className="login-heading"><p className="eyebrow">Gapir Account</p><h2>{dictionary.auth.registerTitle}</h2><p>{dictionary.auth.registerSubtitle}</p></div>
    <form className="login-form" onSubmit={form.handleSubmit(onSubmit)}>
      <label>{dictionary.auth.name}</label><div className="login-input"><User weight="bold" /><input autoComplete="name" {...form.register("name")} /></div>
      <label>{dictionary.auth.email}</label><div className="login-input"><User weight="bold" /><input type="email" autoComplete="email" {...form.register("email")} /></div>
      <div className="auth-field-grid"><div><label>{dictionary.auth.password}</label><div className="login-input"><LockKey weight="bold" /><input type="password" autoComplete="new-password" {...form.register("password")} /></div></div><div><label>{dictionary.auth.confirmPassword}</label><div className="login-input"><LockKey weight="bold" /><input type="password" autoComplete="new-password" {...form.register("confirmPassword")} /></div></div></div>
      {(form.formState.errors.password || form.formState.errors.confirmPassword) && <p className="field-error">{form.formState.errors.password?.message ?? form.formState.errors.confirmPassword?.message}</p>}
      <label className="terms-check"><input type="checkbox" {...form.register("acceptedTerms")} /><span>{dictionary.auth.terms}</span></label>
      {form.formState.errors.root && <p className="login-error" role="alert">{form.formState.errors.root.message}</p>}
      <Button type="submit" size="lg" loading={form.formState.isSubmitting}>{dictionary.auth.register} <ArrowRight weight="bold" /></Button>
    </form>
    <p className="auth-switch">{dictionary.auth.hasAccount} <Link href="/login">{dictionary.auth.login}</Link></p>
  </div></AuthFrame>;
}
