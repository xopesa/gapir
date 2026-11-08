import { prisma } from "@/src/server/db";
import type { AiProviderType, ProviderUsage } from "../providers/contracts";
import type { AiConfig } from "../config/ai-config";
import { calculateEstimatedCost } from "../cost/cost-tracker";

export type ProviderTelemetryEvent = {
  providerType: AiProviderType;
  providerName: string;
  model: string;
  success: boolean;
  latencyMs: number;
  errorCode?: string | null;
  requestId: string;
  sessionId: string;
  userId: string;
  usage: ProviderUsage;
};

export function createProviderTelemetryRecord(event: ProviderTelemetryEvent) {
  return {
    providerType: event.providerType,
    providerName: event.providerName,
    model: event.model,
    success: event.success,
    latencyMs: Math.max(0, Math.round(event.latencyMs)),
    errorCode: event.errorCode ?? null,
    requestId: event.requestId,
    sessionId: event.sessionId,
    userId: event.userId,
  };
}

export class AiTelemetryService {
  constructor(private readonly config: AiConfig) {}

  async record(event: ProviderTelemetryEvent) {
    const record = createProviderTelemetryRecord(event);
    const cost = calculateEstimatedCost(event.providerName, event.model, event.usage, this.config.pricing);
    try {
      await prisma.$transaction([
        prisma.aiProviderLog.create({ data: record }),
        prisma.aiUsageCost.create({
          data: {
            userId: event.userId,
            sessionId: event.sessionId,
            providerType: event.providerType,
            providerName: event.providerName,
            model: event.model,
            inputUnits: event.usage.inputUnits,
            outputUnits: event.usage.outputUnits,
            estimatedCost: cost.estimatedCost,
            currency: cost.currency,
            requestId: event.requestId,
          },
        }),
      ]);
    } catch {
      // Telemetry must never make a valid tutor turn fail. Operational alerting can consume this signal later.
    }
  }
}
