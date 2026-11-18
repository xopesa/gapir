import { requireTeacherApi } from "@/src/server/auth/authorization";
import { jsonError, readJson } from "@/src/server/http";
import { createQuizFromLessons } from "@/src/server/services/quiz-service";

export async function POST(request: Request) {
  try { return Response.json({ quiz: await createQuizFromLessons((await requireTeacherApi()).id, await readJson(request)) }, { status: 201 }); }
  catch (error) { return jsonError(error); }
}
