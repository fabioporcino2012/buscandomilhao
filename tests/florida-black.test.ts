import { describe, expect, it } from "vitest";
import {
  decideBlackOffer,
  describeBlackCredit,
  selectActiveBlackOffers,
} from "../src/integrations/florida-black/client";

describe("Florida Black commercial guardrails", () => {
  it("routes to the waitlist while sales are suspended", () => {
    expect(
      decideBlackOffer({
        salesEnabled: false,
        activeOffers: [],
      }),
    ).toEqual({ action: "join_waitlist", offers: [] });
  });

  it("uses only active, purchasable offers from the live catalog", () => {
    const offers = selectActiveBlackOffers([
      {
        id: "active",
        title: "Aula Orlando",
        active: true,
        priceBrl: 49.9,
        checkoutUrl: "https://checkout.example/active",
      },
      {
        id: "historical",
        title: "Plano histórico",
        active: false,
        priceBrl: 4.99,
        checkoutUrl: "https://checkout.example/historical",
      },
      {
        id: "no-checkout",
        title: "Sem checkout",
        active: true,
        priceBrl: 99.9,
        checkoutUrl: null,
      },
    ]);

    expect(offers).toEqual([
      {
        id: "active",
        title: "Aula Orlando",
        priceBrl: 49.9,
        checkoutUrl: "https://checkout.example/active",
      },
    ]);
    expect(decideBlackOffer({ salesEnabled: true, activeOffers: offers })).toEqual({
      action: "show_active_offers",
      offers,
    });
  });

  it("never presents Black store credit as the Club quota cashback", () => {
    const description = describeBlackCredit(100);

    expect(description).toContain("crédito interno Florida Black");
    expect(description).not.toContain("14%");
    expect(description.toLowerCase()).not.toContain("cota");
  });
});
