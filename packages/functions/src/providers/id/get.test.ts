import 'vitest';
import {
  IDS,
  removeAuth,
  request,
  validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { createSelectSchema } from 'drizzle-zod';
import { providers as providersSchema } from 'db/schema/providers';

const providerId = IDS.PROVIDER;

describe('GET /providers/{providerId}', () => {
  it("should return 401 code when doesn't have auth token", async () => {
    const { status } = await request.get(`/providers/${providerId}`, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it('should return the provider with success', async () => {
    const { status, data } = await request.get(`/providers/${providerId}`);
    validationStatusCode(status);

    const validationSchema = createSelectSchema(providersSchema).pick({
      id: true,
      firstname: true,
      lastname: true,
      phone: true,
      email: true,
      balance: true,
      is_blocked: true,
      is_unapproved: true,
      is_online: true,
      notifications: true,
      location_precise: true,
      location_always: true,
    });

    validateSchema(data, validationSchema, true);

    expect(data.id).toBe(providerId);
  });
});
