CREATE TABLE `app_connections` (
	`request_id` text PRIMARY KEY NOT NULL,
	`challenge` text NOT NULL,
	`platform` text NOT NULL,
	`expires_at` integer NOT NULL,
	`user_id` text,
	`email` text
);
--> statement-breakpoint
CREATE TABLE `app_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`email` text,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `app_session_user_idx` ON `app_sessions` (`user_id`);