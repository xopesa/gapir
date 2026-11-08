import { z } from "zod";
import { canAccessAdmin, getApiUser } from "@/src/server/auth/authorization";
import { jsonError, readJson } from "@/src/server/http";
import { setLessonStatus } from "@/src/server/services/admin-course-service";

export async function PATCH(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const user = await getApiUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (!canAccessAdmin(user.role)) return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  try {
    const { status } = z.object({ status: z.enum(["DRAFT", "PUBLISHED"]) }).parse(await readJson(request));
    return Response.json({ lesson: await setLessonStatus((await params).lessonId, status) });
  } catch (error) { return jsonError(error); }
}
