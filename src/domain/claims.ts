type ClaimRule = {
  code: string;
  pattern: RegExp;
};

const forbiddenRules: readonly ClaimRule[] = [
  { code: "full_value_return", pattern: /100% do (seu )?valor (retorna|volta)/i },
  { code: "guaranteed_yield", pattern: /rendimento garantido/i },
  { code: "guaranteed_profitability", pattern: /rentabilidade garantida/i },
  { code: "guaranteed_approval", pattern: /aprova(?:ção|do) garantid/i },
  { code: "unverified_scarcity", pattern: /restam apenas 850 cotas/i },
  { code: "guaranteed_investment", pattern: /investimento garantido/i },
  { code: "guaranteed_passive_income", pattern: /renda passiva garantida/i },
] as const;

export type ClaimValidation = {
  ok: boolean;
  violations: string[];
};

export function validateOutboundText(text: string): ClaimValidation {
  const violations = forbiddenRules
    .filter(({ pattern }) => pattern.test(text))
    .map(({ code }) => code);

  return { ok: violations.length === 0, violations };
}
