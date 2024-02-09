import { z } from '@openAPI/config';
import { Audience, Method, MethodCode } from '@utils/constants';
import { IdScalar, PhoneScalar } from '@utils/schema';
import type { TOpenAPIAction } from '@openAPI/types';

const AuthPasswordRequestSchema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .openapi({
    example: {
      username: 'admin',
      password: 'admin',
    },
  });

const AuthPasswordResponseSchema = z.object({ token: z.string() }).openapi({
  example: {
    token:
      'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJST0xFX0FHRU5Y2yAnX6uWnoxsePw2Vd7bpWPAdrhK3U9I6ImFkbWluIiwidiI6MSwia2lkIjoxLCJub25jZSI6MSwiaWF0IjY2yAnX6uWnoxsePw2Vd7bpWPAdrhK3U9DMyNjgyMTZ9.hMIEXHHzuNpIZ2sBcZjvQ8rLUk8zuxdp-JrQzz-HHzuNpIZ2sBcZjvQ8rLUk8zuxdm8isc1_gGO0h2kt6IWIG9SGjTwvUQ',
  },
});

export const AuthPasswordAction: TOpenAPIAction = {
  title: 'AuthPasswordSchema',
  method: Method.POST,
  statusCode: MethodCode[Method.GET],
  path: '/auth/password',
  description: 'Authorization via password',
  tags: [Audience.COMMON],
  isProtected: false,
  request: {
    body: {
      content: AuthPasswordRequestSchema,
    },
  },
  response: {
    content: AuthPasswordResponseSchema,
  },
};

const GetAuthSMSQueryParamsSchema = z.object({ phone: PhoneScalar });

const GetAuthSMSResponseSchema = z
  .object({
    challenge: z.string(),
    timeout: IdScalar,
  })
  .openapi({
    example: {
      challenge: 'FAyT-DEokUYaSUyKK2CD7w',
      timeout: 15,
    },
  });

const VerifyAuthSMSRequestSchema = z
  .object({
    phone: PhoneScalar,
    code: IdScalar,
    challenge: z.string(),
    deviceId: z.string(),
  })
  .openapi({
    example: {
      phone: '1111111111',
      code: 111111,
      challenge: 'FAyT-DEokUYaSUyKK2CD7w',
      deviceId: 'xX1337Xx',
    },
  });

const VerifyAuthSMSResponseSchema = z.object({ token: z.string() }).openapi({
  example: {
    token:
      'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJST0xFX0FHRU5Y2yAnX6uWnoxsePw2Vd7bpWPAdrhK3U9I6ImFkbWluIiwidiI6MSwia2lkIjoxLCJub25jZSI6MSwiaWF0IjY2yAnX6uWnoxsePw2Vd7bpWPAdrhK3U9DMyNjgyMTZ9.hMIEXHHzuNpIZ2sBcZjvQ8rLUk8zuxdp-JrQzz-HHzuNpIZ2sBcZjvQ8rLUk8zuxdm8isc1_gGO0h2kt6IWIG9SGjTwvUQ',
  },
});

export const GetAuthSMSAction: TOpenAPIAction = {
  title: 'AuthSMSSchema',
  method: Method.GET,
  path: '/auth/sms',
  description: 'Get authorization challenge via sms',
  tags: [Audience.COMMON],
  request: {
    query: GetAuthSMSQueryParamsSchema,
  },
  response: {
    content: GetAuthSMSResponseSchema,
  },
};

export const VerifyAuthSMSAction: TOpenAPIAction = {
  title: 'VerifyAuthSMSSchema',
  method: Method.POST,
  statusCode: MethodCode[Method.GET],
  path: '/auth/sms',
  description: 'Verify authorization gotten via sms',
  tags: [Audience.USERS],
  request: {
    body: {
      content: VerifyAuthSMSRequestSchema,
    },
  },
  response: {
    content: VerifyAuthSMSResponseSchema,
  },
};
