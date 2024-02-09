import { z } from '@openAPI/config';
import { paginated } from '@openAPI/schema';
import type { TOpenAPIAction } from '@openAPI/types';
import { Method } from '@utils/constants';
import { IdScalar, MomentShape } from '@utils/schema';

const CreateJobCommentsResponseSchema = z.object({
  ...MomentShape,
  edited_at: z.string().datetime().nullable(),
  job_id: IdScalar,
  vehicle_id: IdScalar,
  user_id: IdScalar,
  role: z.string(),
  text: z.string(),
});

export const CreateJobCommentsAction: TOpenAPIAction = {
  title: 'CreateJobCommentSchema',
  method: Method.POST,
  path: '/jobs/{jobId}/vehicles/{vehicleId}/comments',
  summary: `POST /jobs/{jobId}/vehicles/{vehicleId}/comments`,
  description: 'Creates a comment on the job and vehicle specified',
  isProtected: true,
  response: {
    content: CreateJobCommentsResponseSchema,
  },
};

const UpdateJobCommentsResponseSchema = z.object({
  ...MomentShape,
  edited_at: z.string().datetime().nullable(),
  job_id: IdScalar,
  vehicle_id: IdScalar,
  user_id: IdScalar,
  role: z.string(),
  text: z.string(),
});

export const UpdateJobCommentsAction: TOpenAPIAction = {
  title: 'UpdateJobCommentsSchema',
  method: Method.PATCH,
  path: 'jobs/{jobId}/vehicles/{vehicleId}/comments/{commentId}',
  summary: 'PATCH jobs/{jobId}/vehicles/{vehicleId}/comments/{commentId}',
  description: 'Updates a comment on the job and vehicle specified',
  isProtected: true,
  response: {
    content: UpdateJobCommentsResponseSchema,
  },
};

const ListJobCommentsResponseSchema = paginated(
  z.object({
    id: IdScalar,
    created_at: z.string().datetime(),
    edited_at: z.string().datetime().nullable(),
    job_id: IdScalar,
    vehicle_id: IdScalar,
    user_id: IdScalar,
    role: z.string(),
    text: z.string(),
    firstname: z.string(),
    lastname: z.string().nullable(),
  })
);

export const ListJobCommentsAction: TOpenAPIAction = {
  title: 'JobCommentSchema',
  method: Method.GET,
  path: '/jobs/{jobId}/vehicles/{vehicleId}/comments',
  description: 'Lists the comments for the job and vehicle specified',
  isProtected: true,
  response: {
    content: ListJobCommentsResponseSchema,
  },
};
