const GRAPH_BASE = "https://graph.facebook.com/v25.0";

type MetaClientOptions = {
  token: string;
  allowExternalWrites: boolean;
  fetcher?: typeof fetch;
};

export function createMetaClient(options: MetaClientOptions) {
  const fetcher = options.fetcher ?? fetch;

  async function get<T>(path: string, params: Record<string, string>) {
    const url = new URL(`${GRAPH_BASE}/${path.replace(/^\//, "")}`);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    url.searchParams.set("access_token", options.token);

    const response = await fetcher(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Meta read failed with status ${response.status}`);
    }
    return (await response.json()) as T;
  }

  return {
    readPhoneHealth: (wabaId: string) =>
      get<unknown>(`${wabaId}/phone_numbers`, {
        fields:
          "id,display_phone_number,verified_name,quality_rating,code_verification_status,status,name_status",
      }),

    readTemplates: (wabaId: string) =>
      get<unknown>(`${wabaId}/message_templates`, {
        fields: "name,status,category,language,components,quality_score",
        limit: "100",
      }),

    sendWhatsAppText: async (_input: {
      phoneId: string;
      to: string;
      text: string;
    }) => {
      if (!options.allowExternalWrites) {
        return { mode: "dry_run", channel: "whatsapp" } as const;
      }
      throw new Error("live WhatsApp dispatch requires an authorized pilot");
    },
  };
}
