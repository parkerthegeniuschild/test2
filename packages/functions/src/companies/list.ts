import { companies as companiesSchema } from 'db/schema/companies';
import { jobs as jobsSchema } from 'db/schema/jobs';
import { and, eq, sql, SQL } from 'drizzle-orm';
import { ApiHandler } from 'sst/node/api';
import { useDb } from 'db/dbClient';
import { type TransformedEvent, transformEvent } from '@utils/helpers';
import { response } from '@utils/response';

const db = useDb();

export const handler = ApiHandler(async (_evt) => {
  const { page, size, orderBy, filters, joins, paginate } = transformEvent(
    _evt,
    companiesSchema
  );

  const { companies, totalElements } = await getCompanies(
    page,
    size,
    orderBy,
    filters,
    joins
  );

  return response.success(paginate(companies, totalElements));
});

async function getCompanies(
  page: number,
  size: number,
  orderBy: TransformedEvent['orderBy'],
  filters?: SQL,
  joins?: string[]
) {
  const withCompletedJobsCount = joins?.includes('completedJobsCount');

  const companiesPromise = db
    .select({
      id: companiesSchema.id,
      created_by: companiesSchema.created_by,
      created_at: companiesSchema.created_at,
      updated_by: companiesSchema.updated_by,
      updated_at: companiesSchema.updated_at,
      name: companiesSchema.name,
      phone: companiesSchema.phone,
      email: companiesSchema.email,
      usdot: companiesSchema.usdot,
      type: companiesSchema.type,
      address1: companiesSchema.address1,
      address2: companiesSchema.address2,
      city: companiesSchema.city,
      state: companiesSchema.state,
      zipcode: companiesSchema.zipcode,
      country: companiesSchema.country,
      ...(withCompletedJobsCount
        ? {
            completedJobsCount: sql<number>`count(${jobsSchema.company_id})`.as(
              'completedJobsCount'
            ),
          }
        : {}),
    })
    .from(companiesSchema)
    .where(filters)
    .offset(Number(size) * Number(page))
    .limit(Number(size))
    .orderBy(orderBy);

  if (withCompletedJobsCount) {
    void companiesPromise
      .leftJoin(
        jobsSchema,
        and(
          eq(jobsSchema.company_id, companiesSchema.id),
          eq(jobsSchema.status_id, 'COMPLETED')
        )
      )
      .groupBy(companiesSchema.id);
  }

  const [companies, companiesCount] = await Promise.all([
    companiesPromise.execute(),
    db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(companiesSchema)
      .where(filters)
      .execute(),
  ]);

  return { companies, totalElements: companiesCount[0]?.count || 0 };
}
