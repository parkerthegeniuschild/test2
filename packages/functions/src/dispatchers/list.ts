import { SQL, sql } from 'drizzle-orm';
import { ApiHandler } from 'sst/node/api';

import { useDb } from 'db/dbClient';
import { response } from '@utils/response';
import { transformEvent } from '@utils/helpers';
import {
  dispatchers as dispatchersSchema,
  dispatchersRelations,
} from 'db/schema/dispatchers';
import { jobs as jobsSchema, jobsRelations } from 'db/schema/jobs';
import {
  companies as companiesSchema,
  companiesRelations,
} from 'db/schema/companies';

const db = useDb({
  dispatchers: dispatchersSchema,
  dispatchersRelations,
  jobs: jobsSchema,
  jobsRelations,
  companies: companiesSchema,
  companiesRelations,
});

export const handler = ApiHandler(async (_evt) => {
  const { page, size, orderBy, filters, joins, paginate } = transformEvent(
    _evt,
    dispatchersSchema
  );

  const { dispatchers, totalElements } = await getDispatchers(
    size,
    page,
    orderBy,
    filters,
    joins
  );

  return response.success(paginate(dispatchers, totalElements));
});

async function getDispatchers(
  size: number,
  page: number,
  orderBy: Array<SQL<unknown>>,
  filters?: SQL,
  joins?: string[]
) {
  const [dispatchers, dispatchersCount] = await Promise.all([
    db.query.dispatchers
      .findMany({
        limit: Number(size),
        offset: Number(size) * Number(page),
        where: filters,
        orderBy,
        with: {
          ...(joins?.includes('jobs') ? { jobs: true } : {}),
          ...(joins?.includes('company') ? { company: true } : {}),
        },
      })
      .execute(),
    db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(dispatchersSchema)
      .where(filters)
      .execute(),
  ]);

  return { dispatchers, totalElements: dispatchersCount[0].count || 0 };
}
