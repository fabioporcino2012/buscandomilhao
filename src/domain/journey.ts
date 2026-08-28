export type PayState =
  | "not_started"
  | "signup_started"
  | "kyc_pending"
  | "active"
  | "rejected"
  | "unavailable";

export type ClubState =
  | "unknown"
  | "qualifying"
  | "meeting_scheduled"
  | "proposal"
  | "documentation"
  | "quota_active"
  | "lost";

export type BlackState =
  | "unknown"
  | "eligible"
  | "invited"
  | "waitlist"
  | "active"
  | "unavailable";

export type JourneyState = {
  pay: PayState;
  club: ClubState;
  black: BlackState;
};

export type JourneyAction =
  | { action: "invite_pay_signup"; product: "florida_pay" }
  | { action: "qualify_club"; product: "florida_club" }
  | { action: "invite_black"; product: "florida_black" }
  | { action: "wait"; product: null }
  | { action: "human_review_required"; product: null; reason: string };

type JourneyTransition =
  | { ok: true; state: JourneyState }
  | {
      ok: false;
      action: "human_review_required";
      reason: "confirmed_state_cannot_move_backward";
      state: JourneyState;
    };

export function transitionJourney(
  current: JourneyState,
  update: Partial<JourneyState>,
): JourneyTransition {
  if (
    current.club === "quota_active" &&
    update.club !== undefined &&
    update.club !== "quota_active"
  ) {
    return {
      ok: false,
      action: "human_review_required",
      reason: "confirmed_state_cannot_move_backward",
      state: current,
    };
  }

  return { ok: true, state: { ...current, ...update } };
}
