import { buildUpdatedProperties, timestampMsString } from '@utils/helpers';
import { ROLE } from '@utils/constants';
import { response } from '@utils/response';
import { useAuth } from 'clients/auth';
import { useDb } from 'db/dbClient';
import { providerLocations } from 'db/schema/providerLocations';
import { providerPositions } from 'db/schema/providerPositions';
import { sql } from 'drizzle-orm';
import { ApiHandler, useJsonBody, usePathParam } from 'sst/node/api';
import { z } from 'zod';

const locationEventSchema = z.object({
  extras: z.object({}),
  battery: z.object({ level: z.number(), is_charging: z.boolean() }),
  activity: z.object({ confidence: z.number(), type: z.string() }),
  is_moving: z.boolean(),
  uuid: z.string(),
  age: z.number(),
  coords: z.object({
    ellipsoidal_altitude: z.number(),
    altitude: z.number(),
    altitude_accuracy: z.number(),
    heading: z.number(),
    heading_accuracy: z.number(),
    speed: z.number(),
    speed_accuracy: z.number(),
    longitude: z.number(),
    latitude: z.number(),
    accuracy: z.number(),
  }),
  timestamp: z.string().datetime({ offset: true }),
  odometer: z.number(),
  event: z.string().optional(),
});

const locationBatchSchema = z.object({
  location: z.array(locationEventSchema).max(5).min(1),
});

export const handler = ApiHandler(async (_evt) => {
  const providerId = parseInt(usePathParam('id') || '0', 10);
  if (!providerId) return response.notFound();
  const { username } = useAuth({ requiredRole: ROLE.PROVIDER, providerId });
  const { location: batch } = locationBatchSchema.parse(useJsonBody());
  const { updated_at } = buildUpdatedProperties(_evt);

  const res = await useDb({ providerLocations }).transaction(async (tx) => {
    return await Promise.all(
      batch.map(async ({ coords, ...e }) => {
        const [inserted] = await tx
          .insert(providerLocations)
          .values({
            created_by: username,
            provider_id: providerId,
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
            course: coords.heading,
            course_accuracy: coords.heading_accuracy,
            speed: coords.speed,
            speed_accuracy: coords.speed_accuracy,
            altitude: coords.altitude,
            altitude_accuracy: coords.altitude_accuracy,
            ellipsoidal_altitude: coords.ellipsoidal_altitude,
            is_moving: e.is_moving,
            battery_level: e.battery.level,
            battery_is_charging: e.battery.is_charging,
            activity_type: e.activity.type,
            activity_confidence: e.activity.confidence,
            location_event: e.event,
            location_event_uuid: e.uuid,
            timestamp: timestampMsString.parse(
              `${new Date(e.timestamp).valueOf()}`
            ),
            odometer: e.odometer,
            age: e.age,
          })
          .returning();

        await tx
          .insert(providerPositions)
          .values({
            id: providerId,
            created_by: username,
            provider_location_id: inserted.id,
            position: sql.raw(
              `ST_GeogFromText('SRID=4326;POINT(${coords.longitude} ${coords.latitude})')`
            ),
          })
          .onConflictDoUpdate({
            target: providerPositions.id,
            set: {
              updated_by: username,
              updated_at,
              provider_location_id: inserted.id,
              position: sql.raw(
                `ST_GeogFromText('SRID=4326;POINT(${coords.longitude} ${coords.latitude})')`
              ),
            },
          })
          .execute();
        return inserted;
      })
    );
  });

  return response.created(res);
});
