import { SQL, sql } from 'drizzle-orm';
import { ApiHandler } from 'sst/node/api';

import { useDb } from 'db/dbClient';
import { response } from '@utils/response';
import { transformEvent } from '@utils/helpers';
import { drivers as driversSchema, driversRelations } from 'db/schema/drivers';
import { jobs as jobsSchema, jobsRelations } from 'db/schema/jobs';
import {
  companies as companiesSchema,
  companiesRelations,
} from 'db/schema/companies';
import { users as usersSchema, usersRelations } from 'db/schema/users';

const db = useDb({
  drivers: driversSchema,
  driversRelations,
  jobs: jobsSchema,
  jobsRelations,
  companies: companiesSchema,
  companiesRelations,
  users: usersSchema,
  usersRelations,
});

export const handler = ApiHandler(async (_evt) => {
  const { page, size, orderBy, filters, joins, paginate } = transformEvent(
    _evt,
    driversSchema
  );

  const { drivers, totalElements } = await getDrivers(
    size,
    page,
    orderBy,
    filters,
    joins
  );

  return response.success(paginate(drivers, totalElements));
});

async function getDrivers(
  size: number,
  page: number,
  orderBy: Array<SQL<unknown>>,
  filters?: SQL,
  joins?: string[]
) {
  const [drivers, driversCount] = await Promise.all([
    db.query.drivers
      .findMany({
        limit: Number(size),
        offset: Number(size) * Number(page),
        where: filters,
        orderBy,
        with: {
          ...(joins?.includes('jobs') ? { jobs: true } : {}),
          ...(joins?.includes('company') ? { company: true } : {}),
          ...(joins?.includes('users') ? { users: true } : {}),
        },
      })
      .execute(),
    db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(driversSchema)
      .where(filters)
      .execute(),
  ]);

  return { drivers, totalElements: driversCount[0].count || 0 };
}
