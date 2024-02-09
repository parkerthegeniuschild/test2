/* eslint-disable */
/* This legacy file has linting disabled. We should remove this file, or should fix the lint if we decide to keep it */
import {
  jobRequests as jobRequestsSchema,
  jobRequestsRelations,
} from 'db/schema/jobRequests';
import { jobs as jobsSchema, jobsRelations, jobs } from 'db/schema/jobs';
import {
  providerLocations as providerLocationsSchema,
  providerLocationsRelations,
} from 'db/schema/providerLocations';
import {
  providers as providersSchema,
  providersRelations,
} from 'db/schema/providers';
import { and, eq, inArray, sql } from 'drizzle-orm';
import haversine from 'haversine';
import { Dictionary, groupBy, orderBy } from 'lodash';
import { useDb } from 'db/dbClient';
import {
  TruckupForbiddenError,
  TruckupInternalServerErrorError,
  TruckupNotFoundError,
} from 'src/errors';
import { userIsAgent } from 'clients/auth';
import { z } from 'zod';
import { PathIdScalar, PathPositiveIntScalar } from '@utils/schema';
import TupApiHandler from 'handlers/TupApiHandler';
import { useQueryParams } from 'sst/node/api';
import { Provider } from '@core/provider';

const statusForOnline = [
  'UNASSIGNED',
  'NOTIFYING',
  'ACCEPTED',
  'MANUAL',
  'PAUSE',
  'IN_PROGRESS',
  'COMPLETED_PENDING_REVIEW',
  'COMPLETED',
  'CANCELED',
];
const statusForOffline = [
  'UNASSIGNED',
  'COMPLETED_PENDING_REVIEW',
  'COMPLETED',
  'CANCELED',
];

const db = useDb({
  providers: providersSchema,
  providerRelations: providersRelations,
  jobs: jobsSchema,
  jobsRelations,
  jobsRequests: jobRequestsSchema,
  jobRequestsRelations,
  providerLocations: providerLocationsSchema,
  providerLocationsRelations,
});

const queryParamsSchema = z.object({
  jobId: PathIdScalar,
  jobRadius: PathPositiveIntScalar.optional(),
});

