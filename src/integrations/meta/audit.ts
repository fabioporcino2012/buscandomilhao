type PhoneState = {
  id: string;
  displayPhoneNumber: string;
  verifiedName: string;
  qualityRating: string;
  status: string;
  verificationStatus: string;
  nameStatus: string;
};

export function assessPhoneHealth(phone: PhoneState) {
  const reasons: string[] = [];

  if (phone.id !== "1309297265596025") reasons.push("unexpected_phone_id");
  if (phone.displayPhoneNumber !== "+1 407-462-3309") {
    reasons.push("unexpected_phone_number");
  }
  if (phone.verifiedName !== "Flórida Club") reasons.push("unexpected_name");
  if (phone.qualityRating !== "GREEN") reasons.push("quality_not_green");
  if (phone.status !== "CONNECTED") reasons.push("phone_not_connected");
  if (phone.verificationStatus !== "VERIFIED") reasons.push("phone_not_verified");
  if (phone.nameStatus !== "APPROVED") reasons.push("name_not_approved");

  return {
    ok: reasons.length === 0,
    status: reasons.length === 0 ? "healthy" : "blocked_unhealthy",
    reasons,
  };
}

export function auditTemplates(
  templates: Array<{ name: string; status: string }>,
) {
  return templates.map((template) => ({
    name: template.name,
    localStatus:
      template.name === "fc_copy_condicao_especial_uudodu"
        ? "blocked_forbidden_claim"
        : "review_required",
  }));
}

export function determineChannelOwnership(input: {
  metaWebhookActive: boolean;
  zapiWebhookActive: boolean;
}) {
  if (input.metaWebhookActive && input.zapiWebhookActive) {
    return { ok: false, status: "blocked_conflicting_owners" } as const;
  }

  return { ok: true, status: "single_owner" } as const;
}
