import { getApiUser } from "@/src/server/auth/authorization";
import { jsonError } from "@/src/server/http";
import { getOfflinePack } from "@/src/server/services/offline-service";

// The learner's course with answers, for playing lessons without a network.
export async function GET() {
  const user = await getApiUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    const pack = await getOfflinePack(user.id, user.locale);
    if (!pack) return Response.json({ error: "COURSE_NOT_FOUND" }, { status: 404 });
    return Response.json(pack, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return jsonError(error); }
}
