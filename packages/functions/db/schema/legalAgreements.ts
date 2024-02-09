import { InferModel, relations, sql } from 'drizzle-orm';
import {
  bigint,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
} from 'drizzle-orm/pg-core';
import { geospatialPointTemp, timestampInt } from '../pgTypes';

import { providers } from './providers';
import { legalDocuments } from './legalDocuments';

// there seems to be a bug with using pgEnum and DataAPI
export const agreementTypeEnum = pgEnum('agreementType', [
  'provider',
  'driver',
]);

export const legalAgreements = pgTable(
  'LegalAgreement',
  {
    createdAt: timestampInt('createdAt')
      .default(sql`ROUND(EXTRACT(EPOCH FROM current_timestamp) * 1000)`)
      .notNull(),
    acceptedAt: timestampInt('acceptedAt').notNull(),
    type: text('type').notNull(),
    providerId: bigint('providerId', { mode: 'number' }),
    driverId: bigint('driverId', { mode: 'number' }),
    documentPublishedAt: timestampInt('documentPublishedAt').notNull(),
    documentTitle: text('documentTitle').notNull(),
    documentType: text('documentType').notNull(),
    documentRevisionNo: integer('documentRevisionNo').notNull(),
    legalDocumentId: text('legalDocumentId').notNull(),
    location: geospatialPointTemp('locationTemp').notNull(),
    deviceIpAddress: text('deviceIpAddress').notNull(),
    deviceSystemVersion: text('deviceSystemVersion').notNull(),
    deviceSystemName: text('deviceSystemName').notNull(),
  },
  (t) => ({
    pk: primaryKey(t.providerId, t.legalDocumentId, t.documentRevisionNo),
  })
);

export type LegalAgreement = InferModel<typeof legalAgreements>;
export type NewLegalAgreement = InferModel<typeof legalAgreements, 'insert'>;

export const legalAgreementsRelations = relations(
  legalAgreements,
  ({ one }) => ({
    providers: one(providers, {
      fields: [legalAgreements.providerId],
      references: [providers.id],
    }),
    legalDocuments: one(legalDocuments, {
      fields: [legalAgreements.legalDocumentId],
      references: [legalDocuments.id],
    }),
  })
);
