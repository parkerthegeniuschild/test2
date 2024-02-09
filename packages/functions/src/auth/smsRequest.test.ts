import { z } from 'zod';
import {
  PHONES,
  removeAuth,
  request,
  sleep,
  validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { AUTH, ERROR } from '@utils/constants';
import { describe } from 'vitest';

const REQUEST = `/auth/sms?phone=${AUTH.MOCK_PHONE}`;
const NO_PROVIDER_REQUEST = `/auth/sms?phone=19999999999`;
const NOT_APPROVED_REQUEST = `/auth/sms?phone=${PHONES.PROVIDER_UNAPPROVED}`;
const BAD_REQUEST = `/auth/sms?phone=1337`;

describe('GET /auth/sms', () => {
  it('should succeed for valid provider phone number', async () => {
    const { status } = await request.get(REQUEST);
    validationStatusCode(status);
  });

  it(
    'should succeed without an Authorization header',
    async () => {
      // TODO we get rate limited if we don't wait
      // we need to find a better way to deal with this
      // the difficulty is because we can't mock the
      // lambda execution the way we currently test
      await sleep(AUTH.REQUEST_TIMEOUT);
      const { status } = await request.get(REQUEST, {
        transformRequest: removeAuth,
      });
      validationStatusCode(status);
    },
    AUTH.REQUEST_TIMEOUT + 5000
  );

  it(`should return 400 with code '${ERROR.notApproved}' for a disabled provider`, async () => {
    const { status, data } = await request.get(NOT_APPROVED_REQUEST);
    validationStatusCode(status, 400);
    validateSchema(data, z.object({ code: z.literal(ERROR.notApproved) }));
  });

  it('should return 404 for a phone number not registered in the system', async () => {
    const { status } = await request.get(NO_PROVIDER_REQUEST);
    validationStatusCode(status, 404);
  });

  it('should return 429 for exceeding rate limit', async () => {
    await request.get(REQUEST);
    const { status } = await request.get(REQUEST);
    validationStatusCode(status, 429);
  });

  it('should fail for an invalid phone number', async () => {
    const { status } = await request.get(BAD_REQUEST);
    validationStatusCode(status, 500);
  });
});
