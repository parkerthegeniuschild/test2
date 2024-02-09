import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { providers } from './providers';
import { jobs } from './jobs';

export const jobLabors = pgTable('job_labor', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdBy: varchar('created_by', { length: 256 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedBy: varchar('updated_by', { length: 256 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  providerId: bigint('provider_id', { mode: 'number' }).notNull(),
  jobId: bigint('job_id', { mode: 'number' }).notNull(),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
});

export const jobLaborsRelations = relations(jobLabors, ({ one }) => ({
  providers: one(providers, {
    fields: [jobLabors.providerId],
    references: [providers.id],
  }),
  jobs: one(jobs, { fields: [jobLabors.jobId], references: [jobs.id] }),
}));
