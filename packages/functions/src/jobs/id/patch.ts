import { db, getOnlyJobById, jobAccessValidation } from '@core/jobs';
import { buildUpdatedProperties } from '@utils/helpers';
import { jobs as jobsSchema, patchJobSchema } from 'db/schema/jobs';
import { jobDrivers as jobDriversSchema } from 'db/schema/jobDrivers';
import { eq } from 'drizzle-orm';
import { DriverCreationPayload, driverCreationPayload } from 'dto/jobs/post';
import { z } from 'zod';
import TupApiHandler from 'handlers/TupApiHandler';
import {
  TruckupInternalServerErrorError,
  TruckupNotFoundError,
} from 'src/errors';
import { useJsonBody, usePathParams } from 'sst/node/api';
import { PathIdScalar } from '@utils/schema';

const pathParamsSchema = z.object({ id: PathIdScalar });

export const handler = TupApiHandler(async ({ event }) => {
  const { id: jobId } = pathParamsSchema.parse(usePathParams());

  const job = await getOnlyJobById(jobId);

  if (!job) {
    throw new TruckupNotFoundError();
  }

  jobAccessValidation(job);

  const { drivers, ...body } = useJsonBody();

  let jobDrivers: DriverCreationPayload[];

  if (drivers) {
    jobDrivers = z.array(driverCreationPayload).parse(drivers);
  }

  const updatedProps = buildUpdatedProperties(event);

  const { ...updates } = patchJobSchema.parse({ ...body });

  await db.transaction(async (tx) => {
    const [original = undefined] = await tx
      .update(jobsSchema)
      .set({ ...updates, is_abandoned: false, ...updatedProps })
      .where(eq(jobsSchema.id, jobId))
      .returning();
    if (!original) throw new TruckupInternalServerErrorError();

    if (jobDrivers) {
      await tx
        .delete(jobDriversSchema)
        .where(eq(jobDriversSchema.job_id, jobId));
      const insertedDriversPromise = jobDrivers.map((driver) =>
        tx.insert(jobDriversSchema).values({
          ...driver,
          job_id: jobId,
          created_by: updatedProps.updated_by,
        })
      );
      await Promise.all(insertedDriversPromise);
    }
  });

  return { ...body, drivers };
});
