import { InferModel, relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { legalDocuments } from './legalDocuments';

export const legalDocumentVersions = pgTable(
  'legalDocumentVersion',
  {
    legalDocumentId: varchar('legalDocumentId', { length: 32 }).notNull(),
    createdBy: varchar('createdBy', { length: 256 }).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedBy: varchar('updatedBy', { length: 256 }),
    updatedAt: timestamp('updatedAt', { withTimezone: true }),
    revision: integer('revision').notNull(),
    publishedAt: timestamp('publishedAt', { withTimezone: true }).notNull(),
    contentfulId: varchar('contentfulId', { length: 32 }).notNull(),
    contentfulContentType: varchar('contentfulContentType', {
      length: 256,
    }).notNull(),
  },
  (t) => ({ pk: primaryKey(t.legalDocumentId, t.revision) })
);

export type LegalDocumentVersion = InferModel<typeof legalDocumentVersions>;
export type NewLegalDocumentVersion = InferModel<
  typeof legalDocumentVersions,
  'insert'
>;

export const legalDocumentVersionsRelations = relations(
  legalDocumentVersions,
  ({ one }) => ({
    legalDocuments: one(legalDocuments, {
      fields: [legalDocumentVersions.legalDocumentId],
      references: [legalDocuments.id],
    }),
  })
);
