import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  bigint,
  bigserial,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

/* eslint-disable import/no-cycle */
import { jobs } from './jobs';
/* eslint-enable import/no-cycle */

export const jobLeaveReason = pgTable('job_leave_reason', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  reason: varchar('reason', { length: 256 }).notNull(),
  job_id: bigint('job_id', { mode: 'number' })
    .notNull()
    .references((): AnyPgColumn => jobs.id, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }),
});

export const jobLeaveReasonRelations = relations(jobLeaveReason, ({ one }) => ({
  job: one(jobs, {
    fields: [jobLeaveReason.job_id],
    references: [jobs.id],
  }),
}));

export const createJobLeaveReasonSchema = createInsertSchema(jobLeaveReason, {
  id: (schema) => schema.id.optional(),
});

export const selectJobLeaveReasonSchema = createSelectSchema(jobLeaveReason);
