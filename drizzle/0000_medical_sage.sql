CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rsvps` (
	`event_id` text NOT NULL,
	`user_id` text NOT NULL,
	`display_name` text NOT NULL,
	`status` text NOT NULL,
	`guests` integer DEFAULT 0 NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`event_id`, `user_id`)
);
--> statement-breakpoint
CREATE INDEX `rsvp_user_idx` ON `rsvps` (`user_id`);