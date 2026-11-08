import { getApiUser } from "@/src/server/auth/authorization";
import { createConversationEngine } from "@/src/server/ai/assistant/service";
import { aiRequestId, aiRouteErrorResponse, aiUnauthorizedResponse } from "@/src/server/ai/http/route-helpers";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestId = aiRequestId(request);
  const user = await getApiUser();
  if (!user) return aiUnauthorizedResponse(requestId);
  try {
    return Response.json({ sessions: await createConversationEngine().listHistory(user.id), requestId });
  } catch (error) {
    return aiRouteErrorResponse(error, requestId);
  }
}
