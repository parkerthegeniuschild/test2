import { z } from '@openAPI/config';
import { Audience, Method } from '@utils/constants';
import { IdScalar, PhoneScalar } from '@utils/schema';
import type { TOpenAPIAction } from '@openAPI/types';

export const CreateProviderRequestSchema = z.object({
  firstname: z.string().nonempty(),
  lastname: z.string().nonempty(),
  email: z.string().email(),
  phone: PhoneScalar,
  address1: z.string().nonempty(),
  address2: z.string().nonempty().optional(),
  city: z.string().nonempty(),
  state: z.string().nonempty(),
  zip: z.string().length(5),
  country: z.string().nonempty().optional(),
  company_id: IdScalar.optional(),
});

const CreateProviderResponseSchema = z.object({
  id: IdScalar,
  created_by: z.string(),
  created_at: z.string().datetime(),
  updated_by: z.string().nullable(),
  updated_at: z.string().datetime().nullable(),
  firstname: z.string(),
  lastname: z.string(),
  company_id: IdScalar.optional(),
  address: z.string(),
  address_two: z.string().optional(),
  city: z.string(),
  state: z.string().nullable(),
  zip: z.string().length(5),
  email: z.string().email(),
  phone: PhoneScalar,
  is_blocked: z.boolean(),
  is_unapproved: z.boolean(),
  balance: z.string(),
  status_change_date: z.string().datetime().nullable(),
  is_online: z.boolean(),
  is_onjob: z.boolean(),
  app_user_id: IdScalar,
  provider_type: z.literal('PRO'),
  rating: z.string(),
  firebase_uid: z.string().nullable(),
  location_precise: z.boolean(),
  location_always: z.boolean(),
  notifications: z.boolean(),
});

export const CreateProviderAction: TOpenAPIAction = {
  title: 'ProviderSchema',
  method: Method.POST,
  path: '/providers',
  description: 'Create a provider by first creating a user, then a provider',
  isProtected: true,
  tags: [Audience.ADMINS],
  request: {
    body: {
      content: CreateProviderRequestSchema,
      description: 'Lorem ipsum dolor',
    },
  },
  response: {
    content: CreateProviderResponseSchema,
  },
};
