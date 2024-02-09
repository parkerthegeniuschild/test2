import { removeAuth, request, validationStatusCode } from '@tests/helpers';
import { AUTH } from '@utils/constants';
import { beforeEach, describe, expectTypeOf } from 'vitest';
import { Body } from './smsVerify';

const REQUEST = `/auth/sms`;
const PAYLOAD: Body = {
  phone: AUTH.MOCK_PHONE,
  code: AUTH.MOCK_OTP,
  challenge: AUTH.MOCK_CHALLENGE,
  deviceId: '123',
};
describe(`POST /auth/sms`, () => {
  beforeEach(async () => {
    // initiate auth request
    await request.get(`/auth/sms?phone=${AUTH.MOCK_PHONE}`);
  });

  afterEach(async () => {
    // clear previous auth attempt
    await request.post(REQUEST, PAYLOAD);
  });

  it('should succeed for valid phone, code, and challenge', async () => {
    const { status, data } = await request.post(REQUEST, PAYLOAD);
    validationStatusCode(status);
    expect(data).toHaveProperty('token');
    expectTypeOf(data.token).toBeString();
    await request.post(REQUEST, PAYLOAD);
  });

  it('should succeed without an Authorization header', async () => {
    const { status } = await request.post(REQUEST, PAYLOAD, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status);
  });

  it(`should fail the second time`, async () => {
    await request.post(REQUEST, PAYLOAD);
    const { status } = await request.post(REQUEST, PAYLOAD);
    validationStatusCode(status, 403);
  });

  it('should fail for an invalid code', async () => {
    const { status } = await request.post(REQUEST, {
      ...PAYLOAD,
      code: PAYLOAD.code + 1,
    });
    validationStatusCode(status, 403);
  });

  it(`should fail for an invalid challenge`, async () => {
    const { status } = await request.post(REQUEST, {
      ...PAYLOAD,
      challenge: PAYLOAD.challenge
        .split('')
        .map((e) => String.fromCharCode(e.charCodeAt(0) + 1))
        .join(''),
    });
    validationStatusCode(status, 403);
  });
});
