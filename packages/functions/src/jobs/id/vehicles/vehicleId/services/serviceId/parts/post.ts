import { TruckupForbiddenError } from 'src/errors';
import { useAuth, userIsAgent, userIsProvider } from 'clients/auth';
import TupApiHandler from 'handlers/TupApiHandler';
import {
  db,
  saveJobVehicleContactServicePart,
  setIsAbandoned,
} from '@core/jobs';
import { useJsonBody, usePathParams } from 'sst/node/api';
import { jobVehicleContactServiceUpdatePath } from 'dto/jobVehicleContact/service';
import { createJobVehicleContactServicePartSchema } from 'db/schema/jobVehicleContactServiceParts';
import { getSqlCurrentTimestamp } from '@utils/helpers';

export const handler = TupApiHandler(
  async () => {
    if (!(userIsAgent() || userIsProvider())) throw new TruckupForbiddenError();

    const pathParams = jobVehicleContactServiceUpdatePath.parse(
      usePathParams()
    );
    const body = useJsonBody();

    createJobVehicleContactServicePartSchema.parse(body);

    const auth = useAuth();

    await setIsAbandoned(pathParams.id, {
      is_abandoned: false,
      updated_by: auth.username,
      updated_at: getSqlCurrentTimestamp(),
    });

    return await saveJobVehicleContactServicePart({
      pathParams,
      body,
      auth,
      dbInstance: db,
    });
  },
  { method: 'POST' }
);
