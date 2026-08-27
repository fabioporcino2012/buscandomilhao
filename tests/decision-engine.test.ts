import { describe, expect, it } from "vitest";
import { parseAgentDecision } from "../src/ai/client";
import { validateOneQuestion } from "../src/ai/prompts";
import { validateOutboundDecision } from "../src/worker/handlers";

describe("autonomous decision engine", () => {
  it("accepts one question and rejects two independent questions", () => {
    expect(validateOneQuestion("Quando será sua próxima viagem?")).toEqual({
      ok: true,
      questionCount: 1,
    });
    expect(
      validateOneQuestion(
        "Quando será sua próxima viagem? Quantas pessoas irão com você?",
      ),
    ).toEqual({ ok: false, questionCount: 2 });
  });

  it("accepts only a complete structured model decision", () => {
    expect(
      parseAgentDecision({
        intent: "qualify_travel",
        product: "florida_pay",
        action: "ask_next_trip",
        message: "Quando será sua próxima viagem?",
        requiresHuman: false,
        evidenceKeys: ["journey.pay.not_started"],
      }),
    ).toEqual({
      intent: "qualify_travel",
      product: "florida_pay",
      action: "ask_next_trip",
      message: "Quando será sua próxima viagem?",
      requiresHuman: false,
      evidenceKeys: ["journey.pay.not_started"],
    });

    expect(() => parseAgentDecision({ action: "ask_next_trip" })).toThrow(
      "invalid_agent_decision",
    );
  });

  it("runs outbound gates in the required order and stops at the first failure", () => {
    const result = validateOutboundDecision(
      {
        intent: "sell_club",
        product: "florida_club",
        action: "send_offer",
        message: "100% do seu valor retorna. Quer garantir agora? Posso enviar o link?",
        requiresHuman: false,
        evidenceKeys: ["club.offer"],
      },
      {
        hasConsent: false,
        optedOut: true,
        channelOwned: false,
        integrationHealthy: false,
        withinBudget: false,
      },
    );

    expect(result).toEqual({
      ok: false,
      stoppedAt: "message_shape",
      reason: "multiple_questions",
    });
  });

  it("never dispatches when consent, ownership or health is uncertain", () => {
    const decision = {
      intent: "continue_pay",
      product: "florida_pay" as const,
      action: "send_signup",
      message: "Posso enviar o acesso para abrir sua conta?",
      requiresHuman: false,
      evidenceKeys: ["pay.provider.dunnas"],
    };

    expect(
      validateOutboundDecision(decision, {
        hasConsent: true,
        optedOut: false,
        channelOwned: false,
        integrationHealthy: true,
        withinBudget: true,
      }),
    ).toMatchObject({ ok: false, stoppedAt: "channel_ownership" });
  });
});
