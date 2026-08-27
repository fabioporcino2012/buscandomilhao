import type { AgentDecision, AgentUsage } from "../ai/client";
import { validateOneQuestion } from "../ai/prompts";
import { validateOutboundText } from "../domain/claims";

export type OutboundContext = {
  hasConsent: boolean;
  optedOut: boolean;
  channelOwned: boolean;
  integrationHealthy: boolean;
  withinBudget: boolean;
};

export type OutboundValidation =
  | { ok: true; stoppedAt: null; reason: null }
  | { ok: false; stoppedAt: string; reason: string };

export function validateOutboundDecision(
  decision: AgentDecision,
  context: OutboundContext,
): OutboundValidation {
  if (decision.requiresHuman) {
    return { ok: false, stoppedAt: "schema", reason: "human_review_required" };
  }

  if (decision.message === null) {
    return { ok: false, stoppedAt: "schema", reason: "missing_message" };
  }

  const questionValidation = validateOneQuestion(decision.message);
  if (!questionValidation.ok) {
    return {
      ok: false,
      stoppedAt: "message_shape",
      reason: "multiple_questions",
    };
  }

  const claimValidation = validateOutboundText(decision.message);
  if (!claimValidation.ok) {
    return { ok: false, stoppedAt: "claim_guard", reason: "forbidden_claim" };
  }

  if (!context.hasConsent || context.optedOut) {
    return { ok: false, stoppedAt: "consent", reason: "contact_not_allowed" };
  }

  if (!context.channelOwned) {
    return {
      ok: false,
      stoppedAt: "channel_ownership",
      reason: "channel_not_exclusively_owned",
    };
  }

  if (!context.integrationHealthy) {
    return {
      ok: false,
      stoppedAt: "integration_health",
      reason: "integration_unhealthy",
    };
  }

  if (!context.withinBudget) {
    return { ok: false, stoppedAt: "budget", reason: "budget_exceeded" };
  }

  return { ok: true, stoppedAt: null, reason: null };
}

export function createDecisionAudit(input: {
  decision: AgentDecision;
  usage: AgentUsage;
  validation: OutboundValidation;
  dispatchResult: string;
}) {
  return {
    product: input.decision.product,
    action: input.decision.action,
    requiresHuman: input.decision.requiresHuman,
    evidenceKeys: input.decision.evidenceKeys,
    model: input.usage.model,
    inputTokens: input.usage.inputTokens,
    outputTokens: input.usage.outputTokens,
    costUsd: input.usage.costUsd,
    validation: input.validation,
    dispatchResult: input.dispatchResult,
  };
}
