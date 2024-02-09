import {
  createDriverSchema,
  drivers as driversSchema,
} from 'db/schema/drivers';
import { ApiHandler } from 'sst/node/api';
import assert from 'node:assert';
import { useDb } from 'db/dbClient';
import { buildBy } from '@utils/helpers';
import { response } from '@utils/response';

export const handler = ApiHandler(async (_evt) => {
  assert.ok(_evt.body, 'Missing payload');
  const body = JSON.parse(_evt.body);

  const created_by = buildBy(_evt);

  const { id, created_at, ...driver } = createDriverSchema.parse({
    ...body,
    created_by,
  });

  const insertedDriver = await useDb()
    .insert(driversSchema)
    .values({ ...driver })
    .returning();

  return response.success(insertedDriver);
});
