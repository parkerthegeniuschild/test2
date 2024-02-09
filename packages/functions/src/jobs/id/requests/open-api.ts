import { z } from '@openAPI/config';
import { Audience, JobStatuses, Method } from '@utils/constants';
import {
  JobRequestResponseBaseShape,
  IdScalar,
  PathIdScalar,
  schemaFromShape,
} from '@utils/schema';
import type { TOpenAPIAction } from '@openAPI/types';

const CreateJobRequestRequestSchema = z
  .object({ provider_id: IdScalar })
  .openapi({
    example: {
      provider_id: 400,
    },
  });

export const CreateJobRequestResponseSchema = schemaFromShape(
  JobRequestResponseBaseShape
).openapi({
  example: {
    id: 10405,
    created_by: 'admin',
    created_at: '2023-12-13T11:49:44.673Z',
    updated_by: null,
    updated_at: null,
    dispatcher_id: null,
    provider_id: 400,
    service_area_id: 2,
    location_address: "1460 NE Douglas St, Lee's Summit, MO 64086, USA",
    location_state: 'MO',
    location_city: "Lee's Summit",
    location_details: 'Parking lot',
    location_notes: '@ Whataburger',
    location_latitude: 38.93908605567945,
    location_longitude: -94.37916832590332,
    response_time: null,
    job_id: 4555,
    status: JobStatuses.NOTIFYING,
    distance: 12345.67,
    duration: 17.943,
  },
});

const PathParamsSchema = z.object({ id: PathIdScalar });

export const CreateJobRequestAction: TOpenAPIAction = {
  title: 'CreateJobRequestSchema',
  method: Method.POST,
  path: '/jobs/{id}/requests',
  description: "Create a job request by posting a provider's id",
  isProtected: true,
  tags: [Audience.ADMINS],
  request: {
    params: PathParamsSchema,
    body: {
      content: CreateJobRequestRequestSchema,
    },
  },
  response: {
    content: CreateJobRequestResponseSchema,
  },
};
