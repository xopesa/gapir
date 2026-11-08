import { getApiUser } from "@/src/server/auth/authorization";
import { jsonError, readJson } from "@/src/server/http";
import { updateOnboarding, updateUserPreferences } from "@/src/server/services/user-service";

export async function PATCH(request: Request) {
  const user = await getApiUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    const body = await readJson(request);
    if (body && typeof body === "object" && "sourceLanguage" in body) return Response.json({ preference: await updateOnboarding(user.id, body) });
    return Response.json({ ok: true, ...(await updateUserPreferences(user.id, body)) });
  } catch (error) { return jsonError(error); }
}
