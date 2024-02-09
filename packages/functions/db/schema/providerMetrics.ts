import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { providers } from './providers';

export const providerMetrics = pgTable('provider_metric', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  provider_id: bigint('provider_id', { mode: 'number' }).notNull(),
  metric_id: bigint('metric_id', { mode: 'number' }).notNull(),
});

export const providerMetricsRelations = relations(
  providerMetrics,
  ({ one }) => ({
    providers: one(providers, {
      fields: [providerMetrics.provider_id],
      references: [providers.id],
    }),
  })
);
