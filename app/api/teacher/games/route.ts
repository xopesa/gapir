import { z } from "zod";
import { requireTeacherApi } from "@/src/server/auth/authorization";
import { jsonError, readJson } from "@/src/server/http";
import { createClassGame, createGame, createReadyGame } from "@/src/server/services/quiz-game-service";

// A game of the teacher's own quiz ({ quizId }) or of a unit's ready quiz ({ moduleId }).
// …or of a hand-written class quiz ({ classQuizId }).
const schema = z.union([z.object({ quizId: z.string().min(1) }), z.object({ moduleId: z.string().min(1) }), z.object({ classQuizId: z.string().min(1) })]);

export async function POST(request: Request) {
  try {
    const user = await requireTeacherApi();
    const input = schema.parse(await readJson(request));
    const game = "quizId" in input ? await createGame(user.id, input.quizId)
      : "moduleId" in input ? await createReadyGame(user.id, input.moduleId)
      : await createClassGame(user.id, input.classQuizId);
    return Response.json({ game }, { status: 201 });
  } catch (error) { return jsonError(error); }
}
