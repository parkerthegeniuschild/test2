import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  pgTable,
  timestamp,
  varchar,
  numeric,
} from 'drizzle-orm/pg-core';

import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { providers } from './providers';

export const providerRates = pgTable('provider_rate', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  provider_id: bigint('provider_id', { mode: 'number' }).notNull(),
  rate_id: bigint('rate_id', { mode: 'number' }).notNull(),
  value: numeric('value').notNull().default('0'),
});

export const providerRatesRelations = relations(providerRates, ({ one }) => ({
  providers: one(providers, {
    fields: [providerRates.provider_id],
    references: [providers.id],
  }),
}));

export const createProviderRateSchema = createInsertSchema(providerRates);

export type ICreateProviderRateSchema = z.infer<
  typeof createProviderRateSchema
>;
