import { IdScalar } from '@utils/schema';
import { useDb } from 'db/dbClient';
import { providers } from 'db/schema/providers';
import { users } from 'db/schema/users';
import { eq } from 'drizzle-orm';
import TupLambdaHandler from 'handlers/TupLambdaHandler';
import { signToken, userParams } from 'src/auth/smsVerify';
import { TruckupBadRequestError, TruckupNotFoundError } from 'src/errors';
import { z } from 'zod';

const eventSchema = z.object({
  userId: IdScalar.optional(),
  providerId: IdScalar.optional(),
});
type IEventSchema = z.infer<typeof eventSchema>;

export const handler = TupLambdaHandler(async (e: IEventSchema) => {
  const user = await getUserOrProvider(eventSchema.parse(e));
  if (!user) throw new TruckupNotFoundError();
  return { token: signToken(userParams.parse(user)) };
});

const columns = {
  userId: users.id,
  username: users.username,
  role: users.app_role,
  providerId: providers.id,
};
const getUserOrProvider = async ({ userId, providerId }: IEventSchema) => {
  const db = useDb();
  if (userId && providerId) {
    throw new TruckupBadRequestError(
      `Cannot specify both userId and providerId`
    );
  }

  if (!userId && !providerId) {
    throw new TruckupBadRequestError(
      `Either userId or providerId must be specified`
    );
  }

  let user;

  if (userId) {
    [user] = await db
      .select(columns)
      .from(users)
      .where(eq(users.id, userId))
      .leftJoin(providers, eq(providers.app_user_id, users.id));
  } else if (providerId) {
    [user] = await db
      .select(columns)
      .from(providers)
      .where(eq(providers.id, providerId))
      .innerJoin(users, eq(users.id, providers.app_user_id));
  }

  return user;
};
