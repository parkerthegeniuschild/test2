import { response } from '@utils/response';
import { useDb } from 'db/dbClient';
import { legalAgreements } from 'db/schema/legalAgreements';
import { eq } from 'drizzle-orm';
import TupLambdaHandler from 'handlers/TupLambdaHandler';

const PROVIDER_ID = 138; // this is the default testing provider

export const handler = TupLambdaHandler(async () => {
  const res = await useDb({ legalAgreements })
    .delete(legalAgreements)
    .where(eq(legalAgreements.providerId, PROVIDER_ID))
    .returning();
  return response.success(res.length);
});
