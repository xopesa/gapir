import Link from "next/link";
import { Badge, Card } from "@/src/components/ui";
import { listCourses } from "@/src/server/services/admin-course-service";

export default async function AdminCoursesPage() {
  const courses = await listCourses();
  return <div className="admin-page"><div className="admin-page-header"><div><p className="eyebrow">Content</p><h1>Курсы</h1><p>Направления, модули и опубликованные уроки.</p></div><Link href="/admin/courses/new" className="button button-primary">Создать курс</Link></div><div className="admin-course-grid">{courses.map((course) => <Link href={`/admin/courses/${course.id}`} key={course.id}><Card className="admin-course-card" interactive><div><Badge tone={course.status === "PUBLISHED" ? "mint" : "blue"}>{course.status}</Badge><span>{course.sourceLanguage.toUpperCase()} → {course.targetLanguage.toUpperCase()} · {course.level}</span></div><h2>{course.translations[0]?.title ?? course.slug}</h2><p>{course.slug}</p><strong>{course._count.modules} модулей</strong></Card></Link>)}</div></div>;
}
