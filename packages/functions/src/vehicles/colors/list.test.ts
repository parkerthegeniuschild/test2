import 'vitest';
import {
  fetchAuthHeader,
  removeAuth,
  request,
  validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { ROLE } from '@utils/constants';
import { ListVehicleColorsResponseSchema } from './open-api';

const PATH = '/vehicles/colors';

describe(`GET ${PATH}`, () => {
  it('should return 401 code when requested without auth token', async () => {
    const { status } = await request.get(PATH, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it('agent can list vehicle colors', async () => {
    const { status, data } = await request.get(PATH, {
      headers: await fetchAuthHeader(ROLE.AGENT),
    });
    validationStatusCode(status);
    validateSchema(data, ListVehicleColorsResponseSchema, true);
  });

  it('provider can list vehicle colors', async () => {
    const { status, data } = await request.get(PATH, {
      headers: await fetchAuthHeader(ROLE.PROVIDER),
    });
    validationStatusCode(status);
    validateSchema(data, ListVehicleColorsResponseSchema, true);
  });
});
