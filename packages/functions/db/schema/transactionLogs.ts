import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  index,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

/* eslint-disable import/no-cycle */
import { enumFromConst } from '@utils/schema';
import { TransactionLogSource, TransactionLogType } from '@utils/constants';
import { jobs } from './jobs';
import { providers } from './providers';
/* eslint-enable import/no-cycle */

export const TransactionLogTypeEnum = enumFromConst(TransactionLogType);

export const TransactionLogSourceEnum = enumFromConst(TransactionLogSource);

export const dbTransactionLogs = pgTable(
  'transaction_log',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    createdBy: varchar('created_by', { length: 256 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedBy: varchar('updated_by', { length: 256 }),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
    type: varchar('type', { enum: TransactionLogTypeEnum.options }).notNull(),
    source: varchar('source', {
      enum: TransactionLogSourceEnum.options,
    }).notNull(),
    balanceCents: bigint('balance_cents', { mode: 'number' }).notNull(),
    jobId: bigint('job_id', { mode: 'number' }).references(() => jobs.id, {
      onUpdate: 'cascade',
      onDelete: 'no action',
    }),
    providerId: bigint('provider_id', { mode: 'number' })
      .references(() => providers.id, {
        onUpdate: 'cascade',
        onDelete: 'no action',
      })
      .notNull(),
    amountCents: integer('amount_cents').notNull(),
    notes: varchar('notes'),
  },
  (table) => ({
    idxProviderId: index('idx_transaction_log_provider_id').on(
      table.providerId
    ),
  })
);

export const transactionLogsRelations = relations(
  dbTransactionLogs,
  ({ one }) => ({
    job: one(jobs, {
      fields: [dbTransactionLogs.jobId],
      references: [jobs.id],
    }),
    provider: one(providers, {
      fields: [dbTransactionLogs.providerId],
      references: [providers.id],
    }),
  })
);
