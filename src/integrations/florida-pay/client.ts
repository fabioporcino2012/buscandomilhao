import type {
  PayAccountStatus,
  PayProviderCapabilities,
} from "./types";

const canonicalStatuses = new Set<PayAccountStatus>([
  "not_started",
  "signup_started",
  "kyc_pending",
  "active",
  "rejected",
  "unavailable",
]);

export function parsePayAccountStatus(value: unknown): PayAccountStatus {
  if (typeof value === "string" && canonicalStatuses.has(value as PayAccountStatus)) {
    return value as PayAccountStatus;
  }
  return "unavailable";
}

export function assessPayProviderCapabilities(
  observedPaths: string[],
): PayProviderCapabilities {
  const paths = new Set(observedPaths);
  const dunnasEvidence =
    paths.has("/clientes") || paths.has("/pedidos") || paths.has("/cotas");

  return {
    provider: dunnasEvidence ? "dunnas_tecnologia" : "unconfirmed",
    customerLookup: paths.has("/clientes"),
    kycStatus: false,
    accountStatus: false,
    cardStatus: false,
    pixStatus: false,
    cashbackLedger: false,
  };
}
