export const floridaProducts = [
  "florida_pay",
  "florida_club",
  "florida_black",
] as const;

export type FloridaProduct = (typeof floridaProducts)[number];

export type AgentDecision = {
  intent: string;
  product: FloridaProduct;
  action: string;
  message: string | null;
  requiresHuman: boolean;
  evidenceKeys: string[];
};

export type AgentUsage = {
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number | null;
};

export function parseAgentDecision(value: unknown): AgentDecision {
  if (!value || typeof value !== "object") {
    throw new Error("invalid_agent_decision");
  }

  const candidate = value as Record<string, unknown>;
  const validProduct = floridaProducts.includes(
    candidate.product as FloridaProduct,
  );
  const validEvidence =
    Array.isArray(candidate.evidenceKeys) &&
    candidate.evidenceKeys.every((key) => typeof key === "string");

  if (
    typeof candidate.intent !== "string" ||
    !validProduct ||
    typeof candidate.action !== "string" ||
    (typeof candidate.message !== "string" && candidate.message !== null) ||
    typeof candidate.requiresHuman !== "boolean" ||
    !validEvidence
  ) {
    throw new Error("invalid_agent_decision");
  }

  return candidate as AgentDecision;
}
