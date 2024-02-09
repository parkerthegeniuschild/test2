import {
  jobRequests as jobRequestsSchema,
  jobRequestsRelations,
  calcAcceptedRate,
} from 'db/schema/jobRequests';
import { jobs as jobsSchema, jobsRelations } from 'db/schema/jobs';
import {
  providers as providersSchema,
  providersRelations,
} from 'db/schema/providers';
import { and, eq, notInArray, sql } from 'drizzle-orm';
import { useDb } from 'db/dbClient';
import { usePathParams } from 'sst/node/api';

import { transformEvent } from '@utils/helpers';
import { stripeAccounts } from 'db/schema/stripeAccounts';
import { z } from 'zod';
import { PathIdScalar } from '@utils/schema';
import TupApiHandler from 'handlers/TupApiHandler';
import { Provider } from '@core/provider';

const db = useDb({
  providers: providersSchema,
  providerRelations: providersRelations,
  jobs: jobsSchema,
  jobsRelations,
  jobsRequests: jobRequestsSchema,
  jobRequestsRelations,
});

const pathParamsSchema = z.object({ id: PathIdScalar });
export const handler = TupApiHandler(async ({ event }) => {
  const { joins } = transformEvent(event, providersSchema);
  const { id: providerId } = pathParamsSchema.parse(usePathParams());

  const provider = await getProvider(providerId, joins);

  return provider;
});

async function getProvider(providerId: number, joins?: string[]) {
  const withRating = joins?.includes('rating');
  const withEarnings = joins?.includes('earnings');
  const withCompletedJobsCount = joins?.includes('completedJobsCount');
  const withStripeAccount = joins?.includes('stripe');
  const withAcceptedRate = joins?.includes('acceptedRate');

  const providersPromise = db
    .select({
      id: providersSchema.id,
      firstname: providersSchema.firstname,
      lastname: providersSchema.lastname,
      phone: providersSchema.phone,
      email: providersSchema.email,
      balance: providersSchema.balance,
      is_blocked: Provider.calculate.isBlocked.as('is_blocked'),
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
        ? { completedJobsCount: sql<number>`count(${jobsSchema.provider_id})` }
        : {}),
      ...(withStripeAccount
        ? {
            hasStripeAccount: sql<boolean>`CASE WHEN ${stripeAccounts.stripeId} IS NOT NULL THEN true ELSE false END`,
          }
        : {}),
    })
    .from(providersSchema)
    .where(eq(providersSchema.id, providerId));

  if (withRating || withEarnings || withCompletedJobsCount) {
    void providersPromise
      .leftJoin(
        jobsSchema,
        and(
          eq(jobsSchema.provider_id, providersSchema.id),
          eq(jobsSchema.status_id, 'COMPLETED')
        )
      )
      .groupBy(providersSchema.id);
  }

  if (withStripeAccount) {
    void providersPromise
      .leftJoin(
        stripeAccounts,
        eq(stripeAccounts.userId, providersSchema.app_user_id)
      )
      .groupBy(stripeAccounts.stripeId, providersSchema.id);
  }

  const provider = (await providersPromise.execute())[0];

  if (withAcceptedRate) {
    const jobRequests = await db.query.jobsRequests
      .findMany({
        where: and(
          eq(jobRequestsSchema.provider_id, providerId),
          notInArray(jobRequestsSchema.status, [
            'NOTIFYING',
            'LOST',
            'CANCELED',
          ])
        ),
        limit: 100,
        columns: {
          id: true,
          provider_id: true,
          status: true,
        },
      })
      .execute();

    if (jobRequests?.length) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      provider.acceptedRate = calcAcceptedRate(jobRequests);
    }
  }

  return provider;
}
