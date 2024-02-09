/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'provider_location'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

/*
I think we can skip this constraint drop since it does not exist in the db
not sure if we need to handle more gracefully for a fresh DB instance
*/

-- ALTER TABLE "provider_location" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "provider_location" ALTER COLUMN "id" SET DATA TYPE bigint;