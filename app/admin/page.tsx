import { BookOpen, CheckCircle, FileText, GraduationCap, ListChecks, Users } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Card } from "@/src/components/ui";
import { getAdminStats } from "@/src/server/services/admin-course-service";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const cards = [
    { label: "Пользователи", value: stats.users, icon: Users }, { label: "Курсы", value: stats.courses, icon: GraduationCap },
    { label: "Опубликовано", value: stats.publishedCourses, icon: CheckCircle }, { label: "Черновики", value: stats.drafts, icon: FileText },
    { label: "Модули", value: stats.modules, icon: BookOpen }, { label: "Уроки", value: stats.lessons, icon: ListChecks },
    { label: "Упражнения", value: stats.exercises, icon: ListChecks },
  ];
  return <div className="admin-page"><div className="admin-page-header"><div><p className="eyebrow">Dashboard</p><h1>Контент и прогресс</h1><p>Все изменения сразу отражаются в пользовательском приложении.</p></div><Link href="/admin/courses/new" className="button button-primary">Создать курс</Link></div><div className="admin-stat-grid">{cards.map(({ label, value, icon: Icon }) => <Card key={label} className="admin-stat"><Icon weight="duotone" /><span>{label}</span><strong>{value}</strong></Card>)}</div><section><h2>Последние изменения</h2><Card className="admin-table-card"><div className="admin-table">{stats.recent.map((lesson) => <Link href={`/admin/lessons/${lesson.id}`} key={lesson.id}><strong>{lesson.translations[0]?.title ?? "Без названия"}</strong><span>{lesson.status}</span><time>{lesson.updatedAt.toLocaleString("ru-RU")}</time></Link>)}</div></Card></section></div>;
}
