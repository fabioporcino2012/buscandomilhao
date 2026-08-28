export type PilotDirection = "inbound" | "outbound";

export function evaluatePilotAction(input: {
  globalPause: boolean;
  direction: PilotDirection;
}): "allowed" | "blocked_global_pause" {
  if (input.globalPause && input.direction === "outbound") {
    return "blocked_global_pause";
  }
  return "allowed";
}
