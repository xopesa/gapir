import { z } from "zod";
import { getApiUser } from "@/src/server/auth/authorization";
import { prisma } from "@/src/server/db";
import { jsonError, readJson } from "@/src/server/http";

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const owner = await getApiUser();
  if (!owner) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (owner.role !== "OWNER") return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  const { userId } = await params;
  if (userId === owner.id) return Response.json({ error: "CANNOT_CHANGE_SELF" }, { status: 400 });
  try {
    const { role } = z.object({ role: z.enum(["USER", "CONTENT_EDITOR", "ADMIN", "OWNER"]) }).parse(await readJson(request));
    const user = await prisma.user.update({ where: { id: userId }, data: { role }, select: { id: true, role: true } });
    return Response.json({ user });
  } catch (error) { return jsonError(error); }
}
