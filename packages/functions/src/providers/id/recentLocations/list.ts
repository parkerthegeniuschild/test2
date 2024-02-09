import { response } from '@utils/response';
import { transformEvent } from '@utils/helpers';
import { providerLocations as providerLocationsSchema } from 'db/schema/providerLocations';
import { ApiHandler, usePathParam } from 'sst/node/api';
import { useDb } from 'db/dbClient';
import { and, eq, gte, sql } from 'drizzle-orm';

const db = useDb({ providerLocationsSchema });

export const handler = ApiHandler(async (event) => {
  const { page, size, orderBy, filters, paginate } = transformEvent(
    event,
    providerLocationsSchema
  );
  const providerId = parseInt(usePathParam('id') || '0', 10);
  if (!providerId) return response.notFound();

  const conditions = and(
    eq(providerLocationsSchema.provider_id, providerId),
    gte(providerLocationsSchema.created_at, sql`now() - interval '60 minutes'`),
    filters
  );

  const [locations, [{ total = 0 }]] = await Promise.all([
    db
      .select({
        id: providerLocationsSchema.id,
        timestamp: providerLocationsSchema.created_at,
        providerId: providerLocationsSchema.provider_id,
        jobId: providerLocationsSchema.job_id,
        speed: providerLocationsSchema.speed,
        course: providerLocationsSchema.course,
        latitude: providerLocationsSchema.latitude,
        longitude: providerLocationsSchema.longitude,
        accuracy: providerLocationsSchema.accuracy,
        // TODO add this once we add this to the schema
        isMoving: sql<boolean>`false`.as('isMoving'),
      })
      .from(providerLocationsSchema)
      .where(conditions)
      .limit(size)
      .offset(size * page)
      .orderBy(orderBy),
    db
      .select({ total: sql<number>`count(*)` })
      .from(providerLocationsSchema)
      .where(conditions),
  ]);

  return response.success(paginate(locations, total));
});
