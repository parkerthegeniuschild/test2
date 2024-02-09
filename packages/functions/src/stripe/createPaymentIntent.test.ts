import {
  IDS,
  fetchV1Token,
  makePath,
  removeAuth,
  request,
  testRequester,
  validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { beforeAll, describe, it } from 'vitest';
import { AxiosInstance } from 'axios';
import { ROLE } from '@utils/constants';
import {
  CreatePaymentIntentResponseSchema,
  TCreatePaymentIntentRequest,
} from './open-api';

const buildPath = (jobId: string | number) => `/jobs/${jobId}/payment-intent`;

const jobId = IDS.JOB;
const [PATH, PATH_DESCRIPTION] = makePath(buildPath, 'jobId', jobId);

const payload: TCreatePaymentIntentRequest = { amount_cents: 9000 };

describe(`POST ${PATH_DESCRIPTION}`, () => {
  let providerRequest: AxiosInstance;
  let agentRequest: AxiosInstance;

  beforeAll(async () => {
    providerRequest = testRequester({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { Authorization: `Bearer ${await fetchV1Token(ROLE.PROVIDER)}` },
    });
    agentRequest = testRequester({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { Authorization: `Bearer ${await fetchV1Token(ROLE.AGENT)}` },
    });
  });

  it(`should return 401 without auth token`, async () => {
    const { status } = await request.post(PATH, payload, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it(`should return 403 for a provider`, async () => {
    const { status } = await providerRequest.post(PATH, payload);
    validationStatusCode(status, 403);
  });

  it(`should return 200 with correct data for an agent`, async () => {
    const { status, data } = await agentRequest.post(PATH, payload);
    validationStatusCode(status);
    validateSchema(data, CreatePaymentIntentResponseSchema);
  });
});
