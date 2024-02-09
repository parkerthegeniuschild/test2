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

const db = useDb({
  legalAgreements: legalAgreementsSchema,
  legalAgreementsRelations,
});

// TODO restrict auth
export const handler = ApiHandler(async (e) => {
  const { id } = e.pathParameters || {};
  const providerId = id && parseInt(id, 10);
  assert.ok(providerId, `Invalid path`);

  const { paginate, size, offset, filter } = transformEvent(
    e,
    legalAgreementsSchema
  );

  // Cannot use default sort on this one because there is no "id" column
  const legalAgreements = await db
    .select()
    .from(legalAgreementsSchema)
    .where(filter(eq(legalAgreementsSchema.providerId, providerId)))
    .offset(offset)
    .limit(size);

  return response.success(paginate(legalAgreements, legalAgreements.length));
});
