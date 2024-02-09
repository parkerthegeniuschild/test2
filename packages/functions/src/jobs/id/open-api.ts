import { z } from '@openAPI/config';
import {
  Audience,
  ImageType,
  JobServiceType,
  JobStatuses,
  Method,
  ROLE,
  VehicleType,
} from '@utils/constants';
import {
  CompanyBaseShape,
  enumFromConst,
  GeoLocationCoordinatesShape,
  IdScalar,
  LocationShape,
  MomentShape,
  PathIdScalar,
  PhoneScalar,
  schemaFromShape,
} from '@utils/schema';
import type { TOpenAPIAction } from '@openAPI/types';

const basePath = '/jobs/{id}';

const CompanySchema =
  schemaFromShape(CompanyBaseShape).openapi('CompanySchema');

const DispatcherSchema = z
  .object({
    ...MomentShape,
    firstname: z.string(),
    lastname: z.string(),
    is_no_text_messages: z.boolean(),
    phone: PhoneScalar,
    secondary_phone: PhoneScalar.nullable(),
    email: z.string().email(),
    company_id: IdScalar.nullable(),
    type_id: IdScalar,
  })
  .openapi('DispatcherSchema');

const JobDriverSchema = z
  .object({
    ...MomentShape,
    firstname: z.string(),
    lastname: z.string(),
    phone: PhoneScalar,
    secondary_phone: PhoneScalar.nullable(),
    email: z.string().email(),
    company_id: z.number().positive().nullable(),
    job_id: IdScalar.nullable(),
    old_id: IdScalar.nullable(),
  })
  .openapi('JobDriverSchema');

const ServiceSchema = z
  .object({
    ...MomentShape,
    name: enumFromConst(JobServiceType),
    description: z.string(),
    is_active: z.boolean(),
    labor_type_rate_id: z.number().positive(),
    rate_value: z.number().nonnegative(),
    disclaimer: z.string().nullable(),
    min_hours: z.number().positive(),
    icon_id: IdScalar.nullable(),
  })
  .openapi('ServiceSchema');

const JobServicePartSchema = z
  .object({
    id: IdScalar,
    name: z.string(),
    description: z.string().nullable(),
    quantity: z.number().int().positive(),
    price: z.number().positive().or(z.string()),
    markup: z.number().positive(),
  })
  .openapi('JobServicePartSchema');

const JobServiceSchema = z
  .object({
    ...MomentShape,
    provider_id: IdScalar.nullable(),
    job_vehicle_contact_id: z.number().positive(),
    service_id: IdScalar,
    type: enumFromConst(JobServiceType),
    description: z.string(),
    old_id: IdScalar.nullable(),
    jobServiceParts: z.array(JobServicePartSchema),
    service: ServiceSchema,
  })
  .openapi('JobServiceSchema');

const JobPhotoSchema = z
  .object({
    ...MomentShape,
    jobId: IdScalar,
    vehicleId: IdScalar,
    contentType: enumFromConst(ImageType),
    contentEncoding: z.string().nullable(),
    url: z.string().url(),
    path: z.string().nullable(),
    filename: z.string(),
    height: z.number().positive(),
    width: z.number().positive(),
    sourcePath: z.string(),
    sourceHeight: z.number().positive(),
    sourceWidth: z.number().positive(),
    isOptimized: z.boolean(),
    userId: IdScalar,
    oldId: IdScalar.nullable(),
  })
  .openapi('JobPhotoSchema');

const JobVehicleWithServicesAndPhotosSchema = z
  .object({
    ...MomentShape,
    created_by_id: IdScalar,
    created_by_role: enumFromConst(ROLE),
    job_id: IdScalar.nullable(),
    type: enumFromConst(VehicleType),
    year: z.number().positive(),
    unit: z.string(),
    model: z.string(),
    color: z.string().nullable(),
    vin_serial: z.string(),
    usdot: z.string(),
    mileage: z.number().positive().or(z.string().nonempty()),
    manufacturer: z.string(),
    old_id: IdScalar.nullable(),
    jobServices: z.array(JobServiceSchema),
    jobPhotos: z.array(JobPhotoSchema),
    commentsCount: z.number(),
  })
  .openapi('JobVehicleWithServicesAndPhotosSchema');

