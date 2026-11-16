import { requireTeacherApi } from "@/src/server/auth/authorization";
import { jsonError, readJson } from "@/src/server/http";
import { getHostState, hostAction } from "@/src/server/services/quiz-game-service";

type Context = { params: Promise<{ gameId: string }> };
const noStore = { "Cache-Control": "no-store" };

export async function GET(_: Request, { params }: Context) {
  try { return Response.json({ game: await getHostState((await requireTeacherApi()).id, (await params).gameId) }, { headers: noStore }); }
  catch (error) { return jsonError(error); }
}

/** start | reveal | next | end; answers with the new state so the screen updates at once. */
export async function POST(request: Request, { params }: Context) {
  try {
    const user = await requireTeacherApi();
    const { gameId } = await params;
    await hostAction(user.id, gameId, await readJson(request));
    return Response.json({ game: await getHostState(user.id, gameId) }, { headers: noStore });
  } catch (error) { return jsonError(error); }
}
