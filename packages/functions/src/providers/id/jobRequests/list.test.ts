import 'vitest';
import {
  ApiParams,
  removeAuth,
  request,
  validateList,
  validatePaginationData,
  validateSchema,
  validateSort,
  validationStatusCode,
  IDS,
} from '@tests/helpers';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { jobRequests as jobRequestsSchema } from 'db/schema/jobRequests';

const validationSchema = createSelectSchema(jobRequestsSchema, {
  created_at: z.string(),
})
  .pick({
    id: true,
    job_id: true,
    provider_id: true,
    status: true,
    location_latitude: true,
    location_longitude: true,
    created_at: true,
    location_city: true,
    location_state: true,
    distance: true,
    duration: true,
  })
  .extend({
    minimum_hours: z.number(),
    callout: z.string(),
    hourly: z.string(),
    minimum_earnings: z.string(),
    arrive_by: z.string().nullable(),
  });

describe('GET /providers/{id}/jobRequests', () => {
  it("should return 401 code when doesn't have auth token", async () => {
    const { status } = await request.get(
      `/providers/${IDS.PROVIDER}/jobRequests`,
      {
        transformRequest: removeAuth,
      }
    );
    validationStatusCode(status, 401);
  });

  it('should return a list of jobRequests with success', async () => {
    const { status, data } = await request.get(
      `/providers/${IDS.PROVIDER}/jobRequests`
    );
    validationStatusCode(status);
    validateList(data);
    validateSchema(data.data[0], validationSchema, true);
  });

  it('should return a list of jobRequests with success when pass size, page, sort and order params', async () => {
    const params = {
      size: 5,
      page: 2,
      sort: 'id',
      order: 'desc',
    } satisfies ApiParams;

    const { status, data } = await request.get(
      `/providers/${IDS.PROVIDER}/jobRequests`,
      { params }
    );

    validationStatusCode(status);
    validateList(data);
    validateSchema(data.data[0], validationSchema, true);
    validateSort(data.data, params.sort, params.order);
    validatePaginationData(data, params);
  });
});
