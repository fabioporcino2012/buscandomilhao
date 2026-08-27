import { randomUUID } from "node:crypto";
import type { createLocalDatabase } from "../db/client";

type LocalDatabase = ReturnType<typeof createLocalDatabase>;

type JobInput = {
  channel: string;
  eventId: string;
  action: string;
  payload: Record<string, unknown>;
};

type JobResult = {
  created: boolean;
  uniqueKey: string;
  status: string;
};

type JobQueueDependencies = {
  now?: () => Date;
  createId?: () => string;
};

export function createJobQueue(
  database: LocalDatabase,
  dependencies: JobQueueDependencies = {},
) {
  const now = dependencies.now ?? (() => new Date());
  const createId = dependencies.createId ?? randomUUID;

  return {
    enqueue(input: JobInput): JobResult {
      const uniqueKey = `${input.channel}:${input.eventId}:${input.action}`;
      const result = database.$client
        .prepare(
          `insert or ignore into jobs
            (id, unique_key, status, payload, attempts, created_at)
           values (?, ?, 'pending', ?, 0, ?)`,
        )
        .run(
          createId(),
          uniqueKey,
          JSON.stringify(input.payload),
          now().getTime(),
        );
      const row = database.$client
        .prepare("select status from jobs where unique_key = ?")
        .get(uniqueKey) as { status: string };

      return {
        created: result.changes === 1,
        uniqueKey,
        status: row.status,
      };
    },

    complete(uniqueKey: string): void {
      database.$client
        .prepare(
          "update jobs set status = 'completed', completed_at = ? where unique_key = ?",
        )
        .run(now().getTime(), uniqueKey);
    },
  };
}
