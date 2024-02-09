import {
  jobs as jobsSchema,
  jobsRelations,
  SelectJobSchemaForProviderValidation,
} from 'db/schema/jobs';
import {
  providers as providersSchema,
  providersRelations,
} from 'db/schema/providers';
import { dispatchers as dispatchersSchema } from 'db/schema/dispatchers';
import { companies as companiesSchema } from 'db/schema/companies';
import {
  jobDrivers as jobDriversSchema,
  jobDriversRelations,
} from 'db/schema/jobDrivers';
import {
  jobVehicleContactsRelations,
  jobVehicleContacts as jobVehicleContactsSchema,
} from 'db/schema/jobVehicleContacts';
import {
  IJobVehicleContactServicePublished,
  createJobVehicleContactServiceSchema,
  jobVehicleContactServicesRelations,
  jobVehicleContactServices as jobVehicleContactServicesSchema,
} from 'db/schema/jobVehicleContactServices';
import {
  ISelectJobVehicleContactServicePartSchemaForPublish,
  createJobVehicleContactServicePartSchema,
  jobVehicleContactServicePartsRelations,
  jobVehicleContactServiceParts as jobVehicleContactServicePartsSchema,
} from 'db/schema/jobVehicleContactServiceParts';
import {
  providerPositions as providerPositionsSchema,
  providerPositionsRelations,
} from 'db/schema/providerPositions';
import { providerLocations as providerLocationsSchema } from 'db/schema/providerLocations';
import { services as servicesSchema } from 'db/schema/services';
import { serviceTimers as serviceTimersSchema } from 'db/schema/serviceTimers';
import { SQL, eq, sql } from 'drizzle-orm';
import assert from 'node:assert/strict';
import { orderedJoin, useDb } from 'db/dbClient';

import { ITupAuth, useAuth, userIsAgent, userIsProvider } from 'clients/auth';
import {
  TruckupBadRequestError,
  TruckupForbiddenError,
  TruckupInternalServerErrorError,
  TruckupNotFoundError,
} from 'src/errors';
import { z } from 'zod';
import { DateTime } from 'luxon';
import { dbJobPhotos, jobPhotosRelations } from 'db/schema/jobPhotos';
import { IJobVehicleContactUpdatePath } from 'dto/jobVehicleContact/update';
import { IJobVehicleContactServiceUpdatePath } from 'dto/jobVehicleContact/service';
import { PARTS_DEFAULT_MARKUP, PARTS_MIN_MARKUP } from '@utils/config';
import { type TDatabaseOrTransaction } from '@utils/dbTransaction';
import { dbJobComments, jobCommentsRelations } from 'db/schema/jobComments';
import { getServiceById as getServiceByIdDB } from '@db/services';
import { JobStatuses } from '@utils/constants';
import {
  jobRequests as jobRequestsSchema,
  jobRequestsRelations,
} from 'db/schema/jobRequests';
import { geoDistanceQuery } from './geo';
import { JobPhotos } from './jobPhotos';

export const db = useDb({
  jobs: jobsSchema,
  jobsRelations,
  providers: providersSchema,
  providersRelations,
  providerPositions: providerPositionsSchema,
  providerPositionsRelations,
  providerLocations: providerLocationsSchema,
  dispatchers: dispatchersSchema,
  companies: companiesSchema,
  jobComments: dbJobComments,
  jobCommentsRelations,
  jobDrivers: jobDriversSchema,
  jobDriversRelations,
  jobPhotos: dbJobPhotos,
  jobPhotosRelations,
  jobRequests: jobRequestsSchema,
  jobRequestsRelations,
  jobVehicleContacts: jobVehicleContactsSchema,
  jobVehicleContactsRelations,
  jobVehicleContactServices: jobVehicleContactServicesSchema,
  jobVehicleContactServicesRelations,
  jobVehicleContactServiceParts: jobVehicleContactServicePartsSchema,
  jobVehicleContactServicePartsRelations,
  services: servicesSchema,
  serviceTimers: serviceTimersSchema,
});

export const STATUS_PROVIDER_ON_JOB = [
  JobStatuses.ACCEPTED,
  JobStatuses.IN_PROGRESS,
  JobStatuses.PAUSE,
];

export const checkIsOnJobStatus = (status: string) =>
  (STATUS_PROVIDER_ON_JOB as string[]).includes(status);

export async function getOnlyJobById(id: number) {
  assert.ok(id, `Invalid job id: ${id}`);

  const job = await db.select().from(jobsSchema).where(eq(jobsSchema.id, id));

  return job.length ? job[0] : undefined;
}

