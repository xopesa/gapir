import { z } from "zod";
import { getApiUser } from "@/src/server/auth/authorization";
import { prisma } from "@/src/server/db";
import { jsonError, readJson } from "@/src/server/http";

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const owner = await getApiUser();
  if (!owner) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  // The owner sets any role. An admin may only appoint and dismiss teachers.
  if (owner.role !== "OWNER" && owner.role !== "ADMIN") return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  const { userId } = await params;
  if (userId === owner.id) return Response.json({ error: "CANNOT_CHANGE_SELF" }, { status: 400 });
  try {
    const { role } = z.object({ role: z.enum(["USER", "TEACHER", "CONTENT_EDITOR", "ADMIN", "OWNER"]) }).parse(await readJson(request));
    if (owner.role === "ADMIN") {
      const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      if (!target) return Response.json({ error: "USER_NOT_FOUND" }, { status: 404 });
      const teacherOnly = (value: string) => value === "USER" || value === "TEACHER";
      if (!teacherOnly(role) || !teacherOnly(target.role)) return Response.json({ error: "FORBIDDEN" }, { status: 403 });
    }
    const user = await prisma.user.update({ where: { id: userId }, data: { role }, select: { id: true, role: true } });
    return Response.json({ user });
  } catch (error) { return jsonError(error); }
}
