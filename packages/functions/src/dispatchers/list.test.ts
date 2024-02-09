import 'vitest';
import {
  ApiParams,
  removeAuth,
  request,
  validateList,
  validatePaginationData,
  validateSchema,
  validateSort,
  validationStatusCode,
} from '@tests/helpers';
import { dispatchers as dispatchersSchema } from 'db/schema/dispatchers';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const validationSchema = createSelectSchema(dispatchersSchema, {
  created_at: z.string().transform((str) => new Date(str)),
  updated_at: z.string().transform((str) => new Date(str)),
  company_id: z.number().nullable(),
});

describe('GET /dispatchers', () => {
  it("should return 401 code when doesn't have auth token", async () => {
    const { status } = await request.get('/dispatchers', {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it('should return a list of dispatchers with success', async () => {
    const { status, data } = await request.get('/dispatchers');
    validationStatusCode(status);
    validateList(data);
    validateSchema(data.data[0], validationSchema);
  });

  it('should return a list of dispatchers with success when pass joins, sort and order params', async () => {
    const params = {
      joins: 'jobs,company',
      sort: 'id',
      order: 'asc',
      size: 5,
      page: 2,
    } satisfies ApiParams;

    const { status, data } = await request.get('/dispatchers', { params });

    validationStatusCode(status);
    validateList(data);
    validateSchema(data.data[0], validationSchema);
    validatePaginationData(data, params);
    validateSort(data.data, params.sort, params.order);
  });
});
