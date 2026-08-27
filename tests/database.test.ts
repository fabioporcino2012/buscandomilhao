import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createLocalDatabase } from "../src/db/client";
import { executionTables } from "../src/db/schema";

describe("local execution ledger", () => {
  it("defines only the approved operational tables", () => {
    expect(executionTables.map(getTableName)).toEqual([
      "customer_identity",
      "channel_identity",
      "jobs",
      "messages",
      "decisions",
      "integration_health",
      "opt_out",
    ]);
  });

  it("opens an isolated SQLite database", () => {
    const database = createLocalDatabase(":memory:");
    const row = database.$client.prepare("select 1 as ok").get();

    expect(row).toEqual({ ok: 1 });
    database.$client.close();
  });
});
