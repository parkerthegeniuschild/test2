import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { jobs } from './jobs';
import { sentInvoices } from './sentInvoices';

export const jobInvoices = pgTable(
  'job_invoice',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    createdBy: varchar('created_by', { length: 256 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedBy: varchar('updated_by', { length: 256 }),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
    jobId: bigint('job_id', { mode: 'number' })
      .references(() => jobs.id)
      .notNull(),
  },
  (table) => ({
    // This unique index will be removed in future when enabling multiple invoice
    jobIdIndex: uniqueIndex('job_id_unique').on(table.jobId),
  })
);

export const jobInvoicesRelations = relations(jobInvoices, ({ many, one }) => ({
  job: one(jobs, {
    fields: [jobInvoices.jobId],
    references: [jobs.id],
  }),
  sentInvoices: many(sentInvoices),
}));
