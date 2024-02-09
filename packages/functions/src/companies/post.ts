import {
  createCompanySchema,
  companies as companiesSchema,
} from 'db/schema/companies';
import { ApiHandler } from 'sst/node/api';
import assert from 'node:assert';
import { useDb } from 'db/dbClient';
import { buildBy } from '@utils/helpers';
import { response } from '@utils/response';

export const handler = ApiHandler(async (_evt) => {
  assert.ok(_evt.body, 'Missing payload');
  const body = JSON.parse(_evt.body);

  const created_by = buildBy(_evt);

  const { id, created_at, ...company } = createCompanySchema.parse({
    ...body,
    created_by,
  });

  const insertedCompany = await useDb()
    .insert(companiesSchema)
    .values({ ...company })
    .returning();

  return response.success(insertedCompany);
});
