import { getApiUser } from "@/src/server/auth/authorization";
import { jsonError, readJson } from "@/src/server/http";
import { submitAnswer } from "@/src/server/services/quiz-game-service";

export async function POST(request: Request, { params }: { params: Promise<{ pin: string }> }) {
  const user = await getApiUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try { return Response.json(await submitAnswer(user.id, (await params).pin, await readJson(request))); }
  catch (error) { return jsonError(error); }
}
