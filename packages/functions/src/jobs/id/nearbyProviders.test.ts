import 'vitest';
import {
  IDS,
  fetchV1Token,
  removeAuth,
  request,
  validateList,
  validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { jobRequests as jobRequestsSchema } from 'db/schema/jobRequests';
import { z } from 'zod';
import { ROLE } from '@utils/constants';
import { AxiosRequestConfig } from 'axios';
import { createSelectSchema } from 'drizzle-zod';

const jobId = IDS.JOB;
let agentToken: string | null = null;
let transformRequestAgent: AxiosRequestConfig['transformRequest'] = () => {};

const jobRequestSelectSchema = createSelectSchema(jobRequestsSchema, {
  created_at: z.string(),
  updated_at: z.string(),
});

const validationSchema = z.object({
  id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  rating: z.string(),
  phone: z.string(),
  distance: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  is_onjob: z.boolean(),
  is_blocked: z.boolean(),
  is_unapproved: z.boolean(),
  is_online: z.boolean(),
  location_updated_at: z.string(),
  job_request: jobRequestSelectSchema,
});

describe('GET /jobs/{id}/nearby-providers', () => {
  beforeAll(async () => {
    agentToken = await fetchV1Token(ROLE.AGENT);
    transformRequestAgent = (_data, headers) => {
      // eslint-disable-next-line no-param-reassign
      headers.Authorization = `Bearer ${agentToken}`;
      return _data;
    };
  });

  it("should return 401 code when doesn't have auth token", async () => {
    const { status } = await request.get(`/jobs/${jobId}/nearby-providers`, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it('should return 404 error when not found a job', async () => {
    const { status } = await request.get(`/jobs/${jobId}0000`);
    validationStatusCode(status, 404);
  });

  it('should return the provider list with success when accessing as an agent', async () => {
    const { status, data } = await request.get(
      `/jobs/${jobId}/nearby-providers`,
      {
        transformRequest: transformRequestAgent,
      }
    );
    validationStatusCode(status);
    validateList(data);
    validateSchema(data.data[0], validationSchema, true);
  });
});
