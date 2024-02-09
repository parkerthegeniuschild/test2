import { Provider } from '@core/provider';
import { ROLE } from '@utils/constants';
import { buildUpdatedProperties } from '@utils/helpers';
import { PathIdScalar } from '@utils/schema';
import { useAuth } from 'clients/auth';
import TupApiHandler from 'handlers/TupApiHandler';
import { usePathParams } from 'sst/node/api';
import { z } from 'zod';

const pathParamsSchema = z.strictObject({ id: PathIdScalar });

export const handler = TupApiHandler(
  async ({ event }) => {
    const { id: providerId } = pathParamsSchema.parse(usePathParams());
    useAuth({ requiredRole: ROLE.PROVIDER, providerId });
    await Provider.del(providerId, buildUpdatedProperties(event));
  },
  { method: 'DELETE' }
);
