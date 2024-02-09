import { jobs as jobsSchema, createJobSchema } from 'db/schema/jobs';
import { ApiHandler } from 'sst/node/api';
import assert from 'node:assert';
import { useDb } from 'db/dbClient';
import { buildBy, getDefaultJobRateCents } from '@utils/helpers';
import { response } from '@utils/response';
import {
  jobVehicles as jobVehicleSchema,
  createJobVehicleSchema,
} from 'db/schema/JobVehicles';
import { jobCreationStep1Payload } from 'dto/jobs/post';
import { jobDrivers as jobDriversSchema } from 'db/schema/jobDrivers';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export const handler = ApiHandler(async (_evt: APIGatewayProxyEventV2) => {
  assert.ok(_evt.body, 'Missing payload');

  const evt = JSON.parse(_evt.body);

  return evt.status === 'UNASSIGNED'
    ? await legacyPost(_evt)
    : await step1Post(_evt);
});

async function step1Post(_evt: APIGatewayProxyEventV2) {
  const created_by = buildBy(_evt);

  const body = JSON.parse(_evt.body || '{}');
  const { drivers, ...jobData } = jobCreationStep1Payload.parse(body);

  const job = createJobSchema.parse({ ...jobData, created_by });

  const defaultJobRateCents = await getDefaultJobRateCents();

  try {
    let insertedJob;
    await useDb().transaction(async (tx) => {
      try {
        insertedJob = await useDb()
          .insert(jobsSchema)
          .values({
            ...job,
            charge_callout_cents: defaultJobRateCents.callout,
            charge_rate_cents: defaultJobRateCents.rate,
            charge_fuel_surcharge_cents: defaultJobRateCents.fuelSurcharge,
          })
          .returning();
        if (drivers.length) {
          const job_id = insertedJob[0].id;
          const insertedDriversPromise = drivers.map((driver) =>
            useDb()
              .insert(jobDriversSchema)
              .values({ ...driver, job_id, created_by })
          );
          await Promise.all(insertedDriversPromise);
        }
      } catch (error) {
        await tx.rollback();
      }
    });
    return response.success(insertedJob);
  } catch (error) {
    return response.error(error);
  }
}

async function legacyPost(_evt: APIGatewayProxyEventV2) {
  const evt = JSON.parse(_evt.body || '{}');
  const { vehicle_id, vehicle_issue, ...body } = evt;
  const created_by = buildBy(_evt);

  const { id, ...job } = createJobSchema.parse({ ...body, created_by });
  const { ...jobVehicle } = createJobVehicleSchema.parse({
    job_id: id,
    vehicle_id,
    vehicle_issue,
    created_by,
  });

  const [insertedJob] = await Promise.all([
    useDb()
      .insert(jobsSchema)
      .values({ id, ...job })
      .returning(),
    useDb()
      .insert(jobVehicleSchema)
      .values({ ...jobVehicle }),
  ]);

  return response.success(insertedJob);
}
