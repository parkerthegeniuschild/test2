import { z } from '@openAPI/config';
import { Audience, Method, ROLE } from '@utils/constants';
import type { TOpenAPIAction } from '@openAPI/types';
import { IdScalar, enumFromConst } from '@utils/schema';

export const CreateJobVehicleRequestSchema = z
  .object({
    type: z.string(),
    year: z.number().int().positive(),
    unit: z.string(),
    model: z.string(),
    color: z.string(),
    vin_serial: z.string(),
    usdot: z.string(),
    mileage: z.number().int().positive(),
    manufacturer: z.string(),
  })
  .openapi({
    example: {
      type: 'Truck',
      year: 2023,
      unit: '123',
      model: '456',
      color: 'Black',
      vin_serial: '789',
      usdot: '123',
      mileage: 12000,
      manufacturer: 'Mercedes-Benz',
    },
  });

const CreateJobVehicleResponseSchema = z
  .object({
    id: IdScalar,
    created_by: z.string(),
    created_at: z.string().datetime(),
    updated_by: z.string().nullable(),
    updated_at: z.string().datetime().nullable(),
    created_by_id: IdScalar,
    created_by_role: enumFromConst(ROLE),
    job_id: IdScalar,
  })
  .merge(CreateJobVehicleRequestSchema)
  .merge(
    z.object({
      mileage: z.string(), // Overwrite the type from number to string
      old_id: IdScalar.nullable(),
    })
  )
  .openapi({
    example: {
      id: 8530,
      created_by: 'admin',
      created_at: '2023-12-11T13:05:02.401Z',
      updated_by: null,
      updated_at: null,
      created_by_id: 1,
      created_by_role: 'ROLE_AGENT',
      job_id: 4662,
      type: 'Truck',
      year: 2023,
      unit: '123',
      model: '456',
      color: 'Black',
      vin_serial: '789',
      usdot: '123',
      mileage: '12000',
      manufacturer: 'Mercedes-Benz',
      old_id: null,
    },
  });

const PathParamsSchema = z.object({ id: z.string() });

export const CreateJobVehicleAction: TOpenAPIAction = {
  title: 'JobVehicleSchema',
  method: Method.POST,
  path: '/jobs/{id}/vehicles',
  description: 'Create a job vehicle',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    params: PathParamsSchema,
    body: {
      content: CreateJobVehicleRequestSchema,
    },
  },
  response: {
    content: CreateJobVehicleResponseSchema,
  },
};
