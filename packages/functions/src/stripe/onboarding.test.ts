import {
  makePath,
  removeAuth,
  request,
  validationStatusCode,
} from '@tests/helpers';
import { describe, expect, it } from 'vitest';

export const TEST_USER_ID = 2;
const [PATH, PATH_DESCRIPTION] = makePath(
  (userId) => `/users/${userId}/stripe/onboarding`,
  'userId',
  TEST_USER_ID
);

describe(`POST ${PATH_DESCRIPTION}`, () => {
  it(`should return 401 without auth token`, async () => {
    const { status } = await request.post(PATH, undefined, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it(`should return a stripe onboarding url`, async () => {
    const { status, data } = await request.post(PATH);
    validationStatusCode(status);
    expect(data).toHaveProperty('url');
    expect(data.url).toBeTypeOf('string');
    expect(data.url).toContain('https://connect.stripe.com');
  });
});
