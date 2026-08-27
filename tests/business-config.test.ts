import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseBusinessConfig } from "../src/config/business";

const fixture = JSON.parse(
  readFileSync(new URL("../config/business.example.json", import.meta.url), "utf8"),
);

describe("business configuration", () => {
  it("accepts the approved four quota catalog", () => {
    const config = parseBusinessConfig(fixture);

    expect(config.florida_club.quotas).toHaveLength(4);
    expect(config.florida_club.quotas.map((quota) => quota.cashback_usd)).toEqual([
      280, 420, 700, 1260,
    ]);
    expect(config.meta.instagram_handle).toBe("floridacluboficial");
  });

  it("rejects a quota whose cashback is not exactly 14 percent", () => {
    const invalid = structuredClone(fixture);
    invalid.florida_club.quotas[0].cashback_usd = 999;

    expect(() => parseBusinessConfig(invalid)).toThrow(
      "cashback must equal 14% of quota value",
    );
  });

  it("rejects credentials in the public configuration", () => {
    expect(() =>
      parseBusinessConfig({ ...fixture, access_token: "must-not-be-here" }),
    ).toThrow("credentials are not allowed");
  });
});
