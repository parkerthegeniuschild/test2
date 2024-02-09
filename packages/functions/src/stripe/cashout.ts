import assert from 'node:assert/strict';
import { response } from '@utils/response';
import { ApiHandler, useJsonBody } from 'sst/node/api';
import { z } from 'zod';
import { ROLE } from '@utils/constants';
import { V0_ENABLED, useAuth } from 'clients/auth';

export const payloadSchema = z.object({
  amountCents: z.number().int().positive(),
  type: z.enum(['standard', 'instant']),
});
export type IPayload = z.infer<typeof payloadSchema>;

// TODO implement
export const handler = ApiHandler(async (event) => {
  try {
    if (V0_ENABLED) {
      assert.ok(
        // @ts-expect-error type
        event.requestContext.authorizer.lambda.roles.includes(ROLE.PROVIDER),
        `Bad role!`
      );
    } else {
      useAuth({ requiredRole: ROLE.PROVIDER });
    }
  } catch (e) {
    return response.forbidden();
  }

  try {
    const { amountCents, type } = payloadSchema.parse(useJsonBody());
    return response.success({ amountCents, type });
  } catch (e) {
    return response.error();
  }
});
