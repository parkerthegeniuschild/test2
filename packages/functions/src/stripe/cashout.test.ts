import {
  IDS,
  fetchLegacyToken,
  makePath,
  removeAuth,
  request,
  validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { describe } from 'vitest';
import { AUTH, ROLE } from '@utils/constants';
import { payloadSchema, type IPayload } from './cashout';

const [PATH, PATH_DESCRIPTION] = makePath(
  (userId) => `/users/${userId}/stripe/cashout`,
  'userId',
  IDS.USER
);

const PAYLOAD: IPayload = {
  type: 'standard',
  amountCents: 420,
};

describe(`POST ${PATH_DESCRIPTION}`, () => {
  it(`should return 401 without auth token`, async () => {
    const { status } = await request.post(PATH, PAYLOAD, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it(`should succeed with a valid payload`, async () => {
    const { status, data } = await request.post(PATH, PAYLOAD);
    validationStatusCode(status);
    validateSchema(data, payloadSchema);
  });

  it(`should fail with a V0 token and valid payload`, async () => {
    const token = fetchLegacyToken(ROLE.PROVIDER);
    const { status } = await request.post(PATH, PAYLOAD, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${token}`,
        [AUTH.VERSION_HEADER]: AUTH.AUTH_VERSION_LEGACY,
      },
    });
    validationStatusCode(status, 403);
  });
});
