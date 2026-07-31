"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Eye,
  EyeSlash,
  LockKey,
  User,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppShell } from "@/src/components/layout/app-shell";
import { Button } from "@/src/components/ui";
import { useAuthStore } from "@/src/stores/auth-store";

const loginSchema = z.object({
  username: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

type LoginValues = z.infer<typeof loginSchema>;

const subscribeToClient = () => () => undefined;

export function AuthGate({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );
  const [showPassword, setShowPassword] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  if (!mounted) {
    return (
      <div className="auth-loading" aria-label="Загрузка Gapir">
        <span className="auth-loading-mark">
          <Image
            src="/gapir-logo.png"
            alt=""
            width={72}
            height={72}
            unoptimized
            className="brand-logo-image"
          />
        </span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AppShell>{children}</AppShell>;
  }

  const onSubmit = (values: LoginValues) => {
    if (!login(values.username, values.password)) {
      setError("root", {
        message: "Неверный логин или пароль. Используйте тестовые данные ниже.",
      });
    }
  };

  return (
    <main className="login-shell">
      <section className="login-brand-panel" aria-label="О приложении Gapir">
        <div className="login-brand">
          <span className="login-logo">
            <Image
              src="/gapir-logo.png"
              alt="Gapir"
              width={96}
              height={96}
              priority
              unoptimized
              className="brand-logo-image"
            />
          </span>
          <strong>Gapir</strong>
        </div>
        <div className="login-promise">
          <span className="login-kicker">
            <BookOpen weight="fill" /> Узбекский каждый день
          </span>
          <h1>Говорите увереннее с первого урока.</h1>
          <p>
            Короткие занятия, живая речь и понятный прогресс — без перегруженных
            учебников.
          </p>
        </div>
        <div className="login-proof">
          <span><CheckCircle weight="fill" /> 5 минут в день</span>
          <span><CheckCircle weight="fill" /> Прогресс на устройстве</span>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrap">
          <div className="login-heading">
            <p className="eyebrow">Тестовый доступ</p>
            <h2>Войдите в Gapir</h2>
            <p>Используйте демонстрационный аккаунт для знакомства.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="username">Логин</label>
            <div className="login-input">
              <User weight="bold" aria-hidden="true" />
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Введите логин"
                aria-invalid={Boolean(errors.username)}
                {...register("username")}
              />
            </div>
            {errors.username && <p className="field-error">{errors.username.message}</p>}

            <label htmlFor="password">Пароль</label>
            <div className="login-input">
              <LockKey weight="bold" aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Введите пароль"
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeSlash weight="bold" /> : <Eye weight="bold" />}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password.message}</p>}
            {errors.root && <p className="login-error" role="alert">{errors.root.message}</p>}

            <Button type="submit" size="lg" loading={isSubmitting}>
              Войти <ArrowRight weight="bold" />
            </Button>
          </form>

          <div className="test-credentials">
            <span>Данные тестового аккаунта</span>
            <div><strong>Логин</strong><code>Test</code></div>
            <div><strong>Пароль</strong><code>2804meili</code></div>
          </div>

          <p className="login-note">
            Это демонстрационный вход. Данные сохраняются только в вашем браузере.
          </p>
        </div>
      </section>
    </main>
  );
}
