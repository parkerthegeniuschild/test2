import { z } from '@openAPI/config';
import { Audience, Method } from '@utils/constants';
import type { TOpenAPIAction } from '@openAPI/types';
import {
  IdScalar,
  MomentShape,
  MomentExample,
  PathIdScalar,
} from '@utils/schema';

const PatchJobServiceTimersRequestSchema = z.object({
  start_time: z.string(),
  end_time: z.string(),
});

const PatchJobServiceTimersResponseSchema = z
  .object({
    ...MomentShape,
    job_id: IdScalar,
    job_vehicle_contact_service_id: IdScalar,
    provider_id: IdScalar,
    start_time: z.string(),
    end_time: z.string().nullable(),
    old_id: IdScalar.nullable(),
  })
  .openapi({
    example: {
      ...MomentExample,
      job_id: 4660,
      job_vehicle_contact_service_id: 4142,
      provider_id: 138,
      start_time: '2023-12-15T00:31:22.668Z',
      end_time: '2023-12-15T00:31:53.056Z',
      old_id: null,
    },
  });

const PathParamsSchema = z.object({ id: PathIdScalar, timerId: PathIdScalar });

export const PatchJobServiceTimersAction: TOpenAPIAction = {
  title: 'PatchJobServiceTimersResponseSchema',
  method: Method.PATCH,
  path: '/jobs/{id}/timers/{timerId}',
  description: 'Updates a job service timer.',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    params: PathParamsSchema,
    body: {
      content: PatchJobServiceTimersRequestSchema,
    },
  },
  response: {
    content: PatchJobServiceTimersResponseSchema,
  },
};

export const DeleteJobServiceTimersAction: TOpenAPIAction = {
  title: 'DeleteJobServiceTimersResponseSchema',
  method: Method.DELETE,
  path: '/jobs/{id}/timers/{timerId}',
  description: 'Delete a job service timer.',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    params: PathParamsSchema,
  },
  response: {
    content: z.object({}),
  },
};
