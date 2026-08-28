export type KommoMethod = "GET" | "POST" | "PATCH";

export type KommoProxyResponse<T> = {
  success: boolean;
  status: number;
  data: T;
  route_used?: string;
  attempt?: number;
  latency_ms?: number;
};

export type DryRunMutation = {
  mode: "dry_run";
  method: "POST" | "PATCH";
  path: string;
  body: unknown;
};
