import { z } from '@openAPI/config';
import { Audience, Method } from '@utils/constants';
import type { TOpenAPIAction } from '@openAPI/types';
import {
  IdScalar,
  MomentShape,
  MomentExample,
  PathIdScalar,
} from '@utils/schema';

const ListJobServiceTimersResponseSchema = z
  .object({
    secondsWorked: z.number().int().positive(),
    labors: z.array(
      z.object({
        vehicleId: IdScalar,
        serviceId: IdScalar,
        secondsWorked: z.number().int().positive(),
        timers: z.array(
          z.object({
            id: IdScalar,
            secondsWorked: z.number().int().positive(),
            startTime: z.string(),
            endTime: z.string().optional().nullable(),
          })
        ),
      })
    ),
  })
  .openapi({
    example: {
      secondsWorked: 527925,
      labors: [
        {
          vehicleId: 4139,
          serviceId: 4142,
          secondsWorked: 527872,
          timers: [
            {
              id: 5607,
              secondsWorked: 109685,
              startTime: '2023-12-19T21:39:10.181Z',
              endTime: null,
            },
            {
              id: 6,
              secondsWorked: 418187,
              startTime: '2023-12-15T01:07:48.812Z',
              endTime: '2023-12-19T21:17:36.725Z',
            },
          ],
        },
        {
          vehicleId: 4139,
          serviceId: 4159,
          secondsWorked: 23,
          timers: [
            {
              id: 5,
              secondsWorked: 23,
              startTime: '2023-12-15T01:05:28.109Z',
              endTime: '2023-12-15T01:05:51.435Z',
            },
          ],
        },
        {
          vehicleId: 4139,
          serviceId: 4142,
          secondsWorked: 30,
          timers: [
            {
              id: 1,
              secondsWorked: 30,
              startTime: '2023-12-15T00:31:22.668Z',
              endTime: '2023-12-15T00:31:53.056Z',
            },
          ],
        },
      ],
    },
  });

const PathParamsSchema = z.object({ id: PathIdScalar });

export const ListJobServiceTimersAction: TOpenAPIAction = {
  title: 'ListJobServiceTimersResponseSchema',
  method: Method.GET,
  path: '/jobs/{id}/timers',
  description: 'List all service timers',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    params: PathParamsSchema,
  },
  response: {
    content: ListJobServiceTimersResponseSchema,
  },
};

const PostJobServiceTimersRequestSchema = z
  .object({
    job_vehicle_contact_service_id: IdScalar,
    provider_id: IdScalar,
    start_time: z.string().datetime().optional(),
    end_time: z.string().datetime().optional(),
  })
  .openapi({
    example: {
      job_vehicle_contact_service_id: 123,
      provider_id: 138,
      start_time: '2023-01-01T00:00:00.000Z',
      end_time: '2023-01-01T00:00:00.000Z',
    },
  });

const PostJobServiceTimersResponseSchema = z
  .object({
    ...MomentShape,
    job_id: IdScalar,
    job_vehicle_contact_service_id: IdScalar.optional(),
    provider_id: IdScalar,
    start_time: z.string().datetime().optional(),
    end_time: z.string().datetime().optional(),
    old_id: z.number().int().optional().nullable(),
  })
  .openapi({
    example: {
      ...MomentExample,
      job_id: 4660,
      job_vehicle_contact_service_id: 4159,
      provider_id: 138,
      start_time: '2023-01-02T02:00:00.000Z',
      end_time: '2023-01-02T03:00:00.000Z',
      old_id: null,
    },
  });

export const PostJobServiceTimersAction: TOpenAPIAction = {
  title: 'PostJobServiceTimersResponseSchema',
  method: Method.POST,
  path: '/jobs/{id}/timers',
  description: 'Post one service timer',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    params: PathParamsSchema,
    body: {
      content: PostJobServiceTimersRequestSchema,
    },
  },
  response: {
    content: PostJobServiceTimersResponseSchema,
  },
};