const GetJobByIdResponseSchema = z.object({
  ...MomentShape,
  dispatcher_id: IdScalar,
  service_area_id: IdScalar,
  company_id: IdScalar,
  ...LocationShape,
  is_pending_review: z.boolean(),
  rating: z.string().optional(),
  status_id: enumFromConst(JobStatuses),
  total_cost: z.string(),
  payment_method: z.string().nullable(),
  payment_refnumber: z.string().nullable(),
  promised_time: z.string().datetime().nullable(),
  provider_id: IdScalar.nullable(),
  payment_sum: z.string(),
  is_abandoned: z.boolean(),
  customer_ref: z.string().nullable(),
  provider_callout_cents: z.number().int().positive(),
  provider_rate_cents: z.number().int().positive(),
  provider: IdScalar.nullable(),
  company: CompanySchema,
  dispatcher: DispatcherSchema,
  jobDrivers: z.array(JobDriverSchema),
  jobVehicles: z.array(JobVehicleWithServicesAndPhotosSchema),
  timer_is_running: z.boolean(),
  timer_timestamp: z.string().datetime(),
  timer_amount: z.number().nonnegative(),
});

const PathParamsSchema = z.object({ id: PathIdScalar });

export const GetJobByIdAction: TOpenAPIAction = {
  title: 'GetJobByIdSchema',
  method: Method.GET,
  path: basePath,
  description: 'Get job information by id',
  isProtected: true,
  request: {
    params: PathParamsSchema,
  },
  response: {
    content: GetJobByIdResponseSchema,
  },
};

const PatchJobDriverSchema = JobDriverSchema.pick({
  firstname: true,
  phone: true,
}).extend({
  lastname: z.string().optional(),
  secondary_phone: z.string().optional(),
  email: z.string().email().optional(),
});

const PatchJobRequestSchema = z
  .object({
    dispatcher_id: IdScalar,
    company_id: IdScalar,
    location_address: z.string(),
    location_street: z.string().nullable(),
    location_street_number: z.string().nullable(),
    location_zip: z.string().nullable(),
    location_state: z.string().length(2).toUpperCase(),
    location_city: z.string(),
    location_details: z.string(),
    location_notes: z.string().nullable(),
    location_type: z.string(),
    ...GeoLocationCoordinatesShape,
    promised_time: z.string().datetime().nullable(),
    customer_ref: z.string().nullable(),
    provider_callout_cents: z.number().int().positive(),
    provider_rate_cents: z.number().int().positive(),
    drivers: z.array(PatchJobDriverSchema).optional(),
  })
  .deepPartial()
  .openapi({
    example: {
      dispatcher_id: 400,
      company_id: 2,
      location_address: '13th Street 47 W',
      location_street: 'NE Douglas St',
      location_street_number: '1460',
      location_zip: '64086',
      location_state: 'NY',
      location_city: 'Brooklyn',
      location_details: 'Parking lot',
      location_notes: null,
      location_type: 'locality',
      location_latitude: 33.3333,
      location_longitude: 44.4444,
      promised_time: '2023-05-23T19:55:46.778Z',
      customer_ref: '123456789',
      provider_callout_cents: 2500,
      provider_rate_cents: 3000,
      drivers: [
        {
          firstname: 'John',
          lastname: 'Doe',
          phone: '12345678900',
          email: 'johndoe@email.com',
        },
      ],
    },
  });

export const PatchJobAction: TOpenAPIAction = {
  title: 'PatchJobSchema',
  method: Method.PATCH,
  path: basePath,
  description: 'Update job information',
  isProtected: true,
  tags: [Audience.ADMINS],
  request: {
    params: PathParamsSchema,
    body: {
      content: PatchJobRequestSchema,
    },
  },
  response: {
    content: PatchJobRequestSchema, // Response is the same as request
  },
};

const PatchJobStatusRequestSchema = z
  .object({
    status_id: enumFromConst(JobStatuses),
  })
  .openapi({
    example: {
      status_id: 'IN_PROGRESS',
    },
  });

const PatchJobStatusResponseSchema = z.object({});

export const PatchJobStatusAction: TOpenAPIAction = {
  title: 'PatchJobStatusSchema',
  method: Method.PATCH,
  path: `${basePath}/status`,
  description: 'Update job status information',
  isProtected: true,
  tags: [Audience.ADMINS, Audience.USERS],
  request: {
    params: PathParamsSchema,
    body: {
      content: PatchJobStatusRequestSchema,
    },
  },
  response: {
    content: PatchJobStatusResponseSchema,
  },
};
