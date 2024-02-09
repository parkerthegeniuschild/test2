import assert from 'node:assert/strict';
import { getPartById } from '@core/jobs';
import { ApiHandler } from 'sst/node/api';
import { response } from '@utils/response';
import { TruckupForbiddenError, TruckupNotFoundError } from 'src/errors';
import { useAuth, userIsAgent, userIsProvider } from 'clients/auth';
import { ZodError } from 'zod';
import { jobVehicleContactServicePartUpdatePath } from 'dto/jobVehicleContact/part';
import { useDb } from 'db/dbClient';
import { jobVehicleContactServiceParts as jobVehicleContactServicePartsSchema } from 'db/schema/jobVehicleContactServiceParts';
import { and, eq } from 'drizzle-orm';

export const handler = ApiHandler(async (_evt) => {
  try {
    const {
      id: jobId,
      vehicleId,
      serviceId,
      partId,
    } = jobVehicleContactServicePartUpdatePath.parse(_evt.pathParameters);

    const part = await getPartById(partId);

    const { providerId } = useAuth();
    const isProvider = userIsProvider() && !!providerId;
    if (!(userIsAgent() || isProvider)) throw new TruckupForbiddenError();

    if (
      !part ||
      part.jobVehicleService.id !== serviceId ||
      part.jobVehicleService.jobVehicle.id !== vehicleId ||
      part.jobVehicleService.jobVehicle.job_id !== jobId
    )
      throw new TruckupNotFoundError();

    if (
      isProvider &&
      part.jobVehicleService.jobVehicle.job.provider_id !== providerId
    )
      throw new TruckupNotFoundError();

    const deleted = await useDb()
      .delete(jobVehicleContactServicePartsSchema)
      .where(
        and(
          eq(jobVehicleContactServicePartsSchema.id, partId),
          isProvider
            ? eq(jobVehicleContactServicePartsSchema.provider_id, providerId)
            : undefined
        )
      )
      .returning();

    if (!deleted.length) throw new TruckupNotFoundError();

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
