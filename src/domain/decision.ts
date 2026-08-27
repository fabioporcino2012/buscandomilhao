import type { JourneyAction, JourneyState } from "./journey";

export function decideNextAction(state: JourneyState): JourneyAction {
  if (state.club === "quota_active" && state.pay !== "active") {
    return {
      action: "human_review_required",
      product: null,
      reason: "club_active_without_pay_active",
    };
  }

  if (state.pay === "not_started") {
    return { action: "invite_pay_signup", product: "florida_pay" };
  }

  if (state.pay === "active" && state.club === "unknown") {
    return { action: "qualify_club", product: "florida_club" };
  }

  if (state.club === "quota_active" && state.black === "unknown") {
    return { action: "invite_black", product: "florida_black" };
  }

  return { action: "wait", product: null };
}
