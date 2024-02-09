import { SQL, sql } from 'drizzle-orm';
import { ApiHandler } from 'sst/node/api';

import { useDb } from 'db/dbClient';
import { response } from '@utils/response';
import { transformEvent } from '@utils/helpers';
import {
  vehicles as vehiclesSchema,
  vehiclesRelations,
} from 'db/schema/vehicles';
import {
  vehicleDrivers as vehicleDriversSchema,
  vehicleDriversRelations,
} from 'db/schema/vehicleDrivers';
import {
  jobVehicles as jobVehiclesSchema,
  jobVehiclesRelations,
} from 'db/schema/JobVehicles';

const db = useDb({
  vehicles: vehiclesSchema,
  vehiclesRelations,
  vehicleDrivers: vehicleDriversSchema,
  vehicleDriversRelations,
  jobVehicle: jobVehiclesSchema,
  jobVehiclesRelations,
});

export const handler = ApiHandler(async (_evt) => {
  const { page, size, orderBy, filters, joins, paginate } = transformEvent(
    _evt,
    vehiclesSchema
  );

  const { vehicles, totalElements } = await getVehicle(
    size,
    page,
    orderBy,
    filters,
    joins
  );
  return response.success(paginate(vehicles, totalElements));
});

async function getVehicle(
  size: number,
  page: number,
  orderBy: Array<SQL<unknown>>,
  filters?: SQL,
  joins?: string[]
) {
  const [vehicles, vehiclesCount] = await Promise.all([
    db.query.vehicles
      .findMany({
        limit: Number(size),
        offset: Number(size) * Number(page),
        where: filters,
        orderBy,
        with: {
          ...(joins?.includes('vehicleDriver') ? { vehicleDriver: true } : {}),
          ...(joins?.includes('jobVehicle') ? { jobVehicle: true } : {}),
        },
      })
      .execute(),
    db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(vehiclesSchema)
      .where(filters)
      .execute(),
  ]);

  return { vehicles, totalElements: vehiclesCount[0].count || 0 };
}
