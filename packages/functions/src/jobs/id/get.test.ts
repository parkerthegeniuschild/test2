import 'vitest';
import {
  IDS,
  fetchV1Token,
  removeAuth,
  request,
  validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { createSelectSchema } from 'drizzle-zod';
import { jobs as jobsSchema } from 'db/schema/jobs';
import { providers as providersSchema } from 'db/schema/providers';
import { companies as companiesSchema } from 'db/schema/companies';
import { dispatchers as dispatchersSchema } from 'db/schema/dispatchers';
import { jobDrivers as jobDriversSchema } from 'db/schema/jobDrivers';
import { z } from 'zod';
import { ROLE } from '@utils/constants';
import { AxiosRequestConfig } from 'axios';
import { selectJobVehicleContactSchema } from 'db/schema/jobVehicleContacts';
import { selectJobVehicleContactServiceSchema } from 'db/schema/jobVehicleContactServices';
import { selectJobPhotoSchema } from 'db/schema/jobPhotos';

const jobId = IDS.JOB;
const jobId2 = IDS.JOB_SECOND;
const providerId = IDS.PROVIDER;
let agentToken: string | null = null;
let transformRequestAgent: AxiosRequestConfig['transformRequest'] = () => {};

const providerSelectSchema = createSelectSchema(providersSchema, {
  created_at: z.string(),
  updated_at: z.string().optional(),
  balance: z.number().optional(),
  rating: z.number().optional(),
});

const companySelectSchema = createSelectSchema(companiesSchema, {
  created_at: z.string(),
  updated_at: z.string().optional(),
});

const dispatcherSelectSchema = createSelectSchema(dispatchersSchema, {
  created_at: z.string(),
  updated_at: z.string().optional(),
});

const jobDriverSelectSchema = createSelectSchema(jobDriversSchema, {
  created_at: z.string(),
  updated_at: z.string().optional(),
});

const validationSchema = createSelectSchema(jobsSchema, {
  created_at: z.string(),
  updated_at: z.string().optional(),
  promised_time: z.string().optional(),
}).extend({
  provider: providerSelectSchema.optional(),
  company: companySelectSchema.optional(),
  dispatcher: dispatcherSelectSchema.optional(),
  jobDrivers: z.array(jobDriverSelectSchema).optional(),
  jobVehicles: z.array(
    selectJobVehicleContactSchema.extend({
      created_at: z.string().datetime(),
      updated_at: z.string().datetime().nullable(),
      commentsCount: z.number(),
      jobServices: z.array(
        selectJobVehicleContactServiceSchema.extend({
          created_at: z.string().datetime(),
          updated_at: z.string().datetime().nullable(),
        })
      ),
      jobPhotos: z.array(
        selectJobPhotoSchema.extend({
          url: z.string().url(),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime().nullable(),
        })
      ),
    })
  ),
  timer_is_running: z.boolean(),
  timer_timestamp: z.string().datetime(),
  timer_amount: z.number().int().positive(),
});

describe('GET /jobs/{id}', () => {
  beforeAll(async () => {
    agentToken = await fetchV1Token(ROLE.AGENT);
    transformRequestAgent = (_data, headers) => {
      // eslint-disable-next-line no-param-reassign
      headers.Authorization = `Bearer ${agentToken}`;
      return _data;
    };
  });

  it("should return 401 code when doesn't have auth token", async () => {
    const { status } = await request.get(`/jobs/${jobId}`, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it('should return the job with success when accessing as a provider and the provider is the same as the job', async () => {
    const { status, data } = await request.get(`/jobs/${jobId}`);
    validationStatusCode(status);

    validateSchema(data, validationSchema, true);

    expect(data.id).toBe(jobId);
    expect(data.provider_id).toBe(providerId);
    expect(data.provider.id).toBe(providerId);
  });

  it('should return 404 error when accessing as a provider and the provider is NOT the same as the job', async () => {
    const { status } = await request.get(`/jobs/${jobId2}`);
    validationStatusCode(status, 404);
  });

  it('should return the job with success when accessing as a agent - 1', async () => {
    const { status, data } = await request.get(`/jobs/${jobId}`, {
      transformRequest: transformRequestAgent,
    });
    validationStatusCode(status);

    validateSchema(data, validationSchema, true);

    expect(data.id).toBe(jobId);
  });

  it('should return the job with success when accessing as a agent - 2', async () => {
    const { status, data } = await request.get(`/jobs/${jobId2}`, {
      transformRequest: transformRequestAgent,
    });
    validationStatusCode(status);

    validateSchema(data, validationSchema, true);

    expect(data.id).toBe(jobId2);
  });
});
