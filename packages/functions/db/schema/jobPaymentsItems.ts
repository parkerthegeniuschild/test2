import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  bigint,
  bigserial,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import type { Enum } from '@utils/types';
import { PositiveIntScalar, enumFromConst } from '@utils/schema';
import { jobs } from './jobs';
import { providers } from './providers';

export const JobPaymentsItemPaymentMethod = {
  CASH: 'cash',
  CREDIT_CARD: 'credit_card',
  ZELLE: 'zelle',
  CASH_APP: 'cash_app',
  T_CHEK: 't_chek',
  CHECK: 'check',
  DISCOUNT: 'discount',
  COMCHEK: 'comchek',
  EFS_CHECK: 'efs_check',
} as const;
export type JobPaymentsItemPaymentMethod = Enum<
  typeof JobPaymentsItemPaymentMethod
>;
export const jobPaymentsItemPaymentMethodSchema = enumFromConst(
  JobPaymentsItemPaymentMethod
);

export const jobPaymentsItems = pgTable('job_payments_item', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdBy: varchar('created_by', { length: 256 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedBy: varchar('updated_by', { length: 256 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  jobId: bigint('job_id', { mode: 'number' })
    .notNull()
    .references((): AnyPgColumn => jobs.id, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }),
  amountCents: integer('amount_cents').notNull(),
  paymentMethod: varchar('payment_method', {
    length: 256,
    enum: jobPaymentsItemPaymentMethodSchema.options,
  }).notNull(),
  identifier: text('identifier').notNull(),
  stripePaymentId: text('stripe_payment_id').unique(),
  providerId: bigint('provider_id', { mode: 'number' }).references(
    (): AnyPgColumn => providers.id,
    {
      onUpdate: 'cascade',
      onDelete: 'set null',
    }
  ),
});

export const jobPaymentsItemsRelations = relations(
  jobPaymentsItems,
  ({ one }) => ({
    job: one(jobs, {
      fields: [jobPaymentsItems.jobId],
      references: [jobs.id],
    }),
    provider: one(providers, {
      fields: [jobPaymentsItems.providerId],
      references: [providers.id],
    }),
  })
);

export const createJobPaymentsItemsSchema = createInsertSchema(
  jobPaymentsItems,
  {
    amountCents: PositiveIntScalar,
  }
).pick({
  amountCents: true,
  paymentMethod: true,
  identifier: true,
  stripePaymentId: true,
  providerId: true,
  jobId: true,
  createdBy: true,
});

export type ICreateJobPaymentsItemsSchema = z.infer<
  typeof createJobPaymentsItemsSchema
>;

export const selectJobPaymentsItemsSchema =
  createSelectSchema(jobPaymentsItems);

export type ISelectJobPaymentsItemsSchema = z.infer<
  typeof selectJobPaymentsItemsSchema
>;

export const updateJobPaymentsItemsSchema = createInsertSchema(
  jobPaymentsItems,
  {
    amountCents: PositiveIntScalar,
  }
).pick({
  id: true,
  amountCents: true,
  identifier: true,
  paymentMethod: true,
  stripePaymentId: true,
  providerId: true,
  jobId: true,
  updatedBy: true,
});

export type IUpdateJobPaymentsItemsSchema = z.infer<
  typeof updateJobPaymentsItemsSchema
>;
