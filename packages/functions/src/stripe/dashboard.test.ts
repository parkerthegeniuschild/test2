import {
  makePath,
  removeAuth,
  request,
  validationStatusCode,
} from '@tests/helpers';
import { describe, expect, it } from 'vitest';
import { TEST_USER_ID } from './onboarding.test';

const buildPath = (userId: string | number) =>
  `/users/${userId}/stripe/dashboard`;

const [PATH, PATH_DESCRIPTION] = makePath(buildPath, 'userId', TEST_USER_ID);

describe(`POST ${PATH_DESCRIPTION}`, () => {
  it(`should return 401 without auth token`, async () => {
    const { status } = await request.post(PATH, undefined, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  // we should add some better flow coverage, isntead of just using a user that is already onboarded
  it(`should return a stripe dashboard url`, async () => {
    const { status, data } = await request.post(PATH);
    validationStatusCode(status);
    expect(data).toHaveProperty('url');
    expect(data.url).toBeTypeOf('string');
    expect(data.url).toContain('https://connect.stripe.com');
  });

  it(`should return 403 for wrong user`, async () => {
    const { status } = await request.post(buildPath(TEST_USER_ID + 1));
    validationStatusCode(status, 403);
  });
});
