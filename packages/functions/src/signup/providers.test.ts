import {
  removeAuth,
  request,
  validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { describe } from 'vitest';
import {
  ProviderSignupResponseSchema,
  TProviderSignupRequestSchema,
} from './open-api';

const PATH = `/signup/providers`;
const PAYLOAD: TProviderSignupRequestSchema = {
  firstname: 'Trucky',
  lastname: 'McTester',
  email: 'trucky@truckup.com',
  phone: '12345678901',
};

const execute = (payload: unknown) =>
  request.post(PATH, payload, { transformRequest: removeAuth });

describe(`POST ${PATH}`, () => {
  it(`should succeed without auth`, async () => {
    const { status, data } = await execute(PAYLOAD);
    validationStatusCode(status);
    validateSchema(data, ProviderSignupResponseSchema, true);
  });

  it(`should reject an invalid phone number`, async () => {
    const { status } = await execute({ ...PAYLOAD, phone: '1337' });
    validationStatusCode(status, 400);
  });

  it(`should reject an invalid email`, async () => {
    const { status } = await execute({ ...PAYLOAD, email: 'foo@bar' });
    validationStatusCode(status, 400);
  });

  it(`should reject missing firstname`, async () => {
    const { status } = await execute({ ...PAYLOAD, firstname: undefined });
    validationStatusCode(status, 400);
  });

  it(`should reject missing lastname`, async () => {
    const { status } = await execute({ ...PAYLOAD, lastname: undefined });
    validationStatusCode(status, 400);
  });
});
