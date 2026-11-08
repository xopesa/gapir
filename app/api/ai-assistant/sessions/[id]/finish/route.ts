import { getApiUser } from "@/src/server/auth/authorization";
import { createConversationEngine } from "@/src/server/ai/assistant/service";
import { aiRequestId, aiRouteErrorResponse, aiUnauthorizedResponse } from "@/src/server/ai/http/route-helpers";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = aiRequestId(request);
  const user = await getApiUser();
  if (!user) return aiUnauthorizedResponse(requestId);
  try {
    const session = await createConversationEngine().finishSession(user.id, (await params).id);
    return Response.json({ session, requestId });
  } catch (error) {
    return aiRouteErrorResponse(error, requestId);
  }
}
