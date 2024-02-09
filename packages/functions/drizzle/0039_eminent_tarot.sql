ALTER TABLE "sent_invoice" RENAME COLUMN "sent_by_id" TO "sent_by_user";--> statement-breakpoint
ALTER TABLE "sent_invoice" RENAME COLUMN "file" TO "filename";--> statement-breakpoint
ALTER TABLE "sent_invoice" DROP CONSTRAINT "sent_invoice_sent_by_id_app_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sent_invoice" ADD CONSTRAINT "sent_invoice_sent_by_user_app_user_id_fk" FOREIGN KEY ("sent_by_user") REFERENCES "app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
