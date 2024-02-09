import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { enumFromConst } from '@utils/schema';
import { SentInvoiceStatus } from '@utils/constants';
import { jobInvoices } from './jobInvoices';
import { users } from './users';

export const sentInvoices = pgTable('sent_invoice', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdBy: varchar('created_by', { length: 256 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedBy: varchar('updated_by', { length: 256 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  jobInvoiceId: bigint('job_invoice_id', { mode: 'number' })
    .references(() => jobInvoices.id)
    .notNull(),
  emailFrom: varchar('email_from', { length: 256 }).notNull(),
  emailTo: varchar('email_to', { length: 256 }).notNull(),
  subject: varchar('subject', { length: 256 }).notNull(),
  body: varchar('body', { length: 256 }).notNull(),
  sentByUser: bigint('sent_by_user', { mode: 'number' })
    .references(() => users.id)
    .notNull(),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  status: varchar('status', {
    length: 256,
    enum: enumFromConst(SentInvoiceStatus).options,
  })
    .default(SentInvoiceStatus.GENERATING)
    .notNull(),
  filename: varchar('filename', { length: 256 }),
});

export const sentInvoicesRelations = relations(sentInvoices, ({ one }) => ({
  jobInvoice: one(jobInvoices, {
    fields: [sentInvoices.jobInvoiceId],
    references: [jobInvoices.id],
  }),
  user: one(users, {
    fields: [sentInvoices.sentByUser],
    references: [users.id],
  }),
}));
