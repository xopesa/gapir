import type { AiMemory, AiSession, AiTutorResponse, AudioMessageInput, CreateSessionInput } from "../types";

type Fetcher = typeof fetch;
type ApiErrorPayload = { error?: { code?: string; message?: string; requestId?: string } };

export class AiAssistantApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = "AiAssistantApiError";
  }
}

function messageId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createSubmissionGate() {
  let active = false;
  return {
    enter() { if (active) return false; active = true; return true; },
    leave() { active = false; },
    isActive() { return active; },
  };
}

export class AiAssistantClient {
  constructor(private readonly fetcher: Fetcher = fetch, private readonly timeoutMs = 35_000) {}

  private async request<T>(path: string, init: RequestInit = {}, timeoutMs = this.timeoutMs): Promise<T> {
    const controller = new AbortController();
    const timeout = globalThis.setTimeout(() => controller.abort("timeout"), timeoutMs);
    const onAbort = () => controller.abort(init.signal?.reason);
    init.signal?.addEventListener("abort", onAbort, { once: true });
    try {
      const fetcher = this.fetcher;
      const response = await fetcher(path, { ...init, signal: controller.signal, headers: { Accept: "application/json", ...init.headers } });
      const payload = await response.json().catch(() => ({})) as T & ApiErrorPayload;
      if (!response.ok) {
        throw new AiAssistantApiError(payload.error?.code ?? `HTTP_${response.status}`, payload.error?.message ?? "AI request failed.", response.status, payload.error?.requestId);
      }
      return payload;
    } catch (error) {
      if (error instanceof AiAssistantApiError) throw error;
      if (controller.signal.aborted) throw new AiAssistantApiError("AI_TIMEOUT", "AI request timed out.", 504);
      throw new AiAssistantApiError("NETWORK_ERROR", error instanceof Error ? error.message : "Network error.", 0);
    } finally {
      globalThis.clearTimeout(timeout);
      init.signal?.removeEventListener("abort", onAbort);
    }
  }

  async createSession(input: CreateSessionInput, signal?: AbortSignal) {
    return (await this.request<{ session: AiSession }>("/api/ai-assistant/sessions", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input), signal,
    })).session;
  }

  async getSession(id: string, signal?: AbortSignal) {
    return (await this.request<{ session: AiSession }>(`/api/ai-assistant/sessions/${encodeURIComponent(id)}`, { signal })).session;
  }

  sendText(id: string, text: string, signal?: AbortSignal) {
    return this.request<AiTutorResponse>(`/api/ai-assistant/sessions/${encodeURIComponent(id)}/messages`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: text.trim(), clientMessageId: messageId() }), signal,
    });
  }

  sendAudio(id: string, input: AudioMessageInput, signal?: AbortSignal) {
    const form = new FormData();
    form.append("audio", input.blob, input.fileName);
    form.append("declaredMimeType", input.mimeType);
    form.append("durationMs", String(input.durationMs));
    form.append("clientMessageId", input.clientMessageId ?? messageId());
    return this.request<AiTutorResponse>(`/api/ai-assistant/sessions/${encodeURIComponent(id)}/messages`, { method: "POST", body: form, signal }, 50_000);
  }

  async finishSession(id: string, signal?: AbortSignal) {
    return (await this.request<{ session: AiSession }>(`/api/ai-assistant/sessions/${encodeURIComponent(id)}/finish`, { method: "POST", signal })).session;
  }

  async history(signal?: AbortSignal) {
    return (await this.request<{ sessions: AiSession[] }>("/api/ai-assistant/history", { signal })).sessions;
  }

  async memory(signal?: AbortSignal) {
    return (await this.request<{ memories: AiMemory[] }>("/api/ai-assistant/memory", { signal })).memories;
  }
}

export const aiAssistantClient = new AiAssistantClient();
