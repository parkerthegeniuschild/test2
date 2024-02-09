import { TruckupForbiddenError } from 'src/errors';

import { useAuth, userIsAgent, userIsProvider } from 'clients/auth';
import { jobVehicleContactUpdatePath } from 'dto/jobVehicleContact/update';

import TupApiHandler from 'handlers/TupApiHandler';
import { db, saveJobVehicleContactService, setIsAbandoned } from '@core/jobs';
import { useJsonBody, usePathParams } from 'sst/node/api';
import { getSqlCurrentTimestamp } from '@utils/helpers';

export const handler = TupApiHandler(
  async () => {
    if (!(userIsAgent() || userIsProvider())) throw new TruckupForbiddenError();

    const pathParams = jobVehicleContactUpdatePath.parse(usePathParams());
    const body = useJsonBody();
    const auth = useAuth();

    let returnedService;

    await db.transaction(async (tx) => {
      returnedService = await saveJobVehicleContactService({
        pathParams,
        body,
        dbInstance: tx,
        auth,
      });
    });

    await setIsAbandoned(pathParams.id, {
      is_abandoned: false,
      updated_by: auth.username,
      updated_at: getSqlCurrentTimestamp(),
    });

    return returnedService;
  },
  { response: { statusCode: 201 } }
);
