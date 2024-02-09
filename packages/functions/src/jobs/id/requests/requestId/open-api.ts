import { z } from '@openAPI/config';
import { Audience, JobRequestStatus, Method } from '@utils/constants';
import {
  JobRequestResponseBaseShape,
  PathIdScalar,
  schemaFromShape,
} from '@utils/schema';
import type { TOpenAPIAction } from '@openAPI/types';

export const PatchJobRequestRequestSchema = z
  .object({
    status: z.literal(JobRequestStatus.CANCELED),
  })
  .openapi({
    example: {
      status: JobRequestStatus.CANCELED,
    },
  });

const PatchJobRequestResponseSchema = schemaFromShape(
  JobRequestResponseBaseShape
)
  .extend({ status: z.literal(JobRequestStatus.CANCELED) })
  .openapi({
    example: {
      id: 9251,
      created_by: 'admin',
      created_at: '2022-09-24T14:03:50.660Z',
      updated_by: 'admin',
      updated_at: '2023-12-13T12:21:21.253Z',
      dispatcher_id: null,
      provider_id: 400,
      service_area_id: 2,
      location_address: 'Blue Springs, MO, USA',
      location_state: 'MO',
      location_city: 'Blue Springs',
      location_details: 'Parking lot',
      location_notes: '',
      location_latitude: 39.05970931046713,
      location_longitude: -94.25794081124693,
      response_time: null,
      job_id: 4097,
      status: JobRequestStatus.CANCELED,
      distance: 44340.5526,
      duration: 12.994850000000001,
    },
  });

const PathParamsSchema = z.object({
  id: PathIdScalar,
  requestId: PathIdScalar,
});

export const PatchJobRequestAction: TOpenAPIAction = {
  title: 'PatchJobRequestSchema',
  method: Method.PATCH,
  path: '/jobs/{id}/requests/{requestId}',
  description: 'Patch (cancel) a job request',
  isProtected: true,
  tags: [Audience.COMMON],
  request: {
    params: PathParamsSchema,
    body: {
      content: PatchJobRequestRequestSchema,
    },
  },
  response: {
    content: PatchJobRequestResponseSchema,
  },
};
