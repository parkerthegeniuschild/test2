import assert from 'node:assert/strict';
import { getPartById, setIsAbandoned } from '@core/jobs';
import { ApiHandler, useJsonBody } from 'sst/node/api';
import { buildUpdatedProperties } from '@utils/helpers';
import { response } from '@utils/response';
import {
  TruckupBadRequestError,
  TruckupForbiddenError,
  TruckupNotFoundError,
} from 'src/errors';
import { useAuth, userIsAgent, userIsProvider } from 'clients/auth';
import { ZodError } from 'zod';
import { jobVehicleContactServicePartUpdatePath } from 'dto/jobVehicleContact/part';
import { useDb } from 'db/dbClient';
import {
  jobVehicleContactServiceParts as jobVehicleContactServicePartsSchema,
  updateJobVehicleContactServicePartSchema,
} from 'db/schema/jobVehicleContactServiceParts';
import { PARTS_DEFAULT_MARKUP, PARTS_MIN_MARKUP } from '@utils/config';
import { ERROR } from '@utils/constants';
import { and, eq } from 'drizzle-orm';

export const handler = ApiHandler(async (_evt) => {
  try {
    assert.ok(_evt.body, 'Missing payload');

    const {
      id: jobId,
      vehicleId,
      serviceId,
      partId,
    } = jobVehicleContactServicePartUpdatePath.parse(_evt.pathParameters);

    const jobVehicleContactServicePart =
      updateJobVehicleContactServicePartSchema.parse(useJsonBody());

    if (
      jobVehicleContactServicePart.markup &&
      jobVehicleContactServicePart.markup < PARTS_MIN_MARKUP
    )
      throw new TruckupBadRequestError();

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

    if (
      isProvider &&
      jobVehicleContactServicePart.markup &&
      !!jobVehicleContactServicePart.markup
    )
      throw new TruckupBadRequestError();

    const { updated_by, updated_at } = buildUpdatedProperties(_evt);

    const updated = await useDb()
      .update(jobVehicleContactServicePartsSchema)
      .set({
        ...jobVehicleContactServicePart,
        updated_by,
        updated_at,
        markup: isProvider
          ? PARTS_DEFAULT_MARKUP
          : jobVehicleContactServicePart.markup || PARTS_DEFAULT_MARKUP,
      })
      .where(
        and(
          eq(jobVehicleContactServicePartsSchema.id, partId),
          isProvider
            ? eq(jobVehicleContactServicePartsSchema.provider_id, providerId)
            : undefined
        )
      )
      .returning();

    if (!updated.length) throw new TruckupNotFoundError();

    await setIsAbandoned(jobId, {
      is_abandoned: false,
      updated_by,
      updated_at,
    });

    return response.success(updated[0]);
  } catch (error) {
    switch (true) {
      case error instanceof TruckupForbiddenError:
        return response.forbidden();
      case error instanceof TruckupNotFoundError:
        return response.notFound();
      case error instanceof TruckupBadRequestError:
        return response.error({
          error: ERROR.error400.missingRequiredFields,
        });
      case error instanceof assert.AssertionError:
      case error instanceof ZodError:
        return response.error(error);
      default:
        return response.failure(error);
    }
  }
});
