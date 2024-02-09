import { useDb } from 'db/dbClient';
import {
  legalAgreements as legalAgreementsSchema,
  legalAgreementsRelations,
} from 'db/schema/legalAgreements';
import { eq } from 'drizzle-orm';
import assert from 'node:assert/strict';
import { ApiHandler } from 'sst/node/api';
import { transformEvent } from '@utils/helpers';
import { response } from '@utils/response';
import useContentful, {
  formatContentfulLegalDocument,
  isContentfulLegalDocument,
} from 'clients/contentful';

const db = useDb({
  legalAgreements: legalAgreementsSchema,
  legalAgreementsRelations,
});

// TODO restrict auth
export const handler = ApiHandler(async (e) => {
  const { id } = e.pathParameters || {};
  const providerId = id && parseInt(id, 10);
  assert.ok(providerId, `Invalid path`);

  const { paginate } = transformEvent(e, legalAgreementsSchema);

  const [legalAgreements, { items }] = await Promise.all([
    db
      .select()
      .from(legalAgreementsSchema)
      .where(eq(legalAgreementsSchema.providerId, providerId)),
    useContentful().getEntries({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'metadata.tags.sys.id[in]': ['userProvider'],
    }),
  ]);

  const documents = items
    .filter(isContentfulLegalDocument)
    .map(formatContentfulLegalDocument);
  // pretty sure contentful only gives us the latest version of a doc,
  // so we simply find docs that do not have a matching agreement
  const pendingLegalDocuments = documents.filter(
    (d) =>
      legalAgreements.findIndex(
        (l) =>
          `${l.legalDocumentId}` === d.id && l.documentRevisionNo === d.revision
      ) === -1
  );

  return response.success(
    paginate(pendingLegalDocuments, pendingLegalDocuments.length)
  );
});
