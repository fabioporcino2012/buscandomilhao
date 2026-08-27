export type PayAccountStatus =
  | "not_started"
  | "signup_started"
  | "kyc_pending"
  | "active"
  | "rejected"
  | "unavailable";

export type PayProviderCapabilities = {
  provider: "dunnas_tecnologia" | "unconfirmed";
  customerLookup: boolean;
  kycStatus: boolean;
  accountStatus: boolean;
  cardStatus: boolean;
  pixStatus: boolean;
  cashbackLedger: boolean;
};
