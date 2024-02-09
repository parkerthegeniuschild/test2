import assert from 'node:assert/strict';
import { getVehicleById } from '@core/jobs';
import { ApiHandler } from 'sst/node/api';
import { response } from '@utils/response';
import { TruckupForbiddenError, TruckupNotFoundError } from 'src/errors';
import { useAuth, userIsAgent, userIsProvider } from 'clients/auth';
import { ZodError } from 'zod';
import { jobVehicleContactServices as jobVehicleContactServicesSchema } from 'db/schema/jobVehicleContactServices';
import { useDb } from 'db/dbClient';
import { jobVehicleContactServiceUpdatePath } from 'dto/jobVehicleContact/service';
import { and, eq } from 'drizzle-orm';

export const handler = ApiHandler(async (_evt) => {
  try {
    const {
      id: jobId,
      vehicleId,
      serviceId,
    } = jobVehicleContactServiceUpdatePath.parse(_evt.pathParameters);

    const { providerId } = useAuth();
    const isProvider = userIsProvider() && !!providerId;
    if (!userIsAgent() && !isProvider) throw new TruckupForbiddenError();

    const vehicle = await getVehicleById(vehicleId);

    if (!vehicle || vehicle.job_id !== jobId) throw new TruckupNotFoundError();

    const service = await useDb()
      .delete(jobVehicleContactServicesSchema)
      .where(
        and(
          eq(jobVehicleContactServicesSchema.id, serviceId),
          eq(jobVehicleContactServicesSchema.job_vehicle_contact_id, vehicleId),
          isProvider
            ? eq(jobVehicleContactServicesSchema.provider_id, providerId)
            : undefined
        )
      )
      .returning();

    if (!service.length) throw new TruckupNotFoundError();

    return response.success();
  } catch (error) {
    switch (true) {
      case error instanceof TruckupForbiddenError:
        return response.forbidden();
      case error instanceof TruckupNotFoundError:
        return response.notFound();
      case error instanceof assert.AssertionError:
      case error instanceof ZodError:
        return response.error(error);
      default:
        return response.failure(error);
    }
  }
});
