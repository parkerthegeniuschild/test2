import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  boolean,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { providers } from './providers';

export const providerServices = pgTable('provider_service', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  provider_id: bigint('provider_id', { mode: 'number' }).notNull(),
  service_id: bigint('service_id', { mode: 'number' }).notNull(),
  is_enabled: boolean('is_enabled').default(true).notNull(),
});

export const providerServicesRelations = relations(
  providerServices,
  ({ one }) => ({
    providers: one(providers, {
      fields: [providerServices.provider_id],
      references: [providers.id],
    }),
  })
);
