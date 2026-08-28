import { describe, expect, it } from "vitest";
import { decideNextAction } from "../src/domain/decision";
import { transitionJourney } from "../src/domain/journey";

describe("Florida journey", () => {
  it("starts with Pay", () => {
    expect(
      decideNextAction({
        pay: "not_started",
        club: "unknown",
        black: "unknown",
      }),
    ).toEqual({ action: "invite_pay_signup", product: "florida_pay" });
  });

  it("qualifies Club after Pay activation", () => {
    expect(
      decideNextAction({ pay: "active", club: "unknown", black: "unknown" }),
    ).toEqual({ action: "qualify_club", product: "florida_club" });
  });

  it("invites Black after an active quota", () => {
    expect(
      decideNextAction({
        pay: "active",
        club: "quota_active",
        black: "unknown",
      }),
    ).toEqual({ action: "invite_black", product: "florida_black" });
  });

  it("waits when the full journey is active", () => {
    expect(
      decideNextAction({
        pay: "active",
        club: "quota_active",
        black: "active",
      }),
    ).toEqual({ action: "wait", product: null });
  });

  it("requires review when Club is active but Pay is not", () => {
    expect(
      decideNextAction({
        pay: "kyc_pending",
        club: "quota_active",
        black: "unknown",
      }),
    ).toEqual({
      action: "human_review_required",
      product: null,
      reason: "club_active_without_pay_active",
    });
  });

  it("blocks a confirmed quota from moving backward", () => {
    const current = {
      pay: "active" as const,
      club: "quota_active" as const,
      black: "unknown" as const,
    };

    expect(transitionJourney(current, { club: "qualifying" })).toEqual({
      ok: false,
      action: "human_review_required",
      reason: "confirmed_state_cannot_move_backward",
      state: current,
    });
  });
});
