import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { z } from 'zod';
import { companies } from './companies';
import { jobRequests } from './jobRequests';
import { jobs } from './jobs';
import { providerLocations } from './providerLocations';
import { providerMetrics } from './providerMetrics';
import { providerRates } from './providerRates';
import { providerServices } from './providerServices';
import { users } from './users';
import { stripeAccounts } from './stripeAccounts';
import { providerPositions } from './providerPositions';
import { serviceTimers } from './serviceTimers';
import { dbTransactionLogs } from './transactionLogs';

/* eslint-disable @typescript-eslint/naming-convention */
export const providers = pgTable('provider', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  firstname: text('firstname').notNull(),
  lastname: text('lastname').notNull(),
  company_id: bigint('company_id', { mode: 'number' }).references(
    () => companies.id
  ),
  address: text('address'),
  address_two: text('address_two'),
  city: text('city'),
  state: text('state'),
  zip: text('zip'),
  email: text('email'),
  phone: text('phone').notNull(),
  is_blocked: boolean('is_blocked').default(false).notNull(),
  is_unapproved: boolean('is_unapproved').default(false).notNull(),
  balance: numeric('balance').notNull().default('0'),
  status_change_date: timestamp('status_change_date', { withTimezone: true }),
  is_online: boolean('is_online').default(false).notNull(),
  app_user_id: bigint('app_user_id', { mode: 'number' })
    .references(() => users.id)
    .notNull(),
  provider_type: text('provider_type').notNull(),
  rating: numeric('rating').default('0.0').notNull(),
  firebase_uid: integer('firebase_uid'),
  location_precise: boolean('location_precise').default(false).notNull(),
  location_always: boolean('location_always').default(false).notNull(),
  notifications: boolean('notifications').default(false).notNull(),
  _version: integer('_version').notNull().default(1),
});

export const providersRelations = relations(providers, ({ one, many }) => ({
  users: one(users, {
    fields: [providers.app_user_id],
    references: [users.id],
  }),
  stripeAccounts: one(stripeAccounts, {
    fields: [providers.app_user_id],
    references: [stripeAccounts.userId],
  }),
  rates: one(providerRates, {
    fields: [providers.id],
    references: [providerRates.provider_id],
  }),
  services: one(providerServices, {
    fields: [providers.id],
    references: [providerServices.provider_id],
  }),
  metrics: one(providerMetrics, {
    fields: [providers.id],
    references: [providerMetrics.provider_id],
  }),
  locations: many(providerLocations),
  position: one(providerPositions, {
    fields: [providers.id],
    references: [providerPositions.id],
  }),
  jobs: many(jobs),
  jobRequests: many(jobRequests),
  companies: many(companies),
  serviceTimers: many(serviceTimers),
  transactionLogs: many(dbTransactionLogs),
}));

export const createProviderSchema = createInsertSchema(providers);

export const updateProviderSchema = createProviderSchema
  .extend({ updated_at: z.any() })
  .partial();

export const patchProviderAdminSchema = createProviderSchema
  .pick({
    firstname: true,
    lastname: true,
    address: true,
    city: true,
    state: true,
    zip: true,
    email: true,
    phone: true,
    is_blocked: true,
    is_unapproved: true,
    status_change_date: true,
    is_online: true,
    is_onjob: true,
    provider_type: true,
    rating: true,
    notifications: true,
    location_always: true,
    location_precise: true,
  })
  .partial()
  .strict();

export const patchProviderSchema = patchProviderAdminSchema
  .pick({
    is_online: true,
    notifications: true,
    location_always: true,
    location_precise: true,
  })
  .strict();

export const selectProviderSchema = createSelectSchema(providers);
