import {
  IDS,
  fetchAuthHeader,
  makePath,
  removeAuth,
  testRequester,
  validateList,
  validatePaginationData,
  //   validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { ROLE } from '@utils/constants';
import { AxiosInstance } from 'axios';
import { describe, it } from 'vitest';

const [PATH, PATH_DESC] = makePath(
  (providerId: string | number) => `/providers/${providerId}/recent-locations`,
  'providerId',
  IDS.PROVIDER
);

describe(`GET ${PATH_DESC}`, () => {
  let fetchLocations: AxiosInstance;
  beforeAll(async () => {
    fetchLocations = testRequester({
      headers: await fetchAuthHeader(ROLE.PROVIDER),
    });
  });

  it(`should return 401 without auth token`, async () => {
    const { status } = await fetchLocations(PATH, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it.skip(`should return the correct payload`, async () => {
    // TODO need to implement this test, but we don't have valid test data yet
    const { status, data } = await fetchLocations(PATH);
    validationStatusCode(status);
    validateList(data);
    validatePaginationData(data);
    // validateSchema(data.data[0], locationSchema);
  });
});
