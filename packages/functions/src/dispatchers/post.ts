import {
  createDispatcherSchema,
  dispatchers as dispatchersSchema,
} from 'db/schema/dispatchers';
import { ApiHandler } from 'sst/node/api';
import assert from 'node:assert';
import { useDb } from 'db/dbClient';
import { buildBy } from '@utils/helpers';
import { response } from '@utils/response';
import { DISPATCHERS_TYPE_ID } from '@utils/constants';

export const handler = ApiHandler(async (_evt) => {
  assert.ok(_evt.body, 'Missing payload');
  const body = JSON.parse(_evt.body);

  const created_by = buildBy(_evt);

  const { id, created_at, ...dispatcher } = createDispatcherSchema.parse({
    ...body,
    type_id: DISPATCHERS_TYPE_ID,
    created_by,
  });

  const insertedDispatcher = await useDb()
    .insert(dispatchersSchema)
    .values({ ...dispatcher })
    .returning();

  return response.success(insertedDispatcher);
});
