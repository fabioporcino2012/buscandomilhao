export type IdentityInput = {
  phone?: string;
  email?: string;
  kommoContactId?: number;
};

export type IdentityCandidate = IdentityInput & {
  id: string;
};

export type IdentityMatch =
  | { kind: "matched"; customerId: string }
  | { kind: "ambiguous"; candidateIds: string[] }
  | { kind: "not_found" };

function normalizePhone(phone: string | undefined) {
  return phone?.replace(/\D/g, "") || undefined;
}

function normalizeEmail(email: string | undefined) {
  return email?.trim().toLowerCase() || undefined;
}

export function matchIdentity(
  input: IdentityInput,
  candidates: IdentityCandidate[],
): IdentityMatch {
  const phone = normalizePhone(input.phone);
  const email = normalizeEmail(input.email);
  const matchedIds = new Set<string>();

  for (const candidate of candidates) {
    const phoneMatches =
      phone !== undefined && phone === normalizePhone(candidate.phone);
    const emailMatches =
      email !== undefined && email === normalizeEmail(candidate.email);
    const kommoMatches =
      input.kommoContactId !== undefined &&
      input.kommoContactId === candidate.kommoContactId;

    if (phoneMatches || emailMatches || kommoMatches) {
      matchedIds.add(candidate.id);
    }
  }

  const ids = [...matchedIds].sort();
  if (ids.length === 0) {
    return { kind: "not_found" };
  }
  if (ids.length > 1) {
    return { kind: "ambiguous", candidateIds: ids };
  }
  return { kind: "matched", customerId: ids[0] };
}

export function canContact(
  customer: { doNotContact: boolean },
  _channel: "instagram" | "whatsapp",
) {
  return !customer.doNotContact;
}
