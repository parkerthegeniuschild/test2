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
  (providerId: string | number) => `/providers/${providerId}/locations`,
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

  it(`should work with 'timeFrom' param`, async () => {
    const { status } = await fetchLocations(
      `${PATH}?timeFrom=${Date.now() - 60 * 60 * 1000}`
    );
    validationStatusCode(status);
  });

  it(`should work with 'timeTo' param`, async () => {
    const { status } = await fetchLocations(
      `${PATH}?timeTo=${Date.now() - 5 * 60 * 1000}`
    );
    validationStatusCode(status);
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
