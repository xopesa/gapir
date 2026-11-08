import { canAccessAdmin, getApiUser } from "@/src/server/auth/authorization";
import { jsonError, readJson } from "@/src/server/http";
import { updateLesson } from "@/src/server/services/admin-course-service";

export async function PATCH(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const user = await getApiUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (!canAccessAdmin(user.role)) return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  try { return Response.json({ lesson: await updateLesson((await params).lessonId, await readJson(request)) }); }
  catch (error) { return jsonError(error); }
}
