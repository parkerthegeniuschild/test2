import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  index,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

/* eslint-disable import/no-cycle */
import { jobs } from './jobs';
import { jobVehicleContacts } from './jobVehicleContacts';
import { users } from './users';
/* eslint-enable import/no-cycle */

export const dbJobComments = pgTable(
  'job_vehicle_comment',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    createdBy: varchar('created_by', { length: 256 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedBy: varchar('updated_by', { length: 256 }),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
    // this is the timestamp of the last time the text was edited
    editedAt: timestamp('edited_at', { withTimezone: true }),
    jobId: bigint('job_id', { mode: 'number' })
      .notNull()
      .references(() => jobs.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    vehicleId: bigint('vehicle_id', { mode: 'number' })
      .notNull()
      .references(() => jobVehicleContacts.id),
    userId: bigint('user_id', { mode: 'number' })
      .notNull()
      .references(() => users.id, {
        onUpdate: 'cascade',
      }),
    role: varchar('role', { length: 32 }).notNull(),
    text: text('text').notNull(),
  },
  (table) => ({
    idxJobId: index('idx_job_vehicle_comment_job_id').on(table.jobId),
  })
);

export const jobCommentsRelations = relations(dbJobComments, ({ one }) => ({
  job: one(jobs, { fields: [dbJobComments.jobId], references: [jobs.id] }),
  vehicle: one(jobVehicleContacts, {
    fields: [dbJobComments.vehicleId],
    references: [jobVehicleContacts.id],
  }),
  user: one(users, {
    fields: [dbJobComments.userId],
    references: [users.id],
  }),
}));

export const createJobCommentSchema = createInsertSchema(dbJobComments);

export const selectJobCommentSchema = createSelectSchema(dbJobComments);
