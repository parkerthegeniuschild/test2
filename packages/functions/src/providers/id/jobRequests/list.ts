import { SQL, sql, eq, and } from 'drizzle-orm';
import { ApiHandler } from 'sst/node/api';
import assert from 'node:assert/strict';

import { useDb } from 'db/dbClient';
import { response } from '@utils/response';
import {
  TransformedEvent,
  getProviderRateIds,
  transformEvent,
} from '@utils/helpers';
import {
  jobRequests as jobRequestsSchema,
  jobRequestsRelations,
} from 'db/schema/jobRequests';
import {
  dispatchers as dispatchersSchema,
  dispatchersRelations,
} from 'db/schema/dispatchers';
import { jobs as jobsSchema, jobsRelations } from 'db/schema/jobs';
import { jobVehicleContacts as jobVehicleContactsSchema } from 'db/schema/jobVehicleContacts';
import { jobVehicleContactServices as jobVehicleContactServicesSchema } from 'db/schema/jobVehicleContactServices';
import { services as servicesSchema } from 'db/schema/services';
import { alias } from 'drizzle-orm/pg-core';
import { providerRates as providerRatesSchema } from 'db/schema/providerRates';

const db = useDb({
  jobRequests: jobRequestsSchema,
  jobRequestsRelations,
  dispatchers: dispatchersSchema,
  dispatchersRelations,
  jobs: jobsSchema,
  jobsRelations,
});

export const handler = ApiHandler(async (_evt) => {
  const { page, size, orderBy, filters, paginate } = transformEvent(
    _evt,
    jobRequestsSchema
  );

  const providerId = parseInt(_evt.pathParameters?.id || '', 10);

  assert.ok(providerId, `Invalid path`);

  const { jobRequests, totalElements } = await getJobRequestsFromProvider(
    providerId,
    size,
    page,
    orderBy,
    filters
  );

  return response.success(paginate(jobRequests, totalElements));
});

async function getJobRequestsFromProvider(
  providerId: number,
  size: number,
  page: number,
  orderBy: TransformedEvent['orderBy'],
  filters?: SQL
) {
  const prCallout = alias(providerRatesSchema, 'prCallout');
  const prHourlyR = alias(providerRatesSchema, 'prHourlyR');
  const providerRateIds = await getProviderRateIds();
  const [jobRequests, jobRequestsCount] = await Promise.all([
    db
      .select({
        id: jobRequestsSchema.id,
        job_id: jobRequestsSchema.job_id,
        provider_id: jobRequestsSchema.provider_id,
        status: jobRequestsSchema.status,
        location_latitude: jobRequestsSchema.location_latitude,
        location_longitude: jobRequestsSchema.location_longitude,
        created_at: jobRequestsSchema.created_at,
        location_city: jobRequestsSchema.location_city,
        location_state: jobRequestsSchema.location_state,
        distance: jobRequestsSchema.distance,
        duration: jobRequestsSchema.duration,
        minimum_hours: servicesSchema.min_hours,
        callout: prCallout.value,
        hourly: prHourlyR.value,
        minimum_earnings: sql<string>`${prHourlyR.value} * ${servicesSchema.min_hours} + ${prCallout.value}`,
        arrive_by: sql<string>`to_timestamp(extract(epoch from ${jobRequestsSchema.created_at}) + (${jobRequestsSchema.duration} * 60) + (40 * 60))`,
      })
      .from(jobRequestsSchema)
      .innerJoin(
        jobVehicleContactsSchema,
        eq(jobVehicleContactsSchema.job_id, jobRequestsSchema.job_id)
      )
      .innerJoin(
        jobVehicleContactServicesSchema,
        eq(
          jobVehicleContactServicesSchema.job_vehicle_contact_id,
          jobVehicleContactsSchema.id
        )
      )
      .innerJoin(
        servicesSchema,
        eq(servicesSchema.id, jobVehicleContactServicesSchema.service_id)
      )
      .innerJoin(
        prCallout,
        and(
          eq(prCallout.provider_id, jobRequestsSchema.provider_id),
          eq(prCallout.rate_id, providerRateIds.callout)
        )
      )
      .innerJoin(
        prHourlyR,
        and(
          eq(prHourlyR.provider_id, jobRequestsSchema.provider_id),
          eq(prHourlyR.rate_id, providerRateIds.rate)
        )
      )
      .where(and(eq(jobRequestsSchema.provider_id, providerId), filters))
      .limit(Number(size))
      .offset(Number(size) * Number(page))
      .orderBy(orderBy)
      .execute(),

    db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(jobRequestsSchema)
      .where(and(eq(jobRequestsSchema.provider_id, providerId), filters))
      .execute(),
  ]);

  return { jobRequests, totalElements: jobRequestsCount[0].count || 0 };
}
