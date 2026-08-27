import { describe, expect, it } from "vitest";
import { createLocalDatabase } from "../src/db/client";
import { createJobQueue } from "../src/worker/jobs";

describe("durable job idempotency", () => {
  it("cannot enqueue the same channel event action twice", () => {
    const database = createLocalDatabase(":memory:");
    database.$client.exec(`
      create table jobs (
        id text primary key,
        unique_key text not null unique,
        status text not null,
        payload text not null,
        attempts integer not null default 0,
        created_at integer not null,
        completed_at integer
      )
    `);
    const queue = createJobQueue(database, {
      now: () => new Date("2026-08-27T18:00:00Z"),
      createId: () => "job-1",
    });

    const first = queue.enqueue({
      channel: "instagram",
      eventId: "event-123",
      action: "reply",
      payload: { customerId: "customer-1" },
    });
    queue.complete(first.uniqueKey);
    const duplicate = queue.enqueue({
      channel: "instagram",
      eventId: "event-123",
      action: "reply",
      payload: { customerId: "customer-1" },
    });

    expect(first).toMatchObject({
      created: true,
      uniqueKey: "instagram:event-123:reply",
      status: "pending",
    });
    expect(duplicate).toMatchObject({
      created: false,
      uniqueKey: "instagram:event-123:reply",
      status: "completed",
    });
    expect(
      database.$client.prepare("select count(*) as total from jobs").get(),
    ).toEqual({ total: 1 });
    database.$client.close();
  });
});
