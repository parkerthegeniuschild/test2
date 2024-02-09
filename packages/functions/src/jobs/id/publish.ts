import { db, getJobById } from '@core/jobs';
import { ApiHandler } from 'sst/node/api';
import { buildUpdatedProperties, getServiceAreaId } from '@utils/helpers';
import { response } from '@utils/response';
import {
  TruckupBadRequestError,
  TruckupForbiddenError,
  TruckupNotFoundError,
} from 'src/errors';
import { jobs as jobsSchema, selectJobSchemaForPublish } from 'db/schema/jobs';
import { and, eq, sql } from 'drizzle-orm';
import { userIsAgent } from 'clients/auth';
import { ZodError } from 'zod';
import { selectJobVehicleContactSchemaForPublish } from 'db/schema/jobVehicleContacts';
import { selectJobVehicleContactServiceSchemaForPublish } from 'db/schema/jobVehicleContactServices';
import { ERROR } from '@utils/constants';

export const handler = ApiHandler(async (_evt) => {
  try {
    if (!userIsAgent()) throw new TruckupForbiddenError();

    const id = _evt.pathParameters?.id ?? null;

    const job = await getJobById(Number(id));

    if (!job) {
      return response.notFound();
    }

    // Checking required fields
    selectJobSchemaForPublish.parse(job);

    // Checking if there is at least one vehicle assigned
    if (job.jobVehicles.length === 0) {
      throw new TruckupBadRequestError('At least one vehicle is required');
    }

    job.jobVehicles.forEach((vehicle) => {
      // Checking if all vehicles are valid
      selectJobVehicleContactSchemaForPublish.parse(vehicle);

      // Checking if there is at least one service assigned to each vehicle
      if (vehicle.jobServices.length === 0) {
        throw new TruckupBadRequestError(
          'At least one service is required for each vehicle'
        );
      }

      // Checking if all services are valid
      vehicle.jobServices.forEach((service) => {
        selectJobVehicleContactServiceSchemaForPublish.parse(service);
      });
    });

    const { updated_by, updated_at } = buildUpdatedProperties(_evt);

    await db
      .update(jobsSchema)
      .set({
        status_id: 'UNASSIGNED',
        service_area_id: sql`COALESCE(service_area_id, ${await getServiceAreaId()})`,
        updated_at,
        updated_by,
      })
      .where(
        and(
          eq(jobsSchema.id, Number(job.id)),
          eq(jobsSchema.status_id, 'DRAFT')
        )
      )
      .execute();

    const updatedJob = await getJobById(Number(id));

    return response.success(updatedJob);
  } catch (error) {
    switch (true) {
      case error instanceof ZodError:
        return response.error({
          error: ERROR.error400.missingRequiredFields,
        });
      case error instanceof TruckupBadRequestError:
        return response.error({
          error: error.message || ERROR.error400.missingRequiredFields,
        });
      case error instanceof TruckupForbiddenError:
        return response.forbidden();
      case error instanceof TruckupNotFoundError:
        return response.notFound();
      default:
        return response.failure(error);
    }
  }
});
