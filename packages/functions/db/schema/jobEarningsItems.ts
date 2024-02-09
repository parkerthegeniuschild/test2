import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  bigint,
  bigserial,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { jobs } from './jobs';
import { providers } from './providers';

export const jobEarningsItems = pgTable('job_earnings_item', {
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
  providerId: bigint('provider_id', { mode: 'number' })
    .notNull()
    .references((): AnyPgColumn => jobs.id, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }),
  description: text('description').notNull(),
  quantity: numeric('quantity').notNull(),
  unitPriceCents: integer('unit_price_cents').notNull(),
});

export const jobEarningsItemsRelations = relations(
  jobEarningsItems,
  ({ one }) => ({
    job: one(jobs, {
      fields: [jobEarningsItems.jobId],
      references: [jobs.id],
    }),
    provider: one(providers, {
      fields: [jobEarningsItems.providerId],
      references: [providers.id],
    }),
  })
);

export const createJobEarningsItemsSchema = createInsertSchema(
  jobEarningsItems,
  {
    quantity: z.number().positive().multipleOf(0.01),
  }
).pick({
  description: true,
  quantity: true,
  unitPriceCents: true,
  providerId: true,
  jobId: true,
  createdBy: true,
});

export type ICreateJobEarningsItemsSchema = z.infer<
  typeof createJobEarningsItemsSchema
>;

export const updateJobEarningsItemsSchema = createInsertSchema(
  jobEarningsItems,
  {
    quantity: z.number().positive().multipleOf(0.01),
  }
).pick({
  id: true,
  description: true,
  quantity: true,
  unitPriceCents: true,
  jobId: true,
  updatedBy: true,
});

export type IUpdateJobEarningsItemsSchema = z.infer<
  typeof updateJobEarningsItemsSchema
>;

export const selectJobEarningsItemsSchema =
  createSelectSchema(jobEarningsItems);
