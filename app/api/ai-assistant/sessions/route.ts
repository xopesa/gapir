import { getApiUser } from "@/src/server/auth/authorization";
import { createConversationEngine } from "@/src/server/ai/assistant/service";
import { aiRequestId, aiRouteErrorResponse, aiUnauthorizedResponse } from "@/src/server/ai/http/route-helpers";
import { createAiSessionSchema } from "@/src/server/ai/schemas/requests";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const requestId = aiRequestId(request);
  const user = await getApiUser();
  if (!user) return aiUnauthorizedResponse(requestId);
  try {
    const body = createAiSessionSchema.parse(await request.json());
    const session = await createConversationEngine().createSession(user.id, body);
    return Response.json({ session, requestId }, { status: 201 });
  } catch (error) {
    return aiRouteErrorResponse(error, requestId);
  }
}
