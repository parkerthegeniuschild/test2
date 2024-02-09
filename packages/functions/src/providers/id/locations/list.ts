import { response } from '@utils/response';
import { transformEvent } from '@utils/helpers';
import { providerLocations as providerLocationsSchema } from 'db/schema/providerLocations';
import { ApiHandler, usePathParam } from 'sst/node/api';
import { useDb } from 'db/dbClient';
import { and, eq, sql } from 'drizzle-orm';

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
    filters
  );

  const [locations, [{ total = 0 }]] = await Promise.all([
    db
      .select({
        id: providerLocationsSchema.id,
        timestamp: providerLocationsSchema.timestamp,
        providerId: providerLocationsSchema.provider_id,
        jobId: providerLocationsSchema.job_id,
        speed: providerLocationsSchema.speed,
        course: providerLocationsSchema.course,
        latitude: providerLocationsSchema.latitude,
        longitude: providerLocationsSchema.longitude,
        accuracy: providerLocationsSchema.accuracy,
        isMoving: providerLocationsSchema.is_moving,
        activity: providerLocationsSchema.activity_type,
        event: providerLocationsSchema.location_event,
        odometer: providerLocationsSchema.odometer,
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
