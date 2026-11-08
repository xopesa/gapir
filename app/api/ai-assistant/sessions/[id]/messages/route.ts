import { randomUUID } from "node:crypto";
import { z } from "zod";
import { getApiUser } from "@/src/server/auth/authorization";
import { consumeRateLimit } from "@/src/server/auth/rate-limit";
import { createConversationEngine } from "@/src/server/ai/assistant/service";
import { getAiConfig } from "@/src/server/ai/config/ai-config";
import { AiError } from "@/src/server/ai/errors/ai-error";
import { aiRequestId, aiRouteErrorResponse, aiUnauthorizedResponse } from "@/src/server/ai/http/route-helpers";
import { textMessageSchema, tutorDirectionSchema, tutorLevelSchema, tutorTopicSchema } from "@/src/server/ai/schemas/requests";
import { validateAudio, withTemporaryAudioFile, withUserConcurrencyLimit } from "@/src/server/ai/speech/audio-security";

export const runtime = "nodejs";

const multipartMetadataSchema = z.object({
  clientMessageId: z.string().uuid(),
  text: z.string().trim().max(4000).optional(),
  direction: tutorDirectionSchema.optional(),
  level: tutorLevelSchema.optional(),
  topic: tutorTopicSchema.optional(),
  declaredDurationMs: z.number().positive().optional(),
}).strict();

function optionalFormString(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

async function processMultipart(request: Request, userId: string, sessionId: string, requestId: string) {
  const config = getAiConfig();
  const form = await request.formData();
  const audio = form.get("audio");
  const declaredDuration = optionalFormString(form, "durationMs");
  const metadata = multipartMetadataSchema.parse({
    clientMessageId: optionalFormString(form, "clientMessageId") ?? randomUUID(),
    text: optionalFormString(form, "text"),
    direction: optionalFormString(form, "direction"),
    level: optionalFormString(form, "level"),
    topic: optionalFormString(form, "topic"),
    declaredDurationMs: declaredDuration === undefined ? undefined : Number(declaredDuration),
  });
  if (!(audio instanceof File)) {
    if (!metadata.text) throw new AiError("AI_AUDIO_UNSUPPORTED", "Multipart request requires audio or text.", { retryable: false });
    return createConversationEngine().processMessage(userId, sessionId, requestId, metadata);
  }
  if (audio.size > config.limits.maxAudioBytes) throw new AiError("AI_AUDIO_TOO_LARGE", "Audio file is too large.", { retryable: false });
  const bytes = new Uint8Array(await audio.arrayBuffer());
  const declaredMimeType = optionalFormString(form, "declaredMimeType") ?? audio.type;
  const validated = validateAudio({
    bytes,
    fileName: audio.name,
    declaredMimeType,
    declaredDurationMs: metadata.declaredDurationMs,
    maxBytes: config.limits.maxAudioBytes,
    maxDurationMs: config.limits.maxAudioDurationMs,
  });
  return withTemporaryAudioFile({ bytes, extension: validated.extension }, async () => {
    return createConversationEngine().processMessage(userId, sessionId, requestId, {
      ...metadata,
      audio: { bytes, fileName: audio.name, mimeType: validated.mimeType },
    });
  });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = aiRequestId(request);
  const user = await getApiUser();
  if (!user) return aiUnauthorizedResponse(requestId);
  const config = getAiConfig();
  const rate = consumeRateLimit(`ai-assistant:${user.id}`, config.limits.rateLimitPerMinute, 60_000);
  if (!rate.allowed) return aiRouteErrorResponse(new AiError("AI_RATE_LIMITED", `Try again in ${rate.retryAfterSeconds} seconds.`), requestId);
  try {
    const sessionId = (await params).id;
    return await withUserConcurrencyLimit(user.id, config.limits.maxConcurrentTurnsPerUser, async () => {
      const contentType = request.headers.get("content-type") ?? "";
      let result;
      if (contentType.includes("multipart/form-data")) {
        result = await processMultipart(request, user.id, sessionId, requestId);
      } else {
        const textInput = textMessageSchema.parse(await request.json());
        result = await createConversationEngine().processMessage(user.id, sessionId, requestId, {
          ...textInput,
          clientMessageId: textInput.clientMessageId ?? randomUUID(),
        });
      }
      return Response.json(result, { headers: { "x-request-id": requestId } });
    });
  } catch (error) {
    return aiRouteErrorResponse(error, requestId);
  }
}
