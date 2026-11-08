import { getApiUser } from "@/src/server/auth/authorization";
import { jsonError, readJson } from "@/src/server/http";
import { submitExerciseAnswer } from "@/src/server/services/progress-service";
import { answerSchema } from "@/src/server/validation/schemas";

export async function POST(request: Request, { params }: { params: Promise<{ exerciseId: string }> }) {
  const user = await getApiUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    const { answer } = answerSchema.parse(await readJson(request));
    return Response.json(await submitExerciseAnswer(user.id, (await params).exerciseId, answer, user.locale));
  } catch (error) { return jsonError(error); }
}
