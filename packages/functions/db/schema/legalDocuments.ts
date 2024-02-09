import { InferModel } from 'drizzle-orm';
import {
  bigserial,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const legalDocuments = pgTable('legalDocument', {
  id: varchar('id', { length: 32 }).primaryKey(),
  createdBy: varchar('createdBy', { length: 256 }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedBy: varchar('updatedBy', { length: 256 }),
  updatedAt: timestamp('updatedAt', { withTimezone: true }),
  title: varchar('title', { length: 256 }).notNull(),
  revision: bigserial('revision', { mode: 'number' }),
  publishedAt: timestamp('publishedAt', { withTimezone: true }),
  legalText: text('legalText'),
});

export type LegalDocument = InferModel<typeof legalDocuments>;
export type NewLegalDocument = InferModel<typeof legalDocuments, 'insert'>;
