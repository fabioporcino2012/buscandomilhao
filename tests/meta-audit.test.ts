import { describe, expect, it } from "vitest";
import {
  assessPhoneHealth,
  auditTemplates,
  determineChannelOwnership,
} from "../src/integrations/meta/audit";
import { createMetaClient } from "../src/integrations/meta/client";

const healthyPhone = {
  id: "1309297265596025",
  displayPhoneNumber: "+1 407-462-3309",
  verifiedName: "Flórida Club",
  qualityRating: "GREEN",
  status: "CONNECTED",
  verificationStatus: "VERIFIED",
  nameStatus: "APPROVED",
} as const;

describe("WhatsApp 3309 safety", () => {
  it("accepts only the confirmed healthy phone state", () => {
    expect(assessPhoneHealth(healthyPhone)).toEqual({
      ok: true,
      status: "healthy",
      reasons: [],
    });
  });

  it("blocks the approved template that promises full return", () => {
    expect(
      auditTemplates([
        { name: "fc_copy_condicao_especial_uudodu", status: "APPROVED" },
        { name: "fc_chamada_de_video_4hxtev", status: "APPROVED" },
      ]),
    ).toEqual([
      {
        name: "fc_copy_condicao_especial_uudodu",
        localStatus: "blocked_forbidden_claim",
      },
      {
        name: "fc_chamada_de_video_4hxtev",
        localStatus: "review_required",
      },
    ]);
  });

  it("blocks dispatch when an old non-commercial webhook can answer the official number", () => {
    expect(
      determineChannelOwnership({
        officialApiWebhookActive: true,
        legacyNonCommercialWebhookActive: true,
      }),
    ).toEqual({ ok: false, status: "blocked_conflicting_owners" });
  });

  it("refuses outbound delivery while external writes are disabled", async () => {
    let calls = 0;
    const client = createMetaClient({
      token: "test-token",
      allowExternalWrites: false,
      fetcher: async () => {
        calls += 1;
        return new Response();
      },
    });

    await expect(
      client.sendWhatsAppText({
        phoneId: "1309297265596025",
        to: "14070000000",
        text: "Mensagem de teste",
      }),
    ).resolves.toEqual({ mode: "dry_run", channel: "whatsapp" });
    expect(calls).toBe(0);
  });
});
