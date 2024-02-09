import 'vitest';
import {
  fetchAuthHeader,
  removeAuth,
  testRequester,
  validateList,
  validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { createSelectSchema } from 'drizzle-zod';
import { providers as providersSchema } from 'db/schema/providers';
import { ROLE } from '@utils/constants';
import { AxiosInstance } from 'axios';
import { z } from 'zod';

const PATH = '/providers';

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

describe(`GET ${PATH}`, () => {
  let tester: AxiosInstance;
  beforeAll(async () => {
    tester = testRequester({ headers: await fetchAuthHeader(ROLE.AGENT) });
  });

  it(`should return 401 when missing auth token`, async () => {
    const { status } = await tester.get(PATH, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it(`should return 403 when called by a provider`, async () => {
    const { status } = await tester.get(PATH, {
      headers: await fetchAuthHeader(ROLE.PROVIDER),
    });
    validationStatusCode(status, 403);
  });

  it(`should return 200 when called by an agent`, async () => {
    const { status } = await tester.get(PATH, {
      headers: await fetchAuthHeader(ROLE.AGENT),
    });
    validationStatusCode(status);
  });

  it('should return a list of providers with success', async () => {
    const { status, data } = await tester.get(PATH);
    validationStatusCode(status);
    validateList(data, 'providers');

    data.providers.map((provider: unknown) =>
      validateSchema(provider, validationSchema, true)
    );
  });

  const JOINS = `completedJobsCount,acceptedRate`;
  const joinsValidationSchema = validationSchema.extend({
    completedJobsCount: z.number().int().nonnegative(),
    acceptedRate: z.number().gte(0).lte(1).optional(),
  });
  it(`should return a list of providers with joins: ${JOINS}`, async () => {
    const { status, data } = await tester.get(PATH, {
      params: { joins: JOINS },
    });
    validationStatusCode(status);
    validateList(data, 'providers');
    data.providers.map((provider: unknown) =>
      validateSchema(provider, joinsValidationSchema, true)
    );
  });
});
