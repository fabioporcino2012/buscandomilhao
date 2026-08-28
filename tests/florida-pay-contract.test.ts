import { describe, expect, it } from "vitest";
import {
  assessPayProviderCapabilities,
  parsePayAccountStatus,
} from "../src/integrations/florida-pay/client";

describe("Florida Pay provider contract", () => {
  it.each([
    "not_started",
    "signup_started",
    "kyc_pending",
    "active",
    "rejected",
    "unavailable",
  ] as const)("accepts the canonical status %s", (status) => {
    expect(parsePayAccountStatus(status)).toBe(status);
  });

  it("maps an unknown provider status to unavailable", () => {
    expect(parsePayAccountStatus("approved-ish")).toBe("unavailable");
    expect(parsePayAccountStatus(null)).toBe("unavailable");
  });

  it("reports only capabilities proven by the current Dunnas sync", () => {
    expect(
      assessPayProviderCapabilities(["/clientes", "/pedidos", "/cotas"]),
    ).toEqual({
      provider: "dunnas_tecnologia",
      customerLookup: true,
      kycStatus: false,
      accountStatus: false,
      cardStatus: false,
      pixStatus: false,
      cashbackLedger: false,
    });
  });
});
