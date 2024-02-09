import { ApiHandler } from 'sst/node/api';
import { response } from '@utils/response';
import { TruckupForbiddenError, TruckupNotFoundError } from 'src/errors';
import { jobVehicleContacts as jobVehicleContactsSchema } from 'db/schema/jobVehicleContacts';
import { useDb } from 'db/dbClient';
import { userIsAgent } from 'clients/auth';
import { and, eq } from 'drizzle-orm';
import { ZodError } from 'zod';
import { jobVehicleContactUpdatePath } from 'dto/jobVehicleContact/update';

export const handler = ApiHandler(async (_evt) => {
  try {
    const { id: jobId, vehicleId } = jobVehicleContactUpdatePath.parse(
      _evt.pathParameters
    );

    if (!userIsAgent()) throw new TruckupNotFoundError();

    const vehicle = await useDb()
      .delete(jobVehicleContactsSchema)
      .where(
        and(
          eq(jobVehicleContactsSchema.id, Number(vehicleId)),
          eq(jobVehicleContactsSchema.job_id, Number(jobId))
        )
      )
      .returning();

    if (!vehicle.length) throw new TruckupNotFoundError();

    return response.success();
  } catch (error) {
    switch (true) {
      case error instanceof TruckupForbiddenError:
        return response.forbidden();
      case error instanceof TruckupNotFoundError:
        return response.notFound();
      case error instanceof ZodError:
        return response.error(error);
      default:
        return response.failure(error);
    }
  }
});
