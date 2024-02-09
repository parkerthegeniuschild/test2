import { relations } from 'drizzle-orm';
import { bigserial, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

import { jobs } from './jobs';

export const companies = pgTable('company', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  name: varchar('name', { length: 256 }).notNull(),
  phone: varchar('phone', { length: 256 }),
  email: varchar('email', { length: 256 }),
  usdot: varchar('usdot', { length: 256 }),
  type: varchar('type', { length: 256 }),
  address1: varchar('address1', { length: 256 }),
  address2: varchar('address2', { length: 256 }),
  city: varchar('city', { length: 256 }),
  state: varchar('state', { length: 100 }),
  zipcode: varchar('zipcode', { length: 20 }),
  country: varchar('country', { length: 80 }),
});

export const companiesRelations = relations(companies, ({ many }) => ({
  jobs: many(jobs),
}));

export const createCompanySchema = createInsertSchema(companies);
