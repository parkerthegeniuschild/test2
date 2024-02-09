CREATE TABLE IF NOT EXISTS "stripe_account" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(256),
	"updated_at" timestamp with time zone,
	"app_user_id" bigint NOT NULL,
	"account_num" varchar NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "stripe_account_uk" ON "stripe_account" USING btree ("app_user_id","account_num");--> statement-breakpoint
ALTER TABLE "stripe_account" DROP CONSTRAINT IF EXISTS "fk_stripe_account_app_user_id";--> statement-breakpoint
ALTER TABLE "stripe_account" ADD CONSTRAINT "stripe_account_app_user_id_app_user_id_fk" FOREIGN KEY ("app_user_id") REFERENCES "app_user"("id") ON DELETE no action ON UPDATE no action;
