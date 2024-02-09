import { useEvent } from 'sst/context';
import { ROLE } from '@utils/constants';
import { z } from 'zod';
import { TruckupForbiddenError } from 'src/errors';
import { IdScalar } from '@utils/schema';

export const V0_ENABLED = true;

export const authSchema = z.object({
  exp: z.number(),
  iat: z.number(),
  kid: z.number(),
  nonce: z.number(),
  providerId: IdScalar.optional(),
  roles: z.array(z.enum([ROLE.AGENT, ROLE.PROVIDER])),
  userId: z.number(),
  username: z.string(),
  v: z.number(),
});
export type ITupAuth = z.infer<typeof authSchema>;

export const requestContextSchema = z.object({
  authorizer: z.object({ lambda: authSchema }),
});

export const authConfigSchema = z.object({
  requiredRole: z.enum([ROLE.AGENT, ROLE.PROVIDER]).optional(),
  providerId: IdScalar.optional(),
});
export type IAuthConfig = z.infer<typeof authConfigSchema>;

export const useAuth = (options?: IAuthConfig) => {
  const { requiredRole, providerId } = options || {};
  const { requestContext } = useEvent('api');

  const {
    authorizer: { lambda: auth },
  } = requestContextSchema.parse(requestContext);

  if (requiredRole && !auth.roles.includes(requiredRole)) {
    throw new TruckupForbiddenError('Missing required role!');
  }

  if (providerId && auth.providerId !== providerId) {
    throw new TruckupForbiddenError(`Wrong providerId!`);
  }

  return auth;
};

export const userIsAgent = (customAuth?: ITupAuth): boolean => {
  const auth = customAuth || useAuth();
  return auth.roles.includes(ROLE.AGENT);
};

export const userIsProvider = (customAuth?: ITupAuth): boolean => {
  const auth = customAuth || useAuth();
  return auth.roles.includes(ROLE.PROVIDER);
};
