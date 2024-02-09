import { z } from '@openAPI/config';
import { Audience, Method } from '@utils/constants';
import type { TOpenAPIAction } from '@openAPI/types';
import { jobVehicleContactServicesStatusSchema } from 'db/schema/jobVehicleContactServices';

export const PatchJobVehicleContactServiceRequestSchema = z
  .object({
    service_id: z.number().int().positive().optional(),
    description: z.string().optional(),
    status: jobVehicleContactServicesStatusSchema.optional(),
  })
  .openapi({
    example: {
      service_id: 1,
      description: 'Description of the service',
      status: 'STARTED',
    },
  });

const PatchJobVehicleContactServiceResponseSchema = z
  .object({
    id: z.number().int().positive(),
    created_by: z.string(),
    created_at: z.string(),
    updated_by: z.string().optional().nullable(),
    updated_at: z.string(),
    provider_id: z.number().int().positive().optional().nullable(),
    job_vehicle_contact_id: z.number().int().positive(),
    service_id: z.number().int().positive(),
    status: jobVehicleContactServicesStatusSchema,
    description: z.string(),
    old_id: z.number().int().positive().optional().nullable(),
  })
  .openapi({
    example: {
      id: 339,
      created_by: 'migration',
      created_at: '2023-11-08T22:37:21.855Z',
      updated_by: 'admin',
      updated_at: '2023-12-18T23:10:05.757Z',
      provider_id: null,
      job_vehicle_contact_id: 339,
      service_id: 1,
      status: 'READY',
      description: 'Description of issue updated',
      old_id: 7309,
    },
  });

const PathParamsSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  serviceId: z.string(),
});

export const PatchJobVehicleContactServiceRequestAction: TOpenAPIAction = {
  title: 'PatchJobVehicleContactServiceRequestSchema',
  method: Method.PATCH,
  path: '/jobs/{id}/vehicles/{vehicleId}/services/{serviceId}',
  description: 'Patch a service from a given JobVehicle',
  isProtected: true,
  tags: [Audience.COMMON],
  request: {
    params: PathParamsSchema,
    body: {
      content: PatchJobVehicleContactServiceRequestSchema,
    },
  },
  response: {
    content: PatchJobVehicleContactServiceResponseSchema,
  },
};
