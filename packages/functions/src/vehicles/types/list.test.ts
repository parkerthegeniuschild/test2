import 'vitest';
import {
  fetchAuthHeader,
  removeAuth,
  request,
  validationStatusCode,
} from '@tests/helpers';
import { ROLE } from '@utils/constants';
import { ListVehicleTypesResponseSchema } from './open-api';

const PATH = '/vehicles/types';

describe(`GET ${PATH}`, () => {
  it('should return 401 code when requested without auth token', async () => {
    const { status } = await request.get(PATH, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it('agent can list vehicle types', async () => {
    const { status, data } = await request.get(PATH, {
      headers: await fetchAuthHeader(ROLE.AGENT),
    });
    validationStatusCode(status);
    ListVehicleTypesResponseSchema.parse(data);
  });

  it('provider can list vehicle types', async () => {
    const { status, data } = await request.get(PATH, {
      headers: await fetchAuthHeader(ROLE.PROVIDER),
    });
    validationStatusCode(status);
    ListVehicleTypesResponseSchema.parse(data);
  });
});
