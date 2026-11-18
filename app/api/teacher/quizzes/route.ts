import { requireTeacherApi } from "@/src/server/auth/authorization";
import { jsonError, readJson } from "@/src/server/http";
import { createQuiz, listQuizzes } from "@/src/server/services/quiz-service";

export async function GET() {
  try { return Response.json({ quizzes: await listQuizzes((await requireTeacherApi()).id) }); }
  catch (error) { return jsonError(error); }
}

export async function POST(request: Request) {
  try { return Response.json({ quiz: await createQuiz((await requireTeacherApi()).id, await readJson(request)) }, { status: 201 }); }
  catch (error) { return jsonError(error); }
}
