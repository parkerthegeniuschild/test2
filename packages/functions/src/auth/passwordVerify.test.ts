import {
  USERNAMES,
  removeAuth,
  request,
  validationStatusCode,
} from '@tests/helpers';
import { AxiosResponse } from 'axios';
import { Config } from 'sst/node/config';
import { describe, expectTypeOf } from 'vitest';

const PATH = `/auth/password`;
const PAYLOAD = {
  username: USERNAMES.AGENT,
  password: Config.TEST_AGENT_PASSWORD,
};

describe(`POST ${PATH}`, () => {
  it(`should return a token for valid credentials`, async () => {
    validateSuccess(await request.post(PATH, PAYLOAD));
  });

  it(`should return a token for valid credentials, without existing auth token`, async () => {
    validateSuccess(
      await request.post(PATH, PAYLOAD, { transformRequest: removeAuth })
    );
  });

  it(`should fail for invalid credentials`, async () => {
    validateFailure(
      await request.post(PATH, { ...PAYLOAD, password: PAYLOAD.password + 1 })
    );
  });
});

const validateSuccess = (response: AxiosResponse) => {
  const { status, data } = response;
  validationStatusCode(status);
  expectTypeOf(data).toBeObject();
  expect(data).toHaveProperty('token');
  expectTypeOf(data.property).toBeString();
};

const validateFailure = (response: AxiosResponse, statusCode = 403) => {
  const { status, data } = response;
  validationStatusCode(status, statusCode);
  expect(data).toBeFalsy();
};
