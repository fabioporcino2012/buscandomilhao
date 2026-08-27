import { describe, expect, it } from "vitest";
import { createLocalDatabase } from "../../src/db/client";
import { decideNextAction } from "../../src/domain/decision";
import { matchIdentity } from "../../src/domain/identity";
import { transitionJourney, type JourneyState } from "../../src/domain/journey";
import { runInstagramFirstContact } from "../../src/integrations/browser/instagram";
import { decideBlackOffer } from "../../src/integrations/florida-black/client";
import {
  assessPhoneHealth,
  determineChannelOwnership,
} from "../../src/integrations/meta/audit";
import { validateOutboundDecision } from "../../src/worker/handlers";
import { createJobQueue } from "../../src/worker/jobs";

describe("Florida ecosystem end-to-end dry-run", () => {
  it("moves through Pay, Club and the suspended Black offer", () => {
    let state: JourneyState = {
      pay: "not_started",
      club: "unknown",
      black: "unknown",
    };

    expect(decideNextAction(state)).toEqual({
      action: "invite_pay_signup",
      product: "florida_pay",
    });

    const payActivated = transitionJourney(state, { pay: "active" });
    expect(payActivated.ok).toBe(true);
    if (!payActivated.ok) throw new Error("unexpected_transition_failure");
    state = payActivated.state;
    expect(decideNextAction(state)).toEqual({
      action: "qualify_club",
      product: "florida_club",
    });

    const meeting = transitionJourney(state, { club: "meeting_scheduled" });
    expect(meeting.ok).toBe(true);
    if (!meeting.ok) throw new Error("unexpected_transition_failure");
    state = meeting.state;

    const quotaActivated = transitionJourney(state, { club: "quota_active" });
    expect(quotaActivated.ok).toBe(true);
    if (!quotaActivated.ok) throw new Error("unexpected_transition_failure");
    state = quotaActivated.state;
    expect(decideNextAction(state)).toEqual({
      action: "invite_black",
      product: "florida_black",
    });

    expect(
      decideBlackOffer({ salesEnabled: false, activeOffers: [] }),
    ).toEqual({ action: "join_waitlist", offers: [] });
  });

  it("blocks every prohibited or uncertain outbound condition", async () => {
    const forbidden = validateOutboundDecision(
      {
        intent: "sell_club",
        product: "florida_club",
        action: "send_offer",
        message: "100% do seu valor retorna.",
        requiresHuman: false,
        evidenceKeys: [],
      },
      {
        hasConsent: true,
        optedOut: false,
        channelOwned: true,
        integrationHealthy: true,
        withinBudget: true,
      },
    );
    expect(forbidden).toMatchObject({ ok: false, stoppedAt: "claim_guard" });

    expect(
      matchIdentity(
        { phone: "+1 407 000 0000" },
        [
          { id: "one", phone: "14070000000" },
          { id: "two", phone: "+1 (407) 000-0000" },
        ],
      ),
    ).toEqual({ kind: "ambiguous", candidateIds: ["one", "two"] });

    expect(
      determineChannelOwnership({
        metaWebhookActive: true,
        zapiWebhookActive: true,
      }),
    ).toEqual({ ok: false, status: "blocked_conflicting_owners" });

    expect(
      assessPhoneHealth({
        id: "1309297265596025",
        displayPhoneNumber: "+1 407-462-3309",
        verifiedName: "Flórida Club",
        qualityRating: "RED",
        status: "CONNECTED",
        verificationStatus: "VERIFIED",
        nameStatus: "APPROVED",
      }),
    ).toMatchObject({ ok: false, status: "blocked_unhealthy" });

    let clicked = false;
    await expect(
      runInstagramFirstContact(
        {
          hasCheckpoint: async () => true,
          openThread: async () => undefined,
          fillComposer: async () => undefined,
          clickSend: async () => {
            clicked = true;
          },
        },
        {
          profileUrl: "https://www.instagram.com/teste/",
          message: "Olá",
          mode: "live",
        },
      ),
    ).resolves.toEqual({ status: "paused_checkpoint", sent: false });
    expect(clicked).toBe(false);
  });

  it("records a duplicate event once even after completion", () => {
    const database = createLocalDatabase(":memory:");
    database.$client.exec(`
      create table jobs (
        id text primary key,
        unique_key text not null unique,
        status text not null,
        payload text not null,
        attempts integer not null default 0,
        created_at integer not null,
        completed_at integer
      )
    `);
    let id = 0;
    const queue = createJobQueue(database, {
      createId: () => `job-${(id += 1)}`,
    });

    const first = queue.enqueue({
      channel: "instagram",
      eventId: "same-event",
      action: "reply",
      payload: {},
    });
    queue.complete(first.uniqueKey);
    const second = queue.enqueue({
      channel: "instagram",
      eventId: "same-event",
      action: "reply",
      payload: {},
    });

    expect(first.created).toBe(true);
    expect(second).toMatchObject({ created: false, status: "completed" });
    database.$client.close();
  });
});
