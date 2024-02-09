import { z } from '@openAPI/config';
import { paginated } from '@openAPI/schema';
import type { TOpenAPIAction } from '@openAPI/types';
import { JobRequestStatus, Method } from '@utils/constants';
import { enumFromConst, IdScalar } from '@utils/schema';

export const GetProviderJobRequestsResponseSchema = paginated(
  z
    .object({
      id: IdScalar,
      job_id: IdScalar,
      provider_id: IdScalar,
      status: enumFromConst(JobRequestStatus),
      location_latitude: z.number(),
      location_longitude: z.number(),
      created_at: z.string().datetime(),
      location_city: z.string(),
      location_state: z.string().toUpperCase().length(2),
      distance: z.number().nullable(),
      duration: z.number().nullable(),
      minimum_hours: z.number().int().positive(),
      callout: z.string(),
      hourly: z.string(),
      minimum_earnings: z.string(),
      arrive_by: z.string().datetime().nullable(),
    })
    .openapi({
      example: {
        id: 9250,
        job_id: 4097,
        provider_id: 400,
        status: 'CANCELED',
        location_latitude: 39.040150468952184,
        location_longitude: -94.1952493318559,
        created_at: '2022-09-22T14:12:43.881Z',
        location_city: 'Blue Springs',
        location_state: 'MO',
        distance: 44340.5526,
        duration: 12.994850000000001,
        minimum_hours: 2,
        callout: '25',
        hourly: '25',
        minimum_earnings: '75',
        arrive_by: '2022-09-22 15:05:43.572',
      },
    })
);

const PathParamsSchema = z.object({ id: z.string() });

export const GetProviderJobRequestsAction: TOpenAPIAction = {
  title: 'GetProviderJobRequestsSchema',
  method: Method.GET,
  path: '/providers/{id}/jobRequests',
  description: 'Get list of jobs requests for a provider',
  isProtected: true,
  request: {
    params: PathParamsSchema,
  },
  response: {
    content: GetProviderJobRequestsResponseSchema,
  },
};
