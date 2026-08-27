export const APP_NAME = "Florida Ecosystem" as const;

export const JOURNEY_ORDER = [
  "florida_pay",
  "florida_club",
  "florida_black",
] as const;

export type ProductKey = (typeof JOURNEY_ORDER)[number];
