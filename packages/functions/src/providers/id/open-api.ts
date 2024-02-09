import { z } from '@openAPI/config';
import { Audience, Method } from '@utils/constants';
import { IdScalar } from '@utils/schema';
import { TOpenAPIAction } from '@openAPI/types';

export const DeleteProviderPathParamsSchema = z
  .object({
    providerId: IdScalar,
  })
  .openapi({
    example: {
      providerId: 1337,
    },
  });

export type TDeleteProviderPathParamsSchema = z.infer<
  typeof DeleteProviderPathParamsSchema
>;

export const DeleteProviderAction: TOpenAPIAction = {
  title: 'DeleteProviderSchema',
  method: Method.DELETE,
  path: '/providers/{providerId}',
  description: 'Delete a provider',
  tags: [Audience.USERS],
  isProtected: true,
  request: {
    params: DeleteProviderPathParamsSchema,
    body: undefined,
  },
  response: {
    content: undefined,
  },
};
