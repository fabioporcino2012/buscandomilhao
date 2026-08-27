import type {
  DryRunMutation,
  KommoMethod,
  KommoProxyResponse,
} from "./types";

export const KOMMO_PROXY_URL =
  "https://abjzskmxfcqsxcoybsdg.supabase.co/functions/v1/kommo-proxy-v2";

type ProxyRequestInput = {
  secret: string;
  method: KommoMethod;
  path: string;
  query?: Record<string, string>;
  body?: unknown;
  paginate?: boolean;
};

function normalizePath(path: string) {
  if (/^https?:\/\//i.test(path)) {
    throw new Error("direct Kommo URLs are forbidden");
  }

  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return withSlash.startsWith("/api/v4")
    ? withSlash
    : `/api/v4${withSlash}`;
}

export function buildKommoProxyRequest(input: ProxyRequestInput) {
  const path = normalizePath(input.path);

  return {
    url: KOMMO_PROXY_URL,
    init: {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret: input.secret,
        path,
        method: input.method,
        query: input.query ?? {},
        body: input.body ?? {},
        paginate: input.paginate ?? false,
      }),
    },
  } as const;
}

type KommoClientOptions = {
  secret: string;
  allowExternalWrites: boolean;
  fetcher?: typeof fetch;
};

export function createKommoClient(options: KommoClientOptions) {
  const fetcher = options.fetcher ?? fetch;

  async function request<T>(input: ProxyRequestInput): Promise<T> {
    const requestConfig = buildKommoProxyRequest(input);
    const response = await fetcher(requestConfig.url, requestConfig.init);
    const payload = (await response.json()) as KommoProxyResponse<T>;

    if (!response.ok || !payload.success) {
      throw new Error(`Kommo proxy request failed with status ${payload.status}`);
    }
    return payload.data;
  }

  function mutate<T>(
    method: "POST" | "PATCH",
    path: string,
    body: unknown,
  ): Promise<T | DryRunMutation> {
    const normalizedPath = normalizePath(path);
    if (!options.allowExternalWrites) {
      return Promise.resolve({
        mode: "dry_run",
        method,
        path: normalizedPath,
        body,
      });
    }
    return request<T>({ secret: options.secret, method, path: normalizedPath, body });
  }

  return {
    getPipeline: (pipelineId: number) =>
      request<unknown>({
        secret: options.secret,
        method: "GET",
        path: `/leads/pipelines/${pipelineId}`,
      }),

    getLead: (leadId: number) =>
      request<unknown>({
        secret: options.secret,
        method: "GET",
        path: `/leads/${leadId}`,
        query: { with: "custom_fields_values" },
      }),

    findContacts: (query: string) =>
      request<unknown>({
        secret: options.secret,
        method: "GET",
        path: "/contacts",
        query: { query },
      }),

    listLeadTasks: (leadId: number) =>
      request<unknown>({
        secret: options.secret,
        method: "GET",
        path: "/tasks",
        query: { "filter[entity_id]": String(leadId) },
      }),

    updateLead: (leadId: number, body: unknown) =>
      mutate<unknown>("PATCH", `/leads/${leadId}`, body),

    updateContact: (contactId: number, body: unknown) =>
      mutate<unknown>("PATCH", `/contacts/${contactId}`, body),

    createTask: (body: unknown) => mutate<unknown>("POST", "/tasks", body),

    createNote: (leadId: number, body: unknown) =>
      mutate<unknown>("POST", `/leads/${leadId}/notes`, body),

    changeResponsible: (input: {
      leadId: number;
      contactId: number;
      userId: number;
    }) =>
      Promise.all([
        mutate<unknown>("PATCH", `/leads/${input.leadId}`, {
          responsible_user_id: input.userId,
        }),
        mutate<unknown>("PATCH", `/contacts/${input.contactId}`, {
          responsible_user_id: input.userId,
        }),
      ]),
  };
}
