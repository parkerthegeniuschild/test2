import {
  bigint,
  bigserial,
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { jobs } from './jobs';
import { jobVehicleContacts } from './jobVehicleContacts';
import { users } from './users';

export const dbJobPhotos = pgTable('job_photo', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdBy: varchar('created_by', { length: 256 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedBy: varchar('updated_by', { length: 256 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  jobId: bigint('job_id', { mode: 'number' })
    .notNull()
    .references(() => jobs.id),
  vehicleId: bigint('vehicle_id', { mode: 'number' })
    .notNull()
    .references(() => jobVehicleContacts.id),
  contentType: text('content_type').notNull(),
  contentEncoding: text('content_encoding'), // 'base64' | null
  url: text('url'), // #1 - if this is set it will be used as the url. This supports legacy data
  path: text('path'), // #2 - will be used if there is no url. This is intended to be the typical source
  filename: text('filename'),
  height: integer('height'),
  width: integer('width'),
  sourcePath: text('source_path'), // #3 will be used if there is no url and no path. This is used immediately after upload, before the image has been optimized.
  sourceHeight: integer('source_height'),
  sourceWidth: integer('source_width'),
  isOptimized: boolean('is_optimized'),
  userId: bigint('user_id', { mode: 'number' }).references(() => users.id), // the user that uploaded the image, may not exist for old records
  oldId: bigint('old_id', { mode: 'number' }),
});

export const jobPhotosRelations = relations(dbJobPhotos, ({ one }) => ({
  job: one(jobs, { fields: [dbJobPhotos.jobId], references: [jobs.id] }),
  vehicle: one(jobVehicleContacts, {
    fields: [dbJobPhotos.vehicleId],
    references: [jobVehicleContacts.id],
  }),
  user: one(users, { fields: [dbJobPhotos.userId], references: [users.id] }),
}));

export const createJobPhotoSchema = createInsertSchema(dbJobPhotos);

export const selectJobPhotoSchema = createSelectSchema(dbJobPhotos);
