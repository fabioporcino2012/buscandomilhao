import { describe, expect, it } from "vitest";
import { APP_NAME, JOURNEY_ORDER } from "../src/config/constants";

describe("bootstrap", () => {
  it("uses the approved Florida journey", () => {
    expect(APP_NAME).toBe("Florida Ecosystem");
    expect(JOURNEY_ORDER).toEqual([
      "florida_pay",
      "florida_club",
      "florida_black",
    ]);
  });
});
