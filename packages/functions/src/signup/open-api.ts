import { z } from '@openAPI/config';
import { Audience, Method } from '@utils/constants';
import { PhoneScalar } from '@utils/schema';
import { TOpenAPIAction } from '@openAPI/types';

export const ProviderSignupRequestSchema = z
  .strictObject({
    firstname: z.string().nonempty(),
    lastname: z.string().nonempty(),
    email: z.string().email().nonempty(),
    phone: PhoneScalar.nonempty(),
  })
  .openapi({
    example: {
      firstname: 'Trucky',
      lastname: 'McTrucker',
      email: 'trucky@truckup.com',
      phone: '11111111111',
    },
  });

export type TProviderSignupRequestSchema = z.infer<
  typeof ProviderSignupRequestSchema
>;

export const ProviderSignupResponseSchema = z
  .strictObject({
    accepted: z.literal(true),
  })
  .openapi({
    example: {
      accepted: true,
    },
  });

export type TProviderSignupResponseSchema = z.infer<
  typeof ProviderSignupResponseSchema
>;

export const ProviderSignupAction: TOpenAPIAction = {
  title: 'ProviderSignupSchema',
  method: Method.POST,
  path: '/signup/providers',
  description: 'Request to sign up as a provider',
  tags: [Audience.PUBLIC],
  isProtected: false,
  request: {
    body: {
      content: ProviderSignupRequestSchema,
    },
  },
  response: {
    content: ProviderSignupResponseSchema,
  },
};
