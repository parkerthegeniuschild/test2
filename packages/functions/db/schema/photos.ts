import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  bigint,
  bigserial,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

/* eslint-disable import/no-cycle */
import { jobVehicleServices } from './JobVehicleServices';
/* eslint-enable import/no-cycle */

/** @deprecated */
export const photos = pgTable(
  'job_vehicle_service_photo',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    created_by: varchar('created_by', { length: 256 }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_by: varchar('updated_by', { length: 256 }),
    updated_at: timestamp('updated_at', { withTimezone: true }),
    job_vehicle_service_id: bigint('job_vehicle_service_id', {
      mode: 'number',
    })
      .notNull()
      .references((): AnyPgColumn => jobVehicleServices.id),
    content_type: varchar('content_type', { length: 256 }).notNull(),
    url: varchar('url', { length: 256 }).notNull(),
    filename: varchar('filename', { length: 256 }).notNull(),
    order_num: integer('order_num').notNull().default(0),
  },
  (table) => ({
    job_photo_uk: uniqueIndex('job_photo_uk').on(table.job_vehicle_service_id),
  })
);

/** @deprecated */
export const photosRelations = relations(photos, ({ one }) => ({
  jobVehicleServices: one(jobVehicleServices, {
    fields: [photos.job_vehicle_service_id],
    references: [jobVehicleServices.id],
  }),
}));

/** @deprecated */
export const createPhotoSchema = createInsertSchema(photos);
