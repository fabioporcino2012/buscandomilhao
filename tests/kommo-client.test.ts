import { describe, expect, it } from "vitest";
import {
  KOMMO_PROXY_URL,
  buildKommoProxyRequest,
  createKommoClient,
} from "../src/integrations/kommo/client";

describe("guarded Kommo client", () => {
  it("routes every read through kommo-proxy-v2 with /api/v4", () => {
    expect(
      buildKommoProxyRequest({
        secret: "test-secret",
        method: "GET",
        path: "/leads/pipelines/13953440",
      }),
    ).toEqual({
      url: KOMMO_PROXY_URL,
      init: {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          secret: "test-secret",
          path: "/api/v4/leads/pipelines/13953440",
          method: "GET",
          query: {},
          body: {},
          paginate: false,
        }),
      },
    });
  });

  it("rejects direct Kommo URLs", () => {
    expect(() =>
      buildKommoProxyRequest({
        secret: "test-secret",
        method: "GET",
        path: "https://floridarentalcar2024.kommo.com/api/v4/leads/1",
      }),
    ).toThrow("direct Kommo URLs are forbidden");
  });

  it("returns a dry-run record without calling the network", async () => {
    let calls = 0;
    const client = createKommoClient({
      secret: "test-secret",
      allowExternalWrites: false,
      fetcher: async () => {
        calls += 1;
        return new Response();
      },
    });

    await expect(client.updateLead(123, { name: "Teste" })).resolves.toEqual({
      mode: "dry_run",
      method: "PATCH",
      path: "/api/v4/leads/123",
      body: { name: "Teste" },
    });
    expect(calls).toBe(0);
  });

  it("changes lead and contact ownership together", async () => {
    const paths: string[] = [];
    const client = createKommoClient({
      secret: "test-secret",
      allowExternalWrites: true,
      fetcher: async (_url, init) => {
        const request = JSON.parse(String(init?.body));
        paths.push(request.path);
        return Response.json({ success: true, status: 200, data: {} });
      },
    });

    await client.changeResponsible({ leadId: 10, contactId: 20, userId: 30 });

    expect(paths.sort()).toEqual(["/api/v4/contacts/20", "/api/v4/leads/10"]);
  });
});
