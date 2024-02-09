import {
  patchProviderSchema,
  patchProviderAdminSchema,
  updateProviderSchema,
} from 'db/schema/providers';
import { useDb } from 'db/dbClient';
import { buildUpdatedProperties } from '@utils/helpers';
import TupApiHandler from 'handlers/TupApiHandler';
import { useJsonBody, usePathParams } from 'sst/node/api';
import { z } from 'zod';
import { PathIdScalar } from '@utils/schema';
import { ITupAuth, useAuth, userIsAgent, userIsProvider } from 'clients/auth';
import {
  TruckupForbiddenError,
  TruckupInternalServerErrorError,
} from 'src/errors';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Provider } from '@core/provider';

const pathSchema = z.object({ id: PathIdScalar });

export const handler = TupApiHandler(async ({ event }) => {
  const { id: providerId } = pathSchema.parse(usePathParams());
  const auth = useAuth();
  validateAuth(providerId, auth);
  const updates = generateAndValidateUpdates(auth, event);

  return await updateProvider(providerId, updates);
});

const validateAuth = (providerId: number, auth: ITupAuth) => {
  if (userIsProvider(auth) && providerId === auth.providerId) return;
  if (userIsAgent(auth)) return;
  throw new TruckupForbiddenError();
};

const generateAndValidateUpdates = (
  auth: ITupAuth,
  event: APIGatewayProxyEventV2
) => {
  const body = useJsonBody();
  const props = buildUpdatedProperties(event);
  if (userIsAgent(auth))
    return { ...patchProviderAdminSchema.parse(body), ...props };
  if (userIsProvider(auth))
    return { ...patchProviderSchema.parse(body), ...props };
  throw new TruckupInternalServerErrorError();
};

const updateProvider = async (
  providerId: number,
  updates: z.infer<typeof updateProviderSchema>
) => {
  return await useDb().transaction(async (tx) => {
    return await Provider.update(providerId, updates, tx);
  });
};
