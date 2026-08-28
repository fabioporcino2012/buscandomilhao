export type BlackCatalogRecord = {
  id: string;
  title: string;
  active: boolean;
  priceBrl: number;
  checkoutUrl: string | null;
};

export type ActiveBlackOffer = Omit<BlackCatalogRecord, "active"> & {
  checkoutUrl: string;
};

type BlackOfferDecision =
  | { action: "join_waitlist"; offers: [] }
  | { action: "show_active_offers"; offers: ActiveBlackOffer[] };

export function selectActiveBlackOffers(
  catalog: BlackCatalogRecord[],
): ActiveBlackOffer[] {
  return catalog.flatMap(({ active, checkoutUrl, ...offer }) => {
    if (!active || !checkoutUrl || offer.priceBrl <= 0) {
      return [];
    }

    return [{ ...offer, checkoutUrl }];
  });
}

export function decideBlackOffer(input: {
  salesEnabled: boolean;
  activeOffers: ActiveBlackOffer[];
}): BlackOfferDecision {
  if (!input.salesEnabled || input.activeOffers.length === 0) {
    return { action: "join_waitlist", offers: [] };
  }

  return { action: "show_active_offers", offers: input.activeOffers };
}

export function describeBlackCredit(amountBrl: number): string {
  const value = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountBrl);

  return `${value} em crédito interno Florida Black para uso dentro da plataforma.`;
}