export const handler = TupApiHandler(async (_evt) => {
  if (!userIsAgent()) throw new TruckupForbiddenError();

  const { jobId, jobRadius = 150 } = queryParamsSchema.parse(useQueryParams());

  const [[jobById = undefined], jobRequest, maxProviderLocationIds] =
    await Promise.all([
      db.select().from(jobsSchema).where(eq(jobsSchema.id, jobId)).execute(),
      db.query.jobsRequests
        .findMany({
          where: (jobsRequests, { eq }) => eq(jobsRequests.job_id, jobId),
          with: { providers: true },
        })
        .execute(),
      db
        .select({
          maxid: sql<string>`max(${providerLocationsSchema.id})`,
          provider_id: providerLocationsSchema.provider_id,
        })
        .from(providerLocationsSchema)
        .groupBy(providerLocationsSchema.provider_id)
        .execute(),
    ]);
  if (!jobById) throw new TruckupNotFoundError();
  const { location_latitude, location_longitude } = jobById;
  if (!location_latitude || !location_longitude)
    throw new TruckupInternalServerErrorError(`Job is in a bad state`);

  const providerLocationIds = maxProviderLocationIds.map(({ maxid }) =>
    Number(maxid)
  );
  const allMaxProviderLocations: any[] = await db
    .select({
      id: providerLocationsSchema.id,
      longitude: providerLocationsSchema.longitude,
      latitude: providerLocationsSchema.latitude,
      provider_id: providerLocationsSchema.provider_id,
    })
    .from(providerLocationsSchema)
    .where(inArray(providerLocationsSchema.id, providerLocationIds))
    .execute();

  const maxProviderLocations: {
    maxid: string;
    provider_id: number;
    longitude: number | null;
    latitude: number | null;
    distance?: number;
  }[] = allMaxProviderLocations.filter(
    filterByDistance({ location_latitude, location_longitude }, jobRadius)
  );

  const providerIdArray = maxProviderLocations.map(
    ({ provider_id }) => provider_id
  );

  const [maxProviders, maxJobsIds, jobRequests] = await Promise.all([
    db
      .select({
        is_online: providersSchema.is_online,
        is_onjob: Provider.calculate.isOnJob,
        is_blocked: Provider.calculate.isBlocked,
        rating: providersSchema.rating,
        firstname: providersSchema.firstname,
        lastname: providersSchema.lastname,
        id: providersSchema.id,
      })
      .from(providersSchema)
      .where(inArray(providersSchema.id, providerIdArray))
      .leftJoin(jobs, Provider.condition.jobIsOnJob)
      .groupBy(providersSchema.id)
      .execute(),
    db
      .select({
        maxid: sql<string>`max(${jobsSchema.id})`,
        provider_id: jobsSchema.provider_id,
      })
      .from(jobsSchema)
      .groupBy(jobsSchema.provider_id)
      .innerJoin(
        providersSchema,
        eq(jobsSchema.provider_id, providersSchema.id)
      )
      .execute(),
    db.query.jobsRequests
      .findMany({
        where: inArray(jobRequestsSchema.provider_id, providerIdArray),
        columns: {
          id: true,
          provider_id: true,
          status: true,
        },
      })
      .execute(),
  ]);

  const jobIds = maxJobsIds.map(({ maxid }) => Number(maxid));

  const maxJobs: any[] = await db
    .select({
      id: jobsSchema.id,
      status_id: jobsSchema.status_id,
      provider_id: jobsSchema.provider_id,
    })
    .from(jobsSchema)
    .where(inArray(jobsSchema.id, jobIds))
    .execute();

  const jobObjByProviderId = groupBy(maxJobs, 'provider_id');
  const providerObjById = groupBy(maxProviders, 'id');
  const jobRequestsByProviderId = groupBy(jobRequests, 'provider_id');

  const { mappedProviderLocation, jobRequestWithProviderName } = formatItems(
    maxProviderLocations,
    providerObjById,
    jobObjByProviderId,
    jobRequest,
    jobRequestsByProviderId
  );

  return {
    providers: mappedProviderLocation,
    requests: jobRequestWithProviderName,
  };
});

function filterByDistance(
  jobById: {
    location_latitude: number;
    location_longitude: number;
  },
  jobRadius: string | number
): (value: any, index: number, array: any[]) => unknown {
  return (providerLocation) => {
    const { longitude, latitude } = providerLocation;
    const distance = haversine(
      { latitude, longitude },
      {
        latitude: jobById.location_latitude,
        longitude: jobById.location_longitude,
      },
      { unit: 'mile' }
    );

    if (distance > Number(jobRadius)) {
      return false;
    }

    providerLocation.distance = distance;
    return true;
  };
}

