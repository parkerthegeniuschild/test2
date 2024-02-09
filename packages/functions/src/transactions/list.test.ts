import {
  IDS,
  fetchAuthHeader,
  removeAuth,
  testRequester,
  validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { describe, expect } from 'vitest';
import { ROLE } from '@utils/constants';
import { uniq } from 'lodash';
import { ListTransactionsResponseSchema } from './open-api';

const PATH = '/transactions';

describe(`GET ${PATH}`, async () => {
  const agentRequest = testRequester({
    headers: await fetchAuthHeader(ROLE.AGENT),
  });
  const providerRequest = testRequester({
    headers: await fetchAuthHeader(ROLE.PROVIDER),
  });

  it('should return 401 for missing token', async () => {
    const { status } = await providerRequest.get(PATH, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it(`as a provider, should return a list of provider's transactions`, async () => {
    const result = await providerRequest.get(PATH);
    validationStatusCode(result.status);
    const { data } = validateSchema(
      result.data,
      ListTransactionsResponseSchema,
      true
    );
    expect(data.length).toBeGreaterThanOrEqual(1);
    data.map((e) => expect(e.provider_id).toBe(IDS.PROVIDER));
  });

  it(`as an agent, should return a list of all transactions`, async () => {
    const result = await agentRequest.get(PATH);
    validationStatusCode(result.status);
    const { data } = validateSchema(
      result.data,
      ListTransactionsResponseSchema,
      true
    );
    expect(data.length).toBeGreaterThan(1);
    const providerIds = uniq(data.map((e) => e.provider_id));
    expect(providerIds.length).toBeGreaterThan(1);
  });
});
