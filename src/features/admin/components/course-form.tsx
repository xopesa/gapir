"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { Button, Card } from "@/src/components/ui";
import { locales } from "@/src/i18n/config";
import { createCourseSchema } from "@/src/server/validation/schemas";

type FormValues = { sourceLanguage: "ru"|"en"|"zh"|"uz"; targetLanguage: "uz"|"zh"|"ru"; level: string; slug: string; status: "DRAFT"|"PUBLISHED"; order: number; isPremium: boolean; coverImageUrl?: string; translations: Array<{ locale: "uz"|"ru"|"zh"|"en"; title: string; description: string }> };

export function CourseForm() {
  const router = useRouter();
  const form = useForm<FormValues>({ resolver: zodResolver(createCourseSchema) as Resolver<FormValues>, defaultValues: { sourceLanguage: "ru", targetLanguage: "uz", level: "A1", slug: "", status: "DRAFT", order: 0, isPremium: false, coverImageUrl: "", translations: locales.map((locale) => ({ locale, title: "", description: "" })) } });
  const submit = async (values: FormValues) => { const response = await fetch("/api/admin/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) }); const payload = await response.json() as { error?: string; course?: { id: string } }; if (!response.ok || !payload.course) { form.setError("root", { message: payload.error ?? "Ошибка" }); return; } router.push(`/admin/courses/${payload.course.id}`); router.refresh(); };
  return <Card className="admin-form-card"><form className="admin-form" onSubmit={form.handleSubmit(submit)}><div className="admin-form-grid"><label>Язык объяснения<select {...form.register("sourceLanguage")}><option value="ru">Русский</option><option value="en">English</option><option value="zh">中文</option><option value="uz">Özbekça</option></select></label><label>Изучаемый язык<select {...form.register("targetLanguage")}><option value="uz">Özbekça</option><option value="zh">中文</option><option value="ru">Русский</option></select></label><label>Уровень<input {...form.register("level")} /></label><label>Slug<input {...form.register("slug")} placeholder="uzbek-a1" /></label><label>Статус<select {...form.register("status")}><option value="DRAFT">DRAFT</option><option value="PUBLISHED">PUBLISHED</option></select></label><label>Порядок<input type="number" {...form.register("order", { valueAsNumber: true })} /></label><label className="admin-check"><input type="checkbox" {...form.register("isPremium")} /> Premium</label><label className="wide">URL обложки<input {...form.register("coverImageUrl")} /></label></div><div className="translation-editor">{locales.map((locale, index) => <fieldset key={locale}><legend>{locale.toUpperCase()}</legend><input type="hidden" {...form.register(`translations.${index}.locale`)} /><label>Название<input {...form.register(`translations.${index}.title`)} /></label><label>Описание<textarea rows={3} {...form.register(`translations.${index}.description`)} /></label></fieldset>)}</div>{form.formState.errors.root && <p className="login-error">{form.formState.errors.root.message}</p>}<Button type="submit" size="lg" loading={form.formState.isSubmitting}>Создать курс</Button></form></Card>;
}
