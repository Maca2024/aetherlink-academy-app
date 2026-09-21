CREATE SCHEMA "academy_curriculum";
--> statement-breakpoint
CREATE TABLE "academy_curriculum"."assignments" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"slide_id" uuid,
	"course_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"title" jsonb NOT NULL,
	"minutes" integer NOT NULL,
	"goal" jsonb,
	"steps" jsonb,
	"expected" text,
	"check" text,
	"checks" jsonb,
	"allowed" jsonb,
	"stop" text,
	"hints" jsonb,
	"stretch" text,
	"starter_path" text,
	"starter_files" jsonb,
	"lesson_ids" jsonb,
	"dataset" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "assignments_id_course_id_version_pk" PRIMARY KEY("id","course_id","version")
);
--> statement-breakpoint
CREATE TABLE "academy_curriculum"."chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid NOT NULL,
	"author_id" text NOT NULL,
	"author_role" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_curriculum"."chat_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid NOT NULL,
	"title" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_curriculum"."course_versions" (
	"course_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "course_versions_course_id_version_pk" PRIMARY KEY("course_id","version")
);
--> statement-breakpoint
CREATE TABLE "academy_curriculum"."courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" jsonb NOT NULL,
	"locale" text NOT NULL,
	"current_version" integer,
	"source_git_url" text NOT NULL,
	"source_commit" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_curriculum"."days" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"track_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"ordinal" integer NOT NULL,
	"kind" text NOT NULL,
	"title" jsonb NOT NULL,
	"ladder" jsonb,
	"schedule" jsonb,
	"checklist" jsonb,
	"guide_url" text,
	"participant_repo" text,
	"agent_repo" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "days_id_course_id_version_pk" PRIMARY KEY("id","course_id","version"),
	CONSTRAINT "days_ordinal_check" CHECK ("academy_curriculum"."days"."ordinal" between 1 and 7)
);
--> statement-breakpoint
CREATE TABLE "academy_curriculum"."facilitator_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid NOT NULL,
	"algorithm" text DEFAULT 'aes-256-gcm' NOT NULL,
	"cipher_text" text NOT NULL,
	"nonce" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "facilitator_credentials_room_id_unique" UNIQUE("room_id")
);
--> statement-breakpoint
CREATE TABLE "academy_curriculum"."follow_state" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid NOT NULL,
	"participant_id" text NOT NULL,
	"following" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "follow_state_room_participant_key" UNIQUE("room_id","participant_id")
);
--> statement-breakpoint
CREATE TABLE "academy_curriculum"."lessons" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"day_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"slug" text NOT NULL,
	"title" jsonb NOT NULL,
	"kicker" text,
	"mode" text NOT NULL,
	"duration_minutes" integer NOT NULL,
	"lede" jsonb,
	"loop" jsonb,
	"worked_example" text,
	"source" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lessons_id_course_id_version_pk" PRIMARY KEY("id","course_id","version"),
	CONSTRAINT "lessons_course_version_slug_key" UNIQUE("course_id","version","slug")
);
--> statement-breakpoint
CREATE TABLE "academy_curriculum"."presenter_state" (
	"room_id" uuid PRIMARY KEY NOT NULL,
	"slide_id" uuid NOT NULL,
	"slide_ordinal" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_curriculum"."progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid NOT NULL,
	"participant_id" text NOT NULL,
	"lesson_id" uuid NOT NULL,
	"slide_id" uuid,
	"status" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "progress_room_participant_lesson_key" UNIQUE("room_id","participant_id","lesson_id")
);
--> statement-breakpoint
CREATE TABLE "academy_curriculum"."quiz_questions" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"question" jsonb NOT NULL,
	"options" jsonb NOT NULL,
	"answer" integer NOT NULL,
	"source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quiz_questions_id_course_id_version_pk" PRIMARY KEY("id","course_id","version")
);
--> statement-breakpoint
CREATE TABLE "academy_curriculum"."rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"pinned_version" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_curriculum"."slides" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"ordinal" integer NOT NULL,
	"title" text NOT NULL,
	"kicker" text,
	"subtitle" text,
	"type" text NOT NULL,
	"layout" text,
	"cards" jsonb,
	"items" jsonb,
	"columns" jsonb,
	"steps" jsonb,
	"expected" text,
	"check" text,
	"timer" integer,
	"prompt" text,
	"tagline" text,
	"dark" boolean,
	"visual" jsonb,
	"image" text,
	"image_alt" text,
	"image_caption" text,
	"keep_cards" boolean,
	"mascot" boolean,
	"concepts" jsonb,
	"bars" jsonb,
	"plan_b" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "slides_id_course_id_version_pk" PRIMARY KEY("id","course_id","version"),
	CONSTRAINT "slides_course_version_lesson_ordinal_key" UNIQUE("course_id","version","lesson_id","ordinal"),
	CONSTRAINT "slides_ordinal_check" CHECK ("academy_curriculum"."slides"."ordinal" >= 1)
);
--> statement-breakpoint
CREATE TABLE "academy_curriculum"."tracks" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"ordinal" integer NOT NULL,
	"name" jsonb NOT NULL,
	"case_label" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tracks_id_course_id_version_pk" PRIMARY KEY("id","course_id","version"),
	CONSTRAINT "tracks_ordinal_check" CHECK ("academy_curriculum"."tracks"."ordinal" >= 1)
);
--> statement-breakpoint
ALTER TABLE "academy_curriculum"."assignments" ADD CONSTRAINT "assignments_lesson_id_course_id_version_lessons_id_course_id_version_fk" FOREIGN KEY ("lesson_id","course_id","version") REFERENCES "academy_curriculum"."lessons"("id","course_id","version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."assignments" ADD CONSTRAINT "assignments_slide_id_course_id_version_slides_id_course_id_version_fk" FOREIGN KEY ("slide_id","course_id","version") REFERENCES "academy_curriculum"."slides"("id","course_id","version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."assignments" ADD CONSTRAINT "assignments_course_id_version_course_versions_course_id_version_fk" FOREIGN KEY ("course_id","version") REFERENCES "academy_curriculum"."course_versions"("course_id","version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."chat_messages" ADD CONSTRAINT "chat_messages_thread_id_chat_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "academy_curriculum"."chat_threads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."chat_threads" ADD CONSTRAINT "chat_threads_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "academy_curriculum"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."course_versions" ADD CONSTRAINT "course_versions_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "academy_curriculum"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."courses" ADD CONSTRAINT "courses_current_version_fkey" FOREIGN KEY ("id","current_version") REFERENCES "academy_curriculum"."course_versions"("course_id","version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."days" ADD CONSTRAINT "days_track_id_course_id_version_tracks_id_course_id_version_fk" FOREIGN KEY ("track_id","course_id","version") REFERENCES "academy_curriculum"."tracks"("id","course_id","version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."days" ADD CONSTRAINT "days_course_id_version_course_versions_course_id_version_fk" FOREIGN KEY ("course_id","version") REFERENCES "academy_curriculum"."course_versions"("course_id","version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."facilitator_credentials" ADD CONSTRAINT "facilitator_credentials_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "academy_curriculum"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."follow_state" ADD CONSTRAINT "follow_state_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "academy_curriculum"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."lessons" ADD CONSTRAINT "lessons_day_id_course_id_version_days_id_course_id_version_fk" FOREIGN KEY ("day_id","course_id","version") REFERENCES "academy_curriculum"."days"("id","course_id","version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."lessons" ADD CONSTRAINT "lessons_course_id_version_course_versions_course_id_version_fk" FOREIGN KEY ("course_id","version") REFERENCES "academy_curriculum"."course_versions"("course_id","version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."presenter_state" ADD CONSTRAINT "presenter_state_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "academy_curriculum"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."progress" ADD CONSTRAINT "progress_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "academy_curriculum"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."quiz_questions" ADD CONSTRAINT "quiz_questions_lesson_id_course_id_version_lessons_id_course_id_version_fk" FOREIGN KEY ("lesson_id","course_id","version") REFERENCES "academy_curriculum"."lessons"("id","course_id","version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."quiz_questions" ADD CONSTRAINT "quiz_questions_course_id_version_course_versions_course_id_version_fk" FOREIGN KEY ("course_id","version") REFERENCES "academy_curriculum"."course_versions"("course_id","version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."rooms" ADD CONSTRAINT "rooms_course_id_pinned_version_course_versions_course_id_version_fk" FOREIGN KEY ("course_id","pinned_version") REFERENCES "academy_curriculum"."course_versions"("course_id","version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."slides" ADD CONSTRAINT "slides_lesson_id_course_id_version_lessons_id_course_id_version_fk" FOREIGN KEY ("lesson_id","course_id","version") REFERENCES "academy_curriculum"."lessons"("id","course_id","version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."slides" ADD CONSTRAINT "slides_course_id_version_course_versions_course_id_version_fk" FOREIGN KEY ("course_id","version") REFERENCES "academy_curriculum"."course_versions"("course_id","version") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_curriculum"."tracks" ADD CONSTRAINT "tracks_course_id_version_course_versions_course_id_version_fk" FOREIGN KEY ("course_id","version") REFERENCES "academy_curriculum"."course_versions"("course_id","version") ON DELETE no action ON UPDATE no action;
