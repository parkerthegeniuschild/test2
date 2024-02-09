import { useDb } from 'db/dbClient';

import { jobs as jobsSchema } from 'db/schema/jobs';
import { providerPositions as providerPositionsSchema } from 'db/schema/providerPositions';
import { providerLocations as providerLocationsSchema } from 'db/schema/providerLocations';
import { providers as providersSchema } from 'db/schema/providers';
import { SQL, and, eq, lte, sql } from 'drizzle-orm';
import { z } from 'zod';
import { getJobById } from '@core/jobs';
import { userIsAgent } from 'clients/auth';
import {
  TruckupBadRequestError,
  TruckupForbiddenError,
  TruckupNotFoundError,
} from 'src/errors';
import { transformEvent } from '@utils/helpers';
import { jobRequests as jobRequestsSchema } from 'db/schema/jobRequests';
import { geoDistanceQuery } from '@core/geo';
import TupApiHandler from 'handlers/TupApiHandler';
import { usePathParams, useQueryParams } from 'sst/node/api';
import { Provider } from '@core/provider';

const queryParamSchema = z.object({
  radius: z.string().regex(/^\d+$/).default('150').transform(Number),
});

const filterInputSchema = z.object({
  radius: z.number(),
  lat: z.number(),
  lng: z.number(),
  jobId: z.number(),
});

type FilterInputSchema = z.infer<typeof filterInputSchema>;

export const handler = TupApiHandler(async ({ event }) => {
  const { id = null } = usePathParams();

  if (!userIsAgent()) throw new TruckupForbiddenError();

  const job = await getJobById(Number(id));

  if (!job) throw new TruckupNotFoundError();

  if (!job.location_latitude || !job.location_longitude)
    throw new TruckupBadRequestError();

  const { radius } = queryParamSchema.parse(useQueryParams());

  if (event.queryStringParameters?.radius)
    // eslint-disable-next-line no-param-reassign
    delete event.queryStringParameters.radius;

  const { page, size, filters, paginate } = transformEvent(
    event,
    providersSchema
  );

  const { providers, totalElements } = await getProviders(
    {
      radius,
      lat: job.location_latitude,
      lng: job.location_longitude,
      jobId: job.id,
    },
    size,
    page,
    filters
  );

  return paginate(providers, totalElements);
});

function generateGeolocationDistanceSql(latitude: number, longitude: number) {
  return geoDistanceQuery(
    { latitude, longitude },
    providerPositionsSchema.position
  );
}

async function getProviders(
  input: FilterInputSchema,
  size: number,
  page: number,
  filters?: SQL
) {
  const sq = useDb()
    .$with('sq')
    .as(
      useDb()
        .select({
          id: providersSchema.id,
          is_onjob: Provider.calculate.isOnJob.as('is_onjob'),
        })
        .from(providersSchema)
        .leftJoin(jobsSchema, Provider.condition.jobIsOnJob)
        .groupBy(providersSchema.id)
    );
  const providerFilter = and(
    eq(sq.is_onjob, false),
    eq(Provider.calculate.isBlocked, false),
    lte(generateGeolocationDistanceSql(input.lat, input.lng), input.radius),
    filters
  );
  const [providers, providersCount] = await Promise.all([
    useDb()
      .with(sq)
      .select({
        id: providersSchema.id,
        firstname: providersSchema.firstname,
        lastname: providersSchema.lastname,
        rating: providersSchema.rating,
        phone: providersSchema.phone,
        distance: generateGeolocationDistanceSql(input.lat, input.lng).as(
          'provider_distance'
        ),
        latitude: providerLocationsSchema.latitude,
        longitude: providerLocationsSchema.longitude,
        is_onjob: sq.is_onjob,
        is_blocked: Provider.calculate.isBlocked.as('is_blocked'),
        is_online: providersSchema.is_online,
        location_updated_at: sql<string>`COALESCE(${providerPositionsSchema.updated_at}, ${providerPositionsSchema.created_at})`,
        job_request: jobRequestsSchema,
      })
      .from(providerPositionsSchema)
      .innerJoin(
        providersSchema,
        eq(providersSchema.id, providerPositionsSchema.id)
      )
      .innerJoin(sq, eq(sq.id, providersSchema.id))
      .innerJoin(
        providerLocationsSchema,
        eq(
          providerLocationsSchema.id,
          providerPositionsSchema.provider_location_id
        )
      )
      .leftJoin(jobsSchema, Provider.condition.jobIsOnJob)

      .leftJoin(
        jobRequestsSchema,
        and(
          eq(jobRequestsSchema.provider_id, providersSchema.id),
          eq(jobRequestsSchema.job_id, input.jobId),
          eq(
            jobRequestsSchema.created_at,
            sql`(SELECT MAX(created_at) FROM ${jobRequestsSchema} where ${jobRequestsSchema.provider_id} = ${providersSchema.id} and ${jobRequestsSchema.job_id} = ${input.jobId})`
          )
        )
      )
      .where(providerFilter)
      .groupBy(
        providersSchema.id,
        providerPositionsSchema.id,
        providerLocationsSchema.latitude,
        providerLocationsSchema.longitude,
        jobRequestsSchema.id,
        sq.is_onjob
      )
      .orderBy(sql`provider_distance asc`)
      .limit(size)
      .offset(size * page)
      .execute(),
    useDb()
      .with(sq)
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(providerPositionsSchema)
      .innerJoin(
        providersSchema,
        eq(providersSchema.id, providerPositionsSchema.id)
      )
      .innerJoin(sq, eq(sq.id, providersSchema.id))
      .where(providerFilter)
      .execute(),
  ]);

  return { providers, totalElements: providersCount[0].count || 0 };
}
