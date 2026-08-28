CREATE TABLE `channel_identity` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`channel` text NOT NULL,
	`external_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `channel_identity_channel_external_unique` ON `channel_identity` (`channel`,`external_id`);--> statement-breakpoint
CREATE TABLE `customer_identity` (
	`id` text PRIMARY KEY NOT NULL,
	`phone` text,
	`email` text,
	`kommo_contact_id` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_identity_phone_unique` ON `customer_identity` (`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `customer_identity_email_unique` ON `customer_identity` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `customer_identity_kommo_unique` ON `customer_identity` (`kommo_contact_id`);--> statement-breakpoint
CREATE TABLE `decisions` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text,
	`product` text NOT NULL,
	`action` text NOT NULL,
	`evidence_keys` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `integration_health` (
	`integration` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`details` text,
	`checked_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`unique_key` text NOT NULL,
	`status` text NOT NULL,
	`payload` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`completed_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `jobs_unique_key_unique` ON `jobs` (`unique_key`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text,
	`channel` text NOT NULL,
	`direction` text NOT NULL,
	`external_event_id` text,
	`validation_status` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `opt_out` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`reason` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `opt_out_customer_unique` ON `opt_out` (`customer_id`);