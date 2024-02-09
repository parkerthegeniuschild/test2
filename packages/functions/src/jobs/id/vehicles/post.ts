import {
  getJobById,
  saveJobVehicleContactService,
  setIsAbandoned,
  db,
  jobAccessValidation,
} from '@core/jobs';
import { buildBy, buildUpdatedProperties } from '@utils/helpers';
import { useAuth } from 'clients/auth';
import { IJobVehicleContactServicePublished } from 'db/schema/jobVehicleContactServices';
import { TruckupNotFoundError } from 'src/errors';
import {
  jobVehicleContacts as jobVehicleContactsSchema,
  createJobVehicleContactSchema,
} from 'db/schema/jobVehicleContacts';
import { jobVehicleContactPostPath } from 'dto/jobVehicleContact/create';
import TupApiHandler from 'handlers/TupApiHandler';
import { useJsonBody, usePathParams } from 'sst/node/api';

export const handler = TupApiHandler(
  async ({ event }) => {
    const auth = useAuth();
    const pathParams = usePathParams();
    const body = useJsonBody();

    const { id: jobId } = jobVehicleContactPostPath.parse(pathParams);

    const job = await getJobById(jobId);

    if (!job) throw new TruckupNotFoundError();

    // our type here is not good until getJobById improves it's return
    jobAccessValidation(job as unknown as { provider_id: number });

    const created_by = buildBy(event);

    const jobVehicleContact = createJobVehicleContactSchema.parse({
      ...body,
      job_id: job.id,
      created_by,
      created_by_id: auth.userId,
      created_by_role: auth.roles[0],
    });

    let returnedVehicle;

    await db.transaction(async (tx) => {
      const vehicle = await tx
        .insert(jobVehicleContactsSchema)
        .values(jobVehicleContact)
        .returning();

      if (Array.isArray(body.services) && body.services.length > 0) {
        const promiseList = body.services.map(
          (service: IJobVehicleContactServicePublished) =>
            saveJobVehicleContactService({
              pathParams: {
                id: jobId,
                vehicleId: vehicle[0].id,
              },
              body: service,
              auth: useAuth(),
              dbInstance: tx,
            })
        );
        await Promise.all(promiseList);
      }

      const { updated_by, updated_at } = buildUpdatedProperties(event);

      await setIsAbandoned(job.id, {
        is_abandoned: false,
        updated_by,
        updated_at,
      });

      [returnedVehicle] = vehicle;
    });
    return returnedVehicle;
  },
  { response: { statusCode: 201 } }
);
