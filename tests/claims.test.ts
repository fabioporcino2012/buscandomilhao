import { describe, expect, it } from "vitest";
import { validateOutboundText } from "../src/domain/claims";

describe("validateOutboundText", () => {
  it("accepts the approved quota explanation", () => {
    const text =
      "A cota oferece 10 diárias por ano ou cashback anual de 14% quando as diárias não forem utilizadas, conforme o contrato vigente.";

    expect(validateOutboundText(text)).toEqual({ ok: true, violations: [] });
  });

  it.each([
    "100% do seu valor retorna",
    "rendimento garantido de 14%",
    "rentabilidade garantida para todos",
    "aprovação garantida no Florida Pay",
    "restam apenas 850 cotas",
    "investimento garantido",
    "renda passiva garantida",
  ])("blocks forbidden claim: %s", (text) => {
    const result = validateOutboundText(text);

    expect(result.ok).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it("does not confuse Florida Black credit with Club cashback", () => {
    const text =
      "O crédito interno do Florida Black não é o cashback de 14% da cota Florida Club.";

    expect(validateOutboundText(text)).toEqual({ ok: true, violations: [] });
  });
});
