import type { AgentDecision } from "../ai/client";
import {
  validateOutboundDecision,
  type OutboundContext,
} from "./handlers";

export type OutboundChannel = "whatsapp" | "instagram";

export type KommoMessageNote = Array<{
  note_type: "common";
  params: { text: string };
}>;

type DispatchReceipt = { externalMessageId: string };
type Dispatch = (input: {
  channel: OutboundChannel;
  message: string;
}) => Promise<DispatchReceipt>;
type CreateNote = (leadId: number, body: KommoMessageNote) => Promise<unknown>;

type SentPendingNote = {
  status: "sent_pending_note";
  externalMessageId: string;
  leadId: number;
  noteBody: KommoMessageNote;
};

export type OutboundExecutionResult =
  | { status: "blocked"; reason: string }
  | { status: "sent_and_recorded"; externalMessageId: string }
  | SentPendingNote;

function formatBusinessTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    dateStyle: "short",
    timeStyle: "medium",
    hour12: false,
  }).format(date);
}

export function buildKommoMessageNote(input: {
  channel: OutboundChannel;
  message: string;
  externalMessageId: string;
  occurredAt: Date;
}): KommoMessageNote {
  const channel = input.channel === "whatsapp" ? "WhatsApp" : "Instagram";
  const text = [
    "[Florida Ecosystem — mensagem enviada]",
    `Canal: ${channel}`,
    `Horário Orlando: ${formatBusinessTime(input.occurredAt, "America/New_York")}`,
    `Horário São Paulo: ${formatBusinessTime(input.occurredAt, "America/Sao_Paulo")}`,
    `ID externo: ${input.externalMessageId}`,
    "Texto exato:",
    input.message,
  ].join("\n");

  return [{ note_type: "common", params: { text } }];
}

export async function executeOutboundDecision(input: {
  decision: AgentDecision;
  context: OutboundContext;
  leadId: number;
  channel: OutboundChannel;
  occurredAt: Date;
  dispatch: Dispatch;
  createNote: CreateNote;
}): Promise<OutboundExecutionResult> {
  const validation = validateOutboundDecision(input.decision, input.context);
  if (!validation.ok) {
    return { status: "blocked", reason: validation.reason };
  }

  const message = input.decision.message;
  if (message === null) {
    return { status: "blocked", reason: "missing_message" };
  }

  const receipt = await input.dispatch({ channel: input.channel, message });
  if (!receipt.externalMessageId) {
    throw new Error("dispatch_missing_external_message_id");
  }

  const noteBody = buildKommoMessageNote({
    channel: input.channel,
    message,
    externalMessageId: receipt.externalMessageId,
    occurredAt: input.occurredAt,
  });

  try {
    await input.createNote(input.leadId, noteBody);
    return {
      status: "sent_and_recorded",
      externalMessageId: receipt.externalMessageId,
    };
  } catch {
    return {
      status: "sent_pending_note",
      externalMessageId: receipt.externalMessageId,
      leadId: input.leadId,
      noteBody,
    };
  }
}

export async function retryKommoNoteOnly(
  pending: SentPendingNote,
  createNote: CreateNote,
): Promise<OutboundExecutionResult> {
  try {
    await createNote(pending.leadId, pending.noteBody);
    return {
      status: "sent_and_recorded",
      externalMessageId: pending.externalMessageId,
    };
  } catch {
    return pending;
  }
}
