import { getApiUser } from "@/src/server/auth/authorization";
import { jsonError } from "@/src/server/http";
import { getPlayerState } from "@/src/server/services/quiz-game-service";

export async function GET(_: Request, { params }: { params: Promise<{ pin: string }> }) {
  const user = await getApiUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try { return Response.json({ game: await getPlayerState(user.id, (await params).pin) }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return jsonError(error); }
}
