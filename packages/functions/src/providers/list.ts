import {
  jobRequests as jobRequestsSchema,
  calcAcceptedRate,
} from 'db/schema/jobRequests';
import { jobs as jobsSchema } from 'db/schema/jobs';
import { providers as providersSchema } from 'db/schema/providers';
import { and, eq, inArray, notInArray, sql, SQL } from 'drizzle-orm';
import { groupBy } from 'lodash';

import { type TransformedEvent, transformEvent } from '@utils/helpers';
import { stripeAccounts } from 'db/schema/stripeAccounts';
import { PgColumn } from 'drizzle-orm/pg-core';
import { Provider } from '@core/provider';
import TupApiHandler from 'handlers/TupApiHandler';
import { useAuth } from 'clients/auth';
import { JobRequestStatus, ROLE } from '@utils/constants';
import { db } from '@core/jobs';

const sq = db.$with('sq').as(
  db
    .select({
      id: providersSchema.id,
      is_blocked: Provider.calculate.isBlocked.as('is_blocked'),
    })
    .from(providersSchema)
);

export const handler = TupApiHandler(async ({ event }) => {
  useAuth({ requiredRole: ROLE.AGENT });
  const blockedFilter = event.queryStringParameters?.is_blocked?.includes('eq:')
    ? sql.raw(
        `"sq"."${
          sq.is_blocked.fieldAlias
        }" = ${event.queryStringParameters.is_blocked.replace('eq:', '')}`
      )
    : undefined;
  // eslint-disable-next-line no-param-reassign
  delete event.queryStringParameters?.is_blocked;
  const { page, size, orderBy, filters, joins, filter, paginate } =
    transformEvent(event, providersSchema);

  const { providers, totalElements } = await getProviders(
    page,
    size,
    orderBy,
    blockedFilter ? filter(blockedFilter) : filters,
    joins
  );

  const paginated = paginate(providers, totalElements);
  // support legacy schema for now
  return { providers: paginated.data, paginationData: paginated.page };
});

async function getProviders(
  page: number,
  size: number,
  orderBy: TransformedEvent['orderBy'],
  filters?: SQL,
  joins?: string[]
) {
  const withRating = joins?.includes('rating');
  const withEarnings = joins?.includes('earnings');
  const withCompletedJobsCount = joins?.includes('completedJobsCount');
  const withStripeAccount = joins?.includes('stripe');
  const withAcceptedRate = joins?.includes('acceptedRate');

  const groups: (PgColumn | SQL | SQL.Aliased)[] = [
    sql`"sq".${sq.is_blocked}`,
    providersSchema.id,
  ];

  const providersPromise = db
    .with(sq)
    .select({
      id: providersSchema.id,
      firstname: providersSchema.firstname,
      lastname: providersSchema.lastname,
      phone: providersSchema.phone,
      email: providersSchema.email,
      balance: providersSchema.balance,
      is_blocked: sql<boolean>`"sq".${sq.is_blocked}`.as('is_blocked'),
      is_unapproved: providersSchema.is_unapproved,
      is_online: providersSchema.is_online,
      notifications: providersSchema.notifications,
      location_precise: providersSchema.location_precise,
      location_always: providersSchema.location_always,
      ...(withRating
        ? { rating: sql<number>`round(avg(${jobsSchema.rating}), 2)` }
        : {}),
      ...(withEarnings
        ? { earnings: sql<number>`sum(${jobsSchema.total_cost})` }
        : {}),
      ...(withCompletedJobsCount
        ? {
            completedJobsCount:
              sql<number>`count(${jobsSchema.provider_id})`.as(
                'completedJobsCount'
              ),
          }
        : {}),
      ...(withStripeAccount
        ? {
            hasStripeAccount: sql<boolean>`CASE WHEN ${stripeAccounts.stripeId} IS NOT NULL THEN true ELSE false END`,
            stripeId: stripeAccounts.stripeId,
          }
        : {}),
    })
    .from(providersSchema)
    .innerJoin(sq, eq(sq.id, providersSchema.id))
    .where(filters)
    .offset(Number(size) * Number(page))
    .limit(Number(size))
    .orderBy(orderBy);

  if (withRating || withEarnings || withCompletedJobsCount) {
    void providersPromise.leftJoin(
      jobsSchema,
      and(
        eq(jobsSchema.provider_id, providersSchema.id),
        eq(jobsSchema.status_id, 'COMPLETED')
      )
    );
  }

  if (withStripeAccount) {
    void providersPromise.leftJoin(
      stripeAccounts,
      eq(stripeAccounts.userId, providersSchema.app_user_id)
    );
    groups.push(stripeAccounts.stripeId);
  }

  const [providers, providersCount] = await Promise.all([
    providersPromise.groupBy(...groups).execute(),
    db
      .with(sq)
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(providersSchema)
      .innerJoin(sq, eq(sq.id, providersSchema.id))
      .where(filters)
      .groupBy(sql`"sq".${sq.is_blocked}`)
      .execute(),
  ]);

  if (withAcceptedRate) {
    const provider_ids = providers.map((provider) => provider.id);

    const jobRequests = await db.query.jobRequests
      .findMany({
        where: and(
          inArray(jobRequestsSchema.provider_id, provider_ids),
          notInArray(jobRequestsSchema.status, [
            JobRequestStatus.NOTIFYING,
            JobRequestStatus.LOST,
            JobRequestStatus.CANCELED,
          ])
        ),
        columns: {
          id: true,
          provider_id: true,
          status: true,
        },
      })
      .execute();

    const jobRequestsByProviderId = groupBy(jobRequests, 'provider_id');

    providers.forEach((provider) => {
      if (jobRequestsByProviderId[provider.id]) {
        const providerJobRequests = jobRequestsByProviderId[provider.id];

        if (providerJobRequests.length > 100) {
          providerJobRequests.length = 100;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        provider.acceptedRate = calcAcceptedRate(providerJobRequests);
      }
    });
  }

  return { providers, totalElements: providersCount[0]?.count || 0 };
}
