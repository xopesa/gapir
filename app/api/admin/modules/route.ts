import { canAccessAdmin, getApiUser } from "@/src/server/auth/authorization";
import { jsonError, readJson } from "@/src/server/http";
import { createModule } from "@/src/server/services/admin-course-service";

export async function POST(request: Request) {
  const user = await getApiUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (!canAccessAdmin(user.role)) return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  try { return Response.json({ module: await createModule(await readJson(request)) }, { status: 201 }); }
  catch (error) { return jsonError(error); }
}
