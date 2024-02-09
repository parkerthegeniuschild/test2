import { useDb } from 'db/dbClient';
import {
  NewLegalDocumentVersion,
  legalDocumentVersions,
} from 'db/schema/legalDocumentVersions';
import {
  legalAgreements as legalAgreementsSchema,
  legalAgreementsRelations,
} from 'db/schema/legalAgreements';
import { NewLegalDocument, legalDocuments } from 'db/schema/legalDocuments';
import assert from 'node:assert/strict';
import { ApiHandler } from 'sst/node/api';
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/naming-convention
const LocalizedString = z.object({ 'en-US': z.string().nonempty() });

const ContentfulNodeBase = z.object({
  nodeType: z.string().nonempty(),
  data: z.record(z.string().nonempty()),
  marks: z.array(z.unknown()).optional(),
  value: z.string().nonempty().optional(),
});

type ContentfulNode = z.infer<typeof ContentfulNodeBase> & {
  content?: ContentfulNode[];
};

const ContentfulNode: z.ZodType<ContentfulNode> = ContentfulNodeBase.extend({
  content: z.lazy(() => z.array(ContentfulNode).optional()),
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const LocalizedNode = z.object({ 'en-US': ContentfulNode });

const Payload = z.object({
  entryId: z.string().nonempty(),
  contentType: z.string().nonempty(), // improve to enum
  revision: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  title: z.string().nonempty(),
  fields: z.object({
    title: LocalizedString,
    slug: LocalizedString,
    legalText: LocalizedNode,
  }),
});

const db = useDb({
  legalAgreements: legalAgreementsSchema,
  legalAgreementsRelations,
});

export const handler = ApiHandler(async (e) => {
  const { body } = e;
  assert.ok(body);
  const {
    entryId,
    contentType,
    revision,
    updatedAt,
    title,
    fields: { legalText },
  } = Payload.parse(JSON.parse(body));
  const date = new Date(updatedAt);

  const document: NewLegalDocument = {
    id: entryId,
    createdBy: 'webhook',
    updatedBy: 'webhook',
    updatedAt: date,
    title,
    revision,
    publishedAt: date,
    legalText: JSON.stringify(legalText),
  };

  const documentVersion: NewLegalDocumentVersion = {
    legalDocumentId: entryId,
    createdBy: 'webhook',
    updatedBy: 'webhook',
    updatedAt: date,
    revision,
    publishedAt: date,
    contentfulId: entryId,
    contentfulContentType: contentType,
  };

  await db.transaction(async (tx) => {
    await tx
      .insert(legalDocuments)
      .values(document)
      .onConflictDoUpdate({ target: legalDocuments.id, set: document });
    await tx.insert(legalDocumentVersions).values(documentVersion);
  });
});
