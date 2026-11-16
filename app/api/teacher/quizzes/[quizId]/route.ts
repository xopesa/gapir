import { requireTeacherApi } from "@/src/server/auth/authorization";
import { jsonError, readJson } from "@/src/server/http";
import { deleteQuiz, getQuiz, updateQuiz } from "@/src/server/services/quiz-service";

type Context = { params: Promise<{ quizId: string }> };

export async function GET(_: Request, { params }: Context) {
  try { return Response.json({ quiz: await getQuiz((await requireTeacherApi()).id, (await params).quizId) }); }
  catch (error) { return jsonError(error); }
}

export async function PUT(request: Request, { params }: Context) {
  try { return Response.json({ quiz: await updateQuiz((await requireTeacherApi()).id, (await params).quizId, await readJson(request)) }); }
  catch (error) { return jsonError(error); }
}

export async function DELETE(_: Request, { params }: Context) {
  try { await deleteQuiz((await requireTeacherApi()).id, (await params).quizId); return Response.json({ ok: true }); }
  catch (error) { return jsonError(error); }
}
