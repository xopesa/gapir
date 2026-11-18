import { getApiUser } from "@/src/server/auth/authorization";
import { jsonError, readJson } from "@/src/server/http";
import { syncOfflineProgress } from "@/src/server/services/offline-service";

// Lessons finished offline: replayed through the normal progress flow.
export async function POST(request: Request) {
  const user = await getApiUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try { return Response.json(await syncOfflineProgress(user.id, await readJson(request), user.locale)); }
  catch (error) { return jsonError(error); }
}
