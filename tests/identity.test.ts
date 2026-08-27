import { describe, expect, it } from "vitest";
import { canContact, matchIdentity } from "../src/domain/identity";

describe("customer identity", () => {
  it("matches a normalized phone number", () => {
    expect(
      matchIdentity(
        { phone: "+1 (407) 462-3309" },
        [{ id: "a", phone: "14074623309" }],
      ),
    ).toEqual({ kind: "matched", customerId: "a" });
  });

  it("matches lowercase trimmed email", () => {
    expect(
      matchIdentity(
        { email: " FABINHO@EXAMPLE.COM " },
        [{ id: "a", email: "fabinho@example.com" }],
      ),
    ).toEqual({ kind: "matched", customerId: "a" });
  });

  it("matches an exact Kommo contact", () => {
    expect(
      matchIdentity(
        { kommoContactId: 123 },
        [{ id: "a", kommoContactId: 123 }],
      ),
    ).toEqual({ kind: "matched", customerId: "a" });
  });

  it("returns ambiguous when strong identifiers point to different people", () => {
    expect(
      matchIdentity(
        { phone: "+1 407 462 3309", email: "fabinho@example.com" },
        [
          { id: "a", phone: "14074623309" },
          { id: "b", email: "fabinho@example.com" },
        ],
      ),
    ).toEqual({ kind: "ambiguous", candidateIds: ["a", "b"] });
  });

  it("returns not found without a strong match", () => {
    expect(
      matchIdentity({ phone: "+1 111 111 1111" }, [
        { id: "a", phone: "14074623309" },
      ]),
    ).toEqual({ kind: "not_found" });
  });

  it("blocks every product and channel after a global opt-out", () => {
    expect(canContact({ doNotContact: true }, "instagram")).toBe(false);
    expect(canContact({ doNotContact: true }, "whatsapp")).toBe(false);
  });
});
