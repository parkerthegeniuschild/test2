import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  bigint,
  bigserial,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

import { jobs } from './jobs';
import { companies } from './companies';

export const jobDrivers = pgTable('job_driver_contact', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  firstname: varchar('firstname', { length: 256 }).notNull(),
  lastname: varchar('lastname', { length: 256 }),
  phone: varchar('phone', { length: 256 }).notNull(),
  secondary_phone: varchar('secondary_phone', { length: 256 }),
  email: varchar('email', { length: 256 }),
  company_id: bigint('company_id', { mode: 'number' }),
  job_id: bigserial('job_id', { mode: 'number' })
    .notNull()
    .references((): AnyPgColumn => jobs.id, { onDelete: 'cascade' }),
  old_id: bigint('old_id', { mode: 'number' }),
});

export const jobDriversRelations = relations(jobDrivers, ({ one }) => ({
  job: one(jobs, {
    fields: [jobDrivers.job_id],
    references: [jobs.id],
  }),
  company: one(companies, {
    fields: [jobDrivers.company_id],
    references: [companies.id],
  }),
}));

export const createJobDriverSchema = createInsertSchema(jobDrivers);
