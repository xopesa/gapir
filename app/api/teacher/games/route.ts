import { z } from "zod";
import { requireTeacherApi } from "@/src/server/auth/authorization";
import { jsonError, readJson } from "@/src/server/http";
import { createGame, createReadyGame } from "@/src/server/services/quiz-game-service";

// A game of the teacher's own quiz ({ quizId }) or of a unit's ready quiz ({ moduleId }).
const schema = z.union([z.object({ quizId: z.string().min(1) }), z.object({ moduleId: z.string().min(1) })]);

export async function POST(request: Request) {
  try {
    const user = await requireTeacherApi();
    const input = schema.parse(await readJson(request));
    const game = "quizId" in input ? await createGame(user.id, input.quizId) : await createReadyGame(user.id, input.moduleId);
    return Response.json({ game }, { status: 201 });
  } catch (error) { return jsonError(error); }
}
