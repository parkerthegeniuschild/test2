import {
  dispatchers as dispatchersSchema,
  patchDispatcherSchema,
} from 'db/schema/dispatchers';
import { ApiHandler } from 'sst/node/api';
import assert from 'node:assert';
import { useDb } from 'db/dbClient';
import { eq } from 'drizzle-orm';
import { buildUpdatedProperties } from '@utils/helpers';
import { response } from '@utils/response';
import { ZodError } from 'zod';

export const handler = ApiHandler(async (_evt) => {
  assert.ok(_evt.body, 'Missing payload');
  const body = JSON.parse(_evt.body); // middy body parser
  const { id } = _evt.pathParameters || {};
  const { updated_by, updated_at } = buildUpdatedProperties(_evt);

  try {
    const { ...updates } = patchDispatcherSchema.parse({ ...body, updated_by });

    await useDb()
      .update(dispatchersSchema)
      .set({ ...updates, updated_at })
      .where(eq(dispatchersSchema.id, Number(id)));

    const dispatcher = await useDb()
      .select()
      .from(dispatchersSchema)
      .where(eq(dispatchersSchema.id, Number(id)));

    return dispatcher.length > 0
      ? response.success(dispatcher[0])
      : response.notFound();
  } catch (err) {
    if (err instanceof ZodError) return response.error(err.message);
    return response.failure();
  }
});
