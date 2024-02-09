import {
  companies as companiesSchema,
  companiesRelations,
} from 'db/schema/companies';
import {
  dispatchers as dispatchersSchema,
  dispatchersRelations,
} from 'db/schema/dispatchers';
import { drivers as driversSchema, driversRelations } from 'db/schema/drivers';
import {
  jobLeaveReason as jobLeaveReasonsSchema,
  jobLeaveReasonRelations,
} from 'db/schema/jobLeaveReason';
import {
  jobRequests as jobRequestsSchema,
  jobRequestsRelations,
} from 'db/schema/jobRequests';
import { jobs as jobsSchema, jobsRelations } from 'db/schema/jobs';
import {
  jobVehicles as jobVehiclesSchema,
  jobVehiclesRelations,
} from 'db/schema/JobVehicles';
import { jobLabors, jobLaborsRelations } from 'db/schema/jobLabors';
import {
  providers as providersSchema,
  providersRelations,
} from 'db/schema/providers';
import {
  vehicleDrivers as vehicleDriversSchema,
  vehicleDriversRelations,
} from 'db/schema/vehicleDrivers';
import {
  vehicles as vehiclesSchema,
  vehiclesRelations,
} from 'db/schema/vehicles';
import { SQL, and, eq, sql } from 'drizzle-orm';
import { ApiHandler } from 'sst/node/api';

import { useDb } from 'db/dbClient';
import { response } from '@utils/response';
import { TransformedEvent, transformEvent } from '@utils/helpers';
import {
  comments as commentsSchema,
  commentsRelations,
} from 'db/schema/comments';
import {
  jobVehicleServices as jobVehicleServicesSchema,
  jobVehicleServicesRelations,
} from 'db/schema/JobVehicleServices';
import { photos as photosSchema, photosRelations } from 'db/schema/photos';
import { useAuth, userIsAgent, userIsProvider } from 'clients/auth';
import {
  jobDrivers as jobDriversSchema,
  jobDriversRelations,
} from 'db/schema/jobDrivers';

const db = useDb({
  comments: commentsSchema,
  commentsRelations,
  companies: companiesSchema,
  companiesRelations,
  dispatchers: dispatchersSchema,
  dispatchersRelations,
  driver: driversSchema,
  driversRelations,
  providers: providersSchema,
  providersRelations,
  photosRelations,
  photos: photosSchema,
  jobs: jobsSchema,
  jobsRelations,
  jobDrivers: jobDriversSchema,
  jobDriversRelations,
  jobLabors,
  jobLaborsRelations,
  jobLeaveReasons: jobLeaveReasonsSchema,
  jobLeaveReasonRelations,
  jobRequests: jobRequestsSchema,
  jobRequestsRelations,
  jobVehicles: jobVehiclesSchema,
  jobVehiclesRelations,
  jobVehicleServicesRelations,
  jobVehicleServices: jobVehicleServicesSchema,
  vehicles: vehiclesSchema,
  vehiclesRelations,
  vehicleDrivers: vehicleDriversSchema,
  vehicleDriversRelations,
});

export const handler = ApiHandler(async (_evt) => {
  const { page, size, orderBy, filters, joins } = transformEvent(
    _evt,
    jobsSchema
  );

  const { providerId } = useAuth();
  const isAgent = userIsAgent();
  const isProvider = !isAgent && !!providerId && userIsProvider();
  if (!(isAgent || isProvider)) return response.forbidden();

  const { jobs, totalElements } = await getJobs(
    size,
    page,
    orderBy,
    and(
      filters,
      isProvider ? eq(jobsSchema.provider_id, providerId) : undefined
    ),
    joins
  );

  return response.success({
    jobs,
    page: {
      size,
      number: jobs.length,
      page,
      totalElements,
    },
  });
});

async function getJobs(
  size: number,
  page: number,
  orderBy: TransformedEvent['orderBy'],
  filters?: SQL,
  joins?: string[]
) {
  const [jobs, jobsCount] = await Promise.all([
    db.query.jobs
      .findMany({
        limit: Number(size),
        offset: Number(size) * Number(page),
        where: filters,
        orderBy,
        with: {
          ...(joins?.includes('provider') ? { provider: true } : {}),
          ...(joins?.includes('company') ? { company: true } : {}),
          ...(joins?.includes('dispatcher') ? { dispatcher: true } : {}),
          ...(joins?.includes('jobRequest') ? { jobRequest: true } : {}),
          ...(joins?.includes('jobLeaveReason')
            ? { jobLeaveReason: true }
            : {}),
          ...(joins?.includes('jobDrivers') ? { jobDrivers: true } : {}),
          ...(joins?.includes('photos') || joins?.includes('driver')
            ? {
                jobVehicle: {
                  with: {
                    jobVehicleServices: {
                      with: {
                        photos: joins?.includes('photos') || undefined,
                      },
                    },
                    vehicle: {
                      with: {
                        vehicleDriver: {
                          with: {
                            driver: joins?.includes('driver') || undefined,
                          },
                        },
                      },
                    },
                  },
                },
              }
            : {}),
          ...(joins?.includes('jobLabor') ? { jobLabor: true } : {}),
          ...(joins?.includes('comments') ? { comments: true } : {}),
        },
      })
      .execute(),
    db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(jobsSchema)
      .where(filters)
      .execute(),
  ]);

  return { jobs, totalElements: jobsCount[0].count || 0 };
}
