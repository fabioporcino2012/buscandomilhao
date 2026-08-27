import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamp = (name: string) => integer(name, { mode: "timestamp_ms" });

export const customerIdentity = sqliteTable(
  "customer_identity",
  {
    id: text("id").primaryKey(),
    phone: text("phone"),
    email: text("email"),
    kommoContactId: integer("kommo_contact_id"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("customer_identity_phone_unique").on(table.phone),
    uniqueIndex("customer_identity_email_unique").on(table.email),
    uniqueIndex("customer_identity_kommo_unique").on(table.kommoContactId),
  ],
);

export const channelIdentity = sqliteTable(
  "channel_identity",
  {
    id: text("id").primaryKey(),
    customerId: text("customer_id").notNull(),
    channel: text("channel").notNull(),
    externalId: text("external_id").notNull(),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("channel_identity_channel_external_unique").on(
      table.channel,
      table.externalId,
    ),
  ],
);

export const jobs = sqliteTable(
  "jobs",
  {
    id: text("id").primaryKey(),
    uniqueKey: text("unique_key").notNull(),
    status: text("status").notNull(),
    payload: text("payload", { mode: "json" }).notNull(),
    attempts: integer("attempts").notNull().default(0),
    createdAt: timestamp("created_at").notNull(),
    completedAt: timestamp("completed_at"),
  },
  (table) => [uniqueIndex("jobs_unique_key_unique").on(table.uniqueKey)],
);

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  customerId: text("customer_id"),
  channel: text("channel").notNull(),
  direction: text("direction").notNull(),
  externalEventId: text("external_event_id"),
  validationStatus: text("validation_status").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const decisions = sqliteTable("decisions", {
  id: text("id").primaryKey(),
  customerId: text("customer_id"),
  product: text("product").notNull(),
  action: text("action").notNull(),
  evidenceKeys: text("evidence_keys", { mode: "json" }).notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const integrationHealth = sqliteTable("integration_health", {
  integration: text("integration").primaryKey(),
  status: text("status").notNull(),
  details: text("details", { mode: "json" }),
  checkedAt: timestamp("checked_at").notNull(),
});

export const optOut = sqliteTable(
  "opt_out",
  {
    id: text("id").primaryKey(),
    customerId: text("customer_id").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [uniqueIndex("opt_out_customer_unique").on(table.customerId)],
);

export const executionTables = [
  customerIdentity,
  channelIdentity,
  jobs,
  messages,
  decisions,
  integrationHealth,
  optOut,
] as const;

export const schema = {
  customerIdentity,
  channelIdentity,
  jobs,
  messages,
  decisions,
  integrationHealth,
  optOut,
};
