CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`name` text NOT NULL,
	`active` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_path_unique` ON `projects` (`path`);--> statement-breakpoint
CREATE TABLE `prompts` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`source` text NOT NULL,
	`session_id` text,
	`cli_prompt_id` text,
	`text_masked` text NOT NULL,
	`word_count` integer NOT NULL,
	`status` text NOT NULL,
	`block_reason` text,
	`secret_types` text NOT NULL,
	`message` text,
	`score_total` real,
	`score_clareza` real,
	`score_onde_mexer` real,
	`score_o_que_fazer` real,
	`score_resultado` real,
	`jev_raw` text,
	`jev_model` text,
	`jev_failure` text,
	`input_tokens` integer,
	`output_tokens` integer,
	`latency_ms` integer,
	`final_decision` text NOT NULL,
	`hold_expires_at` text,
	`decided_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `prompts_project_created_idx` ON `prompts` (`project_id`,`created_at`);