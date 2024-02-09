import { z } from '@openAPI/config';
import type { TOpenAPIAction } from '@openAPI/types';
import { paginated } from '@openAPI/schema';
import { Audience, JobStatuses, Method } from '@utils/constants';
import {
  JobBaseShape,
  IdScalar,
  PhoneScalar,
  schemaFromShape,
} from '@utils/schema';

const path = '/jobs';
const JobBaseSchema = schemaFromShape(JobBaseShape);

const GetJobsResponseSchema = paginated(
  JobBaseSchema.openapi({
    example: {
      id: 4555,
      created_by: 'admin',
      created_at: '2023-05-23T19:55:46.785Z',
      updated_by: 'system',
      updated_at: '2023-07-13T18:23:13.180Z',
      dispatcher_id: 8419,
      service_area_id: 2,
      company_id: 2948,
      location_address: "1460 NE Douglas St, Lee's Summit, MO 64086, USA",
      location_street: 'NE Douglas St',
      location_street_number: '1460',
      location_zip: '64086',
      location_state: 'MO',
      location_city: "Lee's Summit",
      location_details: 'Parking lot',
      location_notes: '@ Whataburger',
      location_type: null,
      location_latitude: 38.93908605567945,
      location_longitude: -94.37916832590332,
      is_pending_review: false,
      rating: null,
      status_id: JobStatuses.UNASSIGNED,
      total_cost: '255.00',
      payment_method: null,
      payment_refnumber: null,
      promised_time: '2023-05-23T19:55:46.778Z',
      provider_id: null,
      payment_sum: '0',
      is_abandoned: false,
      customer_ref: '123456789',
      provider_callout_cents: 2500,
      provider_rate_cents: 3000,
      invoice_message: 'Invoice Message',
    },
  })
);

const CreateJobDriverSchema = z
  .object({
    firstname: z.string(),
    lastname: z.string().optional(),
    phone: PhoneScalar,
    secondary_phone: PhoneScalar.optional(),
    email: z.string().email().optional(),
  })
  .openapi('CreateJobDriverSchema');

const CreateJobRequestSchema = z
  .object({
    company_id: IdScalar,
    dispatcher_id: IdScalar,
    customer_ref: z.string().optional(),
    drivers: z.array(CreateJobDriverSchema),
  })
  .openapi({
    example: {
      company_id: 3920,
      dispatcher_id: 4142,
      customer_ref: '123456789',
      drivers: [
        {
          firstname: 'John',
          lastname: 'Doe',
          phone: '13737373733',
          email: 'johndoe@me.com',
        },
      ],
    },
  });

const CreateJobResponseSchema = JobBaseSchema.extend({
  status_id: z.literal(JobStatuses.DRAFT),
}).openapi({
  example: {
    id: 4886,
    created_by: 'admin',
    created_at: '2023-12-14T10:07:06.141Z',
    updated_by: null,
    updated_at: null,
    dispatcher_id: 4142,
    service_area_id: null,
    company_id: 3920,
    location_address: null,
    location_street: null,
    location_street_number: null,
    location_zip: null,
    location_state: null,
    location_city: null,
    location_details: null,
    location_notes: null,
    location_type: null,
    location_latitude: null,
    location_longitude: null,
    is_pending_review: true,
    rating: null,
    status_id: JobStatuses.DRAFT,
    total_cost: '0',
    payment_method: null,
    payment_refnumber: null,
    promised_time: null,
    provider_id: null,
    payment_sum: '0',
    is_abandoned: false,
    customer_ref: '123456789',
    provider_callout_cents: 2500,
    provider_rate_cents: 3000,
    invoice_message: null,
  },
});

export const GetJobsAction: TOpenAPIAction = {
  title: 'ListJobsSchema',
  method: Method.GET,
  path,
  description: 'Get list of all jobs',
  tags: [Audience.USERS],
  isProtected: true,
  response: {
    content: GetJobsResponseSchema,
  },
};

export const CreateJobAction: TOpenAPIAction = {
  title: 'JobSchema',
  method: Method.POST,
  path,
  description: 'Create a new job',
  tags: [Audience.ADMINS],
  isProtected: true,
  request: {
    body: {
      content: CreateJobRequestSchema,
    },
  },
  response: {
    content: CreateJobResponseSchema,
  },
};
