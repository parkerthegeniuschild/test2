import 'vitest';
import {
  ApiParams,
  request,
  validateList,
  validatePaginationData,
  validateSchema,
  validateSort,
  validationStatusCode,
} from '@tests/helpers';
import { companies as companiesSchema } from 'db/schema/companies';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const validationSchema = createSelectSchema(companiesSchema, {
  created_at: z.string().transform((str) => new Date(str)),
  updated_at: z.string().transform((str) => new Date(str)),
});

describe('GET /companies', () => {
  it("should return 401 code when doesn't have auth token", async () => {
    const { status } = await request.get('/companies', {
      transformRequest: (data, headers) => {
        // eslint-disable-next-line no-param-reassign
        delete headers.Authorization;
        return data;
      },
    });
    validationStatusCode(status, 401);
  });

  it('should return a list of companies with success', async () => {
    const { status, data } = await request.get('/companies');
    validationStatusCode(status);
    validateList(data);
    validateSchema(data.data[0], validationSchema);
  });

  it('should return a list of companies with success when pass joins, sort and order params', async () => {
    const params = {
      joins: 'completedJobsCount',
      sort: 'completedJobsCount',
      order: 'desc',
      size: 5,
      page: 2,
    } satisfies ApiParams;

    const { status, data } = await request.get('/companies', { params });

    validationStatusCode(status);
    validateList(data);

    const validationSchemaWithJobsCount = validationSchema.extend({
      completedJobsCount: z.number().gte(0),
    });

    validateSchema(data.data[0], validationSchemaWithJobsCount);
    validatePaginationData(data, params);
    validateSort(data.data, params.sort, params.order);
  });
});
