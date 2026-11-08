import { notFound } from "next/navigation";
import { LessonEditor } from "@/src/features/admin/components/lesson-editor";
import { getAdminLesson } from "@/src/server/services/admin-course-service";

export default async function AdminLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const lesson = await getAdminLesson((await params).lessonId); if (!lesson) notFound();
  return <div className="admin-page"><LessonEditor lesson={lesson} /></div>;
}
