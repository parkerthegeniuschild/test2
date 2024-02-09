CREATE TABLE IF NOT EXISTS "userOtp" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp,
	"modified" bigint NOT NULL,
	"hash" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userOtp" ADD CONSTRAINT "userOtp_id_app_user_id_fk" FOREIGN KEY ("id") REFERENCES "app_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
