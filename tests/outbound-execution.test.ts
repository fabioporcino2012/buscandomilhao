import { describe, expect, it, vi } from "vitest";
import type { AgentDecision } from "../src/ai/client";
import {
  buildKommoMessageNote,
  executeOutboundDecision,
  retryKommoNoteOnly,
} from "../src/worker/outbound";

const decision: AgentDecision = {
  intent: "continue_pay",
  product: "florida_pay",
  action: "send_signup",
  message: "Posso enviar o acesso oficial para abrir sua conta?",
  requiresHuman: false,
  evidenceKeys: ["pay.provider.dunnas"],
};

const allowedContext = {
  hasConsent: true,
  optedOut: false,
  channelOwned: true,
  integrationHealthy: true,
  withinBudget: true,
};

describe("outbound execution with Kommo timeline", () => {
  it("does not dispatch or create a note when validation blocks the message", async () => {
    const dispatch = vi.fn();
    const createNote = vi.fn();

    const result = await executeOutboundDecision({
      decision,
      context: { ...allowedContext, channelOwned: false },
      leadId: 123,
      channel: "whatsapp",
      occurredAt: new Date("2026-08-28T14:00:00Z"),
      dispatch,
      createNote,
    });

    expect(result).toMatchObject({
      status: "blocked",
      reason: "channel_not_exclusively_owned",
    });
    expect(dispatch).not.toHaveBeenCalled();
    expect(createNote).not.toHaveBeenCalled();
  });

  it("records the exact sent message as a common note on the Kommo lead", async () => {
    const dispatch = vi.fn().mockResolvedValue({ externalMessageId: "wamid-1" });
    const createNote = vi.fn().mockResolvedValue({ id: 987 });

    const result = await executeOutboundDecision({
      decision,
      context: allowedContext,
      leadId: 123,
      channel: "whatsapp",
      occurredAt: new Date("2026-08-28T14:00:00Z"),
      dispatch,
      createNote,
    });

    expect(result).toEqual({
      status: "sent_and_recorded",
      externalMessageId: "wamid-1",
    });
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(createNote).toHaveBeenCalledWith(
      123,
      buildKommoMessageNote({
        channel: "whatsapp",
        message: decision.message!,
        externalMessageId: "wamid-1",
        occurredAt: new Date("2026-08-28T14:00:00Z"),
      }),
    );
    const note = createNote.mock.calls[0][1][0].params.text;
    expect(note).toContain("Canal: WhatsApp");
    expect(note).toContain("Horário Orlando: 28/08/2026, 10:00:00");
    expect(note).toContain("Horário São Paulo: 28/08/2026, 11:00:00");
    expect(note).toContain("ID externo: wamid-1");
    expect(note).toContain(decision.message);
  });

  it("retries only the Kommo note when dispatch succeeded but timeline recording failed", async () => {
    const dispatch = vi.fn().mockResolvedValue({ externalMessageId: "igmid-1" });
    const noteBody = buildKommoMessageNote({
      channel: "instagram",
      message: decision.message!,
      externalMessageId: "igmid-1",
      occurredAt: new Date("2026-08-28T14:00:00Z"),
    });
    const createNote = vi
      .fn()
      .mockRejectedValueOnce(new Error("Kommo unavailable"))
      .mockResolvedValueOnce({ id: 988 });

    const first = await executeOutboundDecision({
      decision,
      context: allowedContext,
      leadId: 456,
      channel: "instagram",
      occurredAt: new Date("2026-08-28T14:00:00Z"),
      dispatch,
      createNote,
    });

    expect(first).toEqual({
      status: "sent_pending_note",
      externalMessageId: "igmid-1",
      leadId: 456,
      noteBody,
    });

    if (first.status !== "sent_pending_note") {
      throw new Error("expected sent_pending_note");
    }

    const retried = await retryKommoNoteOnly(first, createNote);

    expect(retried).toEqual({
      status: "sent_and_recorded",
      externalMessageId: "igmid-1",
    });
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(createNote).toHaveBeenCalledTimes(2);
  });
});
