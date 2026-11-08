import { getApiUser } from "@/src/server/auth/authorization";
import { jsonError } from "@/src/server/http";
import { startLesson } from "@/src/server/services/progress-service";

export async function POST(_: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const user = await getApiUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try { return Response.json({ progress: await startLesson(user.id, (await params).lessonId) }); }
  catch (error) { return jsonError(error); }
}
