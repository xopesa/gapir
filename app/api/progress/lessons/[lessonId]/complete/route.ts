import { getApiUser } from "@/src/server/auth/authorization";
import { jsonError } from "@/src/server/http";
import { completeLesson } from "@/src/server/services/progress-service";

export async function POST(_: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const user = await getApiUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try { return Response.json(await completeLesson(user.id, (await params).lessonId)); }
  catch (error) { return jsonError(error); }
}