export async function getJobById(
  id: number,
  dbInstance: TDatabaseOrTransaction = db
) {
  assert.ok(id, `Invalid job id: ${id}`);

  const jobPromise = (dbInstance as typeof db).query.jobs
    .findFirst({
      where: eq(jobsSchema.id, id),
      with: {
        provider: {
          with: {
            position: {
              columns: {
                position: false,
              },
              extras: {
                distance: geoDistanceQuery(
                  {
                    latitude: jobsSchema.location_latitude,
                    longitude: jobsSchema.location_longitude,
                  },
                  providerPositionsSchema.position
                ).as('distance'),
              },
              with: {
                location: true,
              },
            },
          },
        },
        company: true,
        dispatcher: true,
        jobDrivers: true,
        jobVehicles: {
          with: {
            jobServices: {
              with: {
                jobServiceParts: true,
                service: true,
              },
            },
            jobPhotos: orderedJoin,
          },
        },
      },
    })
    .execute();

  const commentsCountPromise = dbInstance
    .select({
      vehicleId: dbJobComments.vehicleId,
      commentsCount: sql`count('*')`.mapWith(Number),
    })
    .from(dbJobComments)
    .where(eq(dbJobComments.jobId, id))
    .groupBy(dbJobComments.vehicleId);

  const [job, commentData] = await Promise.all([
    jobPromise,
    commentsCountPromise,
  ]);

  return (
    job && {
      ...job,
      jobVehicles: await Promise.all(
        job.jobVehicles.map(async (e) => ({
          ...e,
          jobPhotos: await Promise.all(
            e.jobPhotos.map((p) => JobPhotos.formatUrl(p))
          ),
          commentsCount:
            commentData.find(({ vehicleId }) => vehicleId === e.id)
              ?.commentsCount ?? 0,
        }))
      ),
      ...createMockJobTimerData(job),
    }
  );
}

export async function getJobAndVehicle({
  jobId,
  vehicleId,
  dbInstance = db,
}: {
  jobId: number;
  vehicleId: number;
  dbInstance: TDatabaseOrTransaction;
}) {
  const job = await getJobById(jobId, dbInstance);
  const vehicle = job?.jobVehicles?.find((v) => v.id === vehicleId);
  // this helps typescript return a better type, where a vehicle implies an existing job
  if (vehicle) return { job, vehicle };
  return { job, vehicle };
}

export async function getJobAndPhoto({
  jobId,
  photoId,
}: {
  jobId: number;
  photoId: number;
}) {
  const job = await getJobById(jobId);
  const photos = job?.jobVehicles
    ? job.jobVehicles.map((e) => e.jobPhotos).flat()
    : [];
  const photo = photos.find((p) => p.id === photoId);
  if (photo) return { job, photo };
  return { job, photo };
}

// We will remove this as we replace with real data
function createMockJobTimerData(job: { created_at: Date }) {
  const time = DateTime.fromJSDate(job.created_at);
  return {
    timer_is_running: true,
    timer_timestamp: DateTime.now()
      .minus({ hours: 1 })
      .set({
        minute: time.minute,
        second: time.second,
        millisecond: time.millisecond,
      })
      .toJSDate()
      .toISOString(),
    timer_amount: 1043179,
  };
}

export function jobAccessValidation(job: SelectJobSchemaForProviderValidation) {
  const isAgent = userIsAgent();
  const isProvider = userIsProvider();
  const auth = useAuth();

  if (!isAgent && !isProvider) {
    throw new TruckupForbiddenError();
  }

  if (isProvider && job.provider_id !== (auth.providerId || 0)) {
    throw new TruckupNotFoundError();
  }
}

export async function getVehicleById(id: number) {
  assert.ok(id, `Invalid vehicle id: ${id}`);

  return await db.query.jobVehicleContacts
    .findFirst({
      where: eq(jobVehicleContactsSchema.id, id),
    })
    .execute();
}

export async function getServiceById(
  id: number,
  dbInstance: TDatabaseOrTransaction = db
) {
  assert.ok(id, `Invalid service id: ${id}`);

  const service = await (
    dbInstance as typeof db
  ).query.jobVehicleContactServices.findFirst({
    where: eq(jobVehicleContactServicesSchema.id, id),
    with: {
      jobVehicle: {
        with: {
          job: true,
        },
      },
    },
  });

  return service;
}

export async function getPartById(id: number) {
  assert.ok(id, `Invalid part id: ${id}`);

  return await db.query.jobVehicleContactServiceParts
    .findFirst({
      where: eq(jobVehicleContactServicePartsSchema.id, id),
      with: {
        jobVehicleService: {
          with: {
            jobVehicle: {
              with: {
                job: true,
              },
            },
          },
        },
      },
    })
    .execute();
}

const setIsAbandonedUpdateData = z.object({
  is_abandoned: z.boolean(),
  updated_by: z.string(),
  updated_at: z.custom<SQL>(),
});
export type SetIsAbandonedUpdateData = z.infer<typeof setIsAbandonedUpdateData>;

