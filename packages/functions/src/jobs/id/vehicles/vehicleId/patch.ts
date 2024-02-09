import { useJsonBody, usePathParams } from 'sst/node/api';
import { buildUpdatedProperties } from '@utils/helpers';
import { TruckupForbiddenError, TruckupNotFoundError } from 'src/errors';
import {
  jobVehicleContacts as jobVehicleContactsSchema,
  updateJobVehicleContactSchema,
} from 'db/schema/jobVehicleContacts';
import { useDb } from 'db/dbClient';
import { userIsAgent, userIsProvider } from 'clients/auth';
import { and, eq } from 'drizzle-orm';
import { jobVehicleContactUpdatePath } from 'dto/jobVehicleContact/update';
import { setIsAbandoned } from '@core/jobs';
import TupApiHandler from 'handlers/TupApiHandler';

export const handler = TupApiHandler(
  async ({ event, auth }) => {
    const { id: jobId, vehicleId } = jobVehicleContactUpdatePath.parse(
      usePathParams()
    );

    const isAgent = userIsAgent(auth);
    const isProvider = userIsProvider(auth) && !!auth?.providerId;
    if (!isAgent && !isProvider) throw new TruckupForbiddenError();

    const updates = updateJobVehicleContactSchema.parse(useJsonBody());

    const { updated_by, updated_at } = buildUpdatedProperties(event);

    return await useDb().transaction(async (tx) => {
      const vehicle = await tx
        .update(jobVehicleContactsSchema)
        .set({ ...updates, updated_by, updated_at })
        .where(
          and(
            eq(jobVehicleContactsSchema.id, Number(vehicleId)),
            eq(jobVehicleContactsSchema.job_id, Number(jobId)),
            isProvider
              ? eq(jobVehicleContactsSchema.created_by_id, auth.userId)
              : undefined
          )
        )
        .returning();

      if (!vehicle.length) throw new TruckupNotFoundError();

      await setIsAbandoned(
        jobId,
        {
          is_abandoned: false,
          updated_by,
          updated_at,
        },
        tx
      );

      return vehicle[0];
    });
  },
  { auth: true }
);
