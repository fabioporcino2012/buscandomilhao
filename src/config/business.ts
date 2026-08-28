type Quota = {
  key: string;
  value_usd: number;
  cashback_usd: number;
};

export type BusinessConfig = {
  business_name: string;
  journey_order: ["florida_pay", "florida_club", "florida_black"];
  florida_club: {
    annual_days: 10;
    annual_cashback_rate: 0.14;
    quotas: Quota[];
  };
  kommo: { pipeline_id: 13953440 };
  meta: {
    waba_id: string;
    phone_id: string;
    instagram_handle: "floridacluboficial";
  };
};

const forbiddenCredentialKeys = new Set([
  "access_token",
  "api_key",
  "client_secret",
  "password",
  "service_role",
  "token",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function containsCredentialKey(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(containsCredentialKey);
  }

  if (!isRecord(value)) {
    return false;
  }

  return Object.entries(value).some(
    ([key, nested]) =>
      forbiddenCredentialKeys.has(key.toLowerCase()) || containsCredentialKey(nested),
  );
}

function requireNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${field} must be a finite number`);
  }
  return value;
}

export function parseBusinessConfig(input: unknown): BusinessConfig {
  if (containsCredentialKey(input)) {
    throw new Error("credentials are not allowed in public configuration");
  }

  if (!isRecord(input) || !isRecord(input.florida_club)) {
    throw new Error("invalid business configuration");
  }

  const quotas = input.florida_club.quotas;
  if (!Array.isArray(quotas) || quotas.length !== 4) {
    throw new Error("Florida Club must contain exactly four quotas");
  }

  for (const quota of quotas) {
    if (!isRecord(quota)) {
      throw new Error("invalid quota configuration");
    }

    const value = requireNumber(quota.value_usd, "quota value");
    const cashback = requireNumber(quota.cashback_usd, "quota cashback");
    if (Math.abs(cashback - value * 0.14) > 0.001) {
      throw new Error("cashback must equal 14% of quota value");
    }
  }

  return input as BusinessConfig;
}