export async function setIsAbandoned(
  jobId: number,
  updateData: SetIsAbandonedUpdateData,
  tx: TDatabaseOrTransaction = db
) {
  return await tx
    .update(jobsSchema)
    .set(updateData)
    .where(eq(jobsSchema.id, jobId))
    .execute();
}

export type ISaveJobVehicleContactService = {
  pathParams: IJobVehicleContactUpdatePath;
  body: IJobVehicleContactServicePublished;
  auth: ITupAuth;
  dbInstance: TDatabaseOrTransaction;
};

export async function saveJobVehicleContactService({
  pathParams,
  body,
  dbInstance,
  auth,
}: ISaveJobVehicleContactService) {
  const { id: jobId, vehicleId } = pathParams;

  const { job, vehicle } = await getJobAndVehicle({
    jobId,
    vehicleId,
    dbInstance,
  });

  const { providerId, username } = auth;
  const isAuthorizedAgent = userIsAgent(auth);
  const isAuthorizedProvider =
    !isAuthorizedAgent &&
    userIsProvider(auth) &&
    providerId &&
    providerId === job?.provider_id;
  if (!(isAuthorizedAgent || isAuthorizedProvider))
    throw new TruckupForbiddenError();

  if (!job || !vehicle || vehicle.job_id !== jobId)
    throw new TruckupNotFoundError();

  const serviceDB = await getServiceByIdDB({
    id: Number(body.service_id),
    dbInstance,
  });

  const created_by = username;

  const jobVehicleContactService =
    createJobVehicleContactServiceSchema.parse(body);

  const service = await dbInstance
    .insert(jobVehicleContactServicesSchema)
    .values({
      ...jobVehicleContactService,
      job_vehicle_contact_id: vehicleId,
      created_by,
      provider_id: isAuthorizedProvider ? providerId : undefined,
      rate_cents: Number(serviceDB?.rate_value || 0) * 100,
    })
    .returning();

  if (Array.isArray(body.parts) && body.parts.length > 0) {
    const promiseList = body.parts.map(
      (part: ISelectJobVehicleContactServicePartSchemaForPublish) =>
        saveJobVehicleContactServicePart({
          pathParams: {
            ...pathParams,
            serviceId: service[0].id,
          },
          body: part,
          auth,
          dbInstance,
        })
    );
    await Promise.all(promiseList);
  }

  return service[0];
}

export type ISaveJobVehicleContactServicePart = {
  pathParams: IJobVehicleContactServiceUpdatePath;
  body: ISelectJobVehicleContactServicePartSchemaForPublish;
  auth: ITupAuth;
  dbInstance: TDatabaseOrTransaction;
};

export async function saveJobVehicleContactServicePart({
  pathParams,
  body,
  auth,
  dbInstance = db,
}: ISaveJobVehicleContactServicePart) {
  const { id: jobId, vehicleId, serviceId } = pathParams;

  const jobVehicleContactServicePart =
    createJobVehicleContactServicePartSchema.parse(body);

  if (
    jobVehicleContactServicePart.markup &&
    jobVehicleContactServicePart.markup < PARTS_MIN_MARKUP
  )
    throw new TruckupBadRequestError('markup is too small');

  const service = await getServiceById(serviceId, dbInstance);
  const { providerId, username } = auth;
  const isProvider = userIsProvider(auth) && !!providerId;

  if (!(userIsAgent(auth) || isProvider)) throw new TruckupForbiddenError();

  if (
    !service ||
    service.jobVehicle.id !== vehicleId ||
    service.jobVehicle.job_id !== jobId
  )
    throw new TruckupNotFoundError();

  if (userIsProvider(auth) && service.jobVehicle.job.provider_id !== providerId)
    throw new TruckupNotFoundError();

  const created_by = username;

  const part = await dbInstance
    .insert(jobVehicleContactServicePartsSchema)
    .values({
      ...jobVehicleContactServicePart,
      price_cents: calculatePriceCents(jobVehicleContactServicePart),
      job_vehicle_contact_service_id: serviceId,
      created_by,
      provider_id: isProvider ? providerId : undefined,
      markup: isProvider
        ? PARTS_DEFAULT_MARKUP
        : jobVehicleContactServicePart.markup || PARTS_DEFAULT_MARKUP,
    })
    .returning();

  return part[0];
}

type TCalculatePriceCentsParams = Pick<
  z.infer<typeof createJobVehicleContactServicePartSchema>,
  'price'
>;
const calculatePriceCents = ({ price }: TCalculatePriceCentsParams) => {
  if (price === null || price === undefined) return price;
  const float = Number.parseFloat(price);
  if (Number.isNaN(float))
    throw new TruckupInternalServerErrorError(`Failed to calculate price`);
  const converted = float * 100;
  const ceiled = Math.ceil(converted);
  if (converted !== ceiled)
    throw new TruckupInternalServerErrorError(`Bad part price: ${price}`);
  return ceiled;
};
