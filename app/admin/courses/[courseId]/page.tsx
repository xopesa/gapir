import { notFound } from "next/navigation";
import { CourseBuilder } from "@/src/features/admin/components/course-builder";
import { getAdminCourse } from "@/src/server/services/admin-course-service";

export default async function AdminCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const course = await getAdminCourse((await params).courseId); if (!course) notFound();
  return <div className="admin-page"><CourseBuilder course={course} /></div>;
}
