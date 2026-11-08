import type { AiPricingEntry } from "../config/ai-config";
import type { ProviderUsage } from "../providers/contracts";

export function calculateEstimatedCost(
  providerName: string,
  model: string,
  usage: ProviderUsage,
  pricing: Record<string, AiPricingEntry>,
) {
  const entry = pricing[`${providerName}:${model}`] ?? pricing[`${providerName}:*`];
  if (!entry || (usage.inputUnits === null && usage.outputUnits === null)) {
    return { estimatedCost: null, currency: entry?.currency ?? "USD" };
  }
  const inputCost = usage.inputUnits === null || entry.inputPerMillion === undefined
    ? 0 : usage.inputUnits * entry.inputPerMillion / 1_000_000;
  const outputCost = usage.outputUnits === null || entry.outputPerMillion === undefined
    ? 0 : usage.outputUnits * entry.outputPerMillion / 1_000_000;
  const hasKnownRate = (usage.inputUnits !== null && entry.inputPerMillion !== undefined)
    || (usage.outputUnits !== null && entry.outputPerMillion !== undefined);
  return { estimatedCost: hasKnownRate ? inputCost + outputCost : null, currency: entry.currency ?? "USD" };
}
