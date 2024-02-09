import { response } from '@utils/response';
import { extractAuth } from '@utils/helpers';
import { ApiHandler, usePathParams } from 'sst/node/api';
import { eq } from 'drizzle-orm';
import { useDb } from 'db/dbClient';
import { users, usersRelations } from 'db/schema/users';
import { stripeAccounts } from 'db/schema/stripeAccounts';
import stripe from 'clients/stripe';
import { z } from 'zod';

const db = useDb({
  users,
  stripeAccounts,
  usersRelations,
});

const pathSchema = z.object({
  userId: z.string().transform((id) => parseInt(id, 10)),
});

export const handler = ApiHandler(async (event) => {
  const { username } = extractAuth(event);
  const { userId } = pathSchema.parse(usePathParams());

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: { stripeAccount: true },
  });

  // we want to return forbidden for both cases to not leak information about other users
  if (!user?.username || user.username !== username)
    return response.forbidden();

  const stripeId = user?.stripeAccount?.stripeId;

  if (!stripeId) return response.notFound();

  const result = await stripe.createDashboardLink(stripeId);

  return response.success({ url: result });
});
