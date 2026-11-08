import { getCurrentUser } from "@/src/server/auth/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  return Response.json({ user });
}
