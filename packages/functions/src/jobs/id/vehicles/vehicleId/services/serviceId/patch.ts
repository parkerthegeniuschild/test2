import assert from 'node:assert/strict';
import { getJobById, getVehicleById, setIsAbandoned } from '@core/jobs';
import { ApiHandler, useJsonBody } from 'sst/node/api';
import { buildUpdatedProperties } from '@utils/helpers';
import { response } from '@utils/response';
import { TruckupForbiddenError, TruckupNotFoundError } from 'src/errors';
import { useAuth, userIsAgent, userIsProvider } from 'clients/auth';
import { ZodError } from 'zod';
import {
  JobVehicleContactServicesStatus,
  jobVehicleContactServices as jobVehicleContactServicesSchema,
  updateJobVehicleContactServiceSchema,
} from 'db/schema/jobVehicleContactServices';
import { useDb } from 'db/dbClient';
import { jobVehicleContactServiceUpdatePath } from 'dto/jobVehicleContact/service';
import { and, eq } from 'drizzle-orm';
import { validateServiceStatusChange } from '@core/serviceTimers';
import { JobStatuses } from '@utils/constants';
import { changeJobStatusId } from '@db/jobs';
import { services as servicesSchema } from 'db/schema/services';

export const handler = ApiHandler(async (_evt) => {
  try {
    assert.ok(_evt.body, 'Missing payload');

    const {
      id: jobId,
      vehicleId,
      serviceId,
    } = jobVehicleContactServiceUpdatePath.parse(_evt.pathParameters);

    const vehicle = await getVehicleById(vehicleId);
    const job = await getJobById(jobId);

    const { providerId } = useAuth();
    const isProvider = userIsProvider() && !!providerId;
    if (!(userIsAgent() || isProvider)) throw new TruckupForbiddenError();

    if (!job || !vehicle || vehicle.job_id !== jobId)
      throw new TruckupNotFoundError();

    if (isProvider && job.provider_id !== providerId) {
      throw new TruckupForbiddenError();
    }

    const { keep_working, ...updates } =
      updateJobVehicleContactServiceSchema.parse(useJsonBody());

    const isUpdatingOtherColumnThanStatus = Object.keys(updates).find(
      (column) => column !== jobVehicleContactServicesSchema.status.name
    );

    if (isProvider && isUpdatingOtherColumnThanStatus) {
      throw new TruckupForbiddenError();
    }

    const { updated_by, updated_at } = buildUpdatedProperties(_evt);

    let rateCents: number;

    if (updates.service_id && job.status_id === JobStatuses.DRAFT) {
      const serviceDB = await useDb()
        .select({ rate_value: servicesSchema.rate_value })
        .from(servicesSchema)
        .where(eq(servicesSchema.id, updates.service_id));

      if (serviceDB.length) rateCents = Number(serviceDB[0].rate_value) * 100;
    }

    let service;

    await useDb().transaction(async (tx) => {
      const services = await tx
        .update(jobVehicleContactServicesSchema)
        .set({
          ...updates,
          ...(rateCents && { rate_cents: rateCents }),
          updated_by,
          updated_at,
        })
        .where(
          and(
            eq(jobVehicleContactServicesSchema.id, serviceId),
            eq(
              jobVehicleContactServicesSchema.job_vehicle_contact_id,
              vehicleId
            )
          )
        )
        .returning();

      if (!services.length) throw new TruckupNotFoundError();

      [service] = services;

      if (updates.status && job.provider_id) {
        await validateServiceStatusChange(
          {
            jobId,
            jobVehicleContactServiceId: serviceId,
            providerId: job.provider_id,
            author: updated_by,
            status: updates.status,
            keepWorking: keep_working || false,
          },
          tx
        );

        if (
          updates.status === JobVehicleContactServicesStatus.STARTED &&
          job.status_id &&
          [
            JobStatuses.ACCEPTED.valueOf(),
            JobStatuses.PAUSE.valueOf(),
          ].includes(job.status_id)
        ) {
          await changeJobStatusId({
            jobId: job.id,
            newStatus: JobStatuses.IN_PROGRESS,
            author: updated_by,
            dbInstance: tx,
          });
        }
      }

      await setIsAbandoned(
        jobId,
        {
          is_abandoned: false,
          updated_by,
          updated_at,
        },
        tx
      );
    });

    return response.success(service);
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
