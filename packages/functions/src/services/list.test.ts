import {
  removeAuth,
  request,
  validateList,
  validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { services } from 'db/schema/services';
import { createSelectSchema } from 'drizzle-zod';
import { describe } from 'vitest';
import { z } from 'zod';

const validationSchema = createSelectSchema(services, {
  created_at: z.string(),
});

const PATH = '/services';

describe(`GET ${PATH}`, () => {
  it('should return 401 for missing token', async () => {
    const { status } = await request.get(PATH, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it('should return a list of services', async () => {
    const { status, data } = await request.get(PATH);
    validationStatusCode(status);
    validateList(data);
    validateSchema(data.data[0], validationSchema, true);
  });
});
