import { getApiUser } from "@/src/server/auth/authorization";
import { jsonError, readJson } from "@/src/server/http";
import { joinGame } from "@/src/server/services/quiz-game-service";

export async function POST(request: Request) {
  const user = await getApiUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try { return Response.json({ game: await joinGame(user.id, await readJson(request)) }); }
  catch (error) { return jsonError(error); }
}