function formatItems(
  maxProviderLocations: {
    maxid: string;
    provider_id: number;
    longitude: number | null;
    latitude: number | null;
    distance?: number | undefined;
  }[],
  providerObjById: Dictionary<
    {
      is_online: boolean;
      is_onjob: boolean;
      is_blocked: boolean;
      rating: string | null;
      firstname: string | null;
      lastname: string | null;
      id: number;
    }[]
  >,
  jobObjByProviderId: Dictionary<any[]>,
  jobRequest: {
    id: number;
    created_by: string;
    created_at: Date;
    updated_by: string | null;
    updated_at: Date | null;
    provider_id: number | null;
    job_id: number;
    dispatcher_id: number | null;
    service_area_id: number;
    location_address: string;
    location_state: string;
    location_city: string;
    location_details: string;
    location_notes: string | null;
    location_latitude: number;
    location_longitude: number;
    response_time: Date | null;
    status: string;
    distance: number | null;
    duration: number | null;
    providers: {
      id: number;
      created_by: string;
      created_at: Date;
      updated_by: string | null;
      updated_at: Date | null;
      firstname: string | null;
      lastname: string | null;
      company_id: number | null;
      phone: string | null;
      email: string | null;
      address: string | null;
      city: string | null;
      state: string | null;
      zip: string | null;
      is_blocked: boolean;
      balance: string;
      status_change_date: Date | null;
      is_online: boolean;
      app_user_id: number;
      provider_type: string | null;
      rating: string | null;
      firebase_uid: number | null;
    } | null;
  }[],
  jobRequestsByProviderId: Dictionary<
    { id: number; provider_id: number | null; status: string }[]
  >
) {
  const jobRequestWithProviderName = jobRequest.map((jobRequest) => {
    return {
      id: jobRequest.id,
      createdBy: jobRequest.created_by,
      createdAt: jobRequest.created_at,
      updatedBy: jobRequest.updated_by,
      updatedAt: jobRequest.updated_at,
      dispatcherId: jobRequest.dispatcher_id,
      providerId: jobRequest.provider_id,
      serviceAreaId: jobRequest.service_area_id,
      locationAddress: jobRequest.location_address,
      locationState: jobRequest.location_state,
      locationCity: jobRequest.location_city,
      locationDetails: jobRequest.location_details,
      locationNotes: jobRequest.location_notes,
      locationLatitude: jobRequest.location_latitude,
      locationLongitude: jobRequest.location_longitude,
      responseTime: jobRequest.response_time,
      jobId: jobRequest.job_id,
      status: jobRequest.status,
      distance: jobRequest.distance,
      duration: jobRequest.duration,
      providerName: `${jobRequest.providers?.firstname} ${jobRequest.providers?.lastname}`,
    };
  });

  const mappedProviderLocation = maxProviderLocations
    .filter((providerLocation) => {
      const providerInfo = providerObjById[providerLocation.provider_id]?.[0];
      const jobInfo = jobObjByProviderId[providerLocation.provider_id]?.[0];

      if (!providerInfo || providerInfo.is_blocked === true) {
        return false;
      }

      if (
        jobInfo &&
        ((providerInfo.is_online &&
          !statusForOnline.includes(jobInfo.status_id)) ||
          (!providerInfo.is_online &&
            !statusForOffline.includes(jobInfo.status_id)))
      ) {
        return false;
      }

      return true;
    })
    .map((providerLocation) => {
      const providerInfo = providerObjById[providerLocation.provider_id][0];
      const jobInfo = jobObjByProviderId[providerLocation.provider_id]?.[0];
      const jobRequests = jobRequestsByProviderId[providerLocation.provider_id]
        ?.length
        ? orderBy(
            jobRequestsByProviderId[providerLocation.provider_id],
            'id',
            'desc'
          )
        : false;
      const lastJobRequestStatus = jobRequests
        ? jobRequests[0].status
        : 'UNASSIGNED';

      return {
        id: providerInfo.id,
        name: `${providerInfo.firstname} ${providerInfo.lastname}`,
        rating: providerInfo.rating,
        longitude: providerLocation.longitude ?? null,
        latitude: providerLocation.latitude ?? null,
        acceptedRate: jobRequests
          ? jobRequest.filter(
              (jobRequest) =>
                jobRequest.status === 'ACCEPTED' ||
                jobRequest.status === 'CANCELED'
            ).length / jobRequests.length
          : 0,
        notifying: lastJobRequestStatus === 'NOTIFYING',
        online: providerInfo.is_online,
        onJob: providerInfo.is_onjob,
        lastRequestStatus: jobInfo?.status_id || lastJobRequestStatus,
        distance: providerLocation.distance,
      };
    });
  return { mappedProviderLocation, jobRequestWithProviderName };
}
