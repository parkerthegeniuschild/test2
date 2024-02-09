import assert from 'node:assert/strict';
import { response } from '@utils/response';
import { extractAuth } from '@utils/helpers';
import { ApiHandler, usePathParams } from 'sst/node/api';
import { eq } from 'drizzle-orm';
import { useDb } from 'db/dbClient';
import { selectUserSchema, users, usersRelations } from 'db/schema/users';
import { providers, selectProviderSchema } from 'db/schema/providers';
import {
  selectStripeAccountSchema,
  stripeAccounts,
} from 'db/schema/stripeAccounts';
import { ROLE } from '@utils/constants';
import stripe, { type CreateAccountParams } from 'clients/stripe';
import { z } from 'zod';

const db = useDb({
  users,
  stripeAccounts,
  providers,
  usersRelations,
});

const pathSchema = z.object({
  userId: z.string().transform((id) => parseInt(id, 10)),
});

// right now, this is for providers only
export const handler = ApiHandler(async (event) => {
  const { roles, username } = extractAuth(event);
  if (!roles.includes(ROLE.PROVIDER)) return response.forbidden();
  const { userId } = pathSchema.parse(usePathParams());
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: { provider: true, stripeAccount: true },
  });
  if (!user?.username || user.username !== username)
    return response.forbidden();
  const params = validateAndExtract(user);

  // stripeAccount is actually null when it has not been created yet
  const stripeId = params.stripeId || (await createStripeAccount(params));

  const result = await stripe.createOnboardingLink(stripeId);

  return response.success({ url: result });
});

interface CreateStripeAccountParams extends CreateAccountParams {
  stripeId: string | undefined;
}

const userDataSchema = selectUserSchema
  .pick({ id: true, email: true, phone: true })
  .extend({
    provider: selectProviderSchema.pick({
      app_user_id: true,
      email: true,
      phone: true,
      firstname: true,
      lastname: true,
    }),
    stripeAccount: selectStripeAccountSchema
      .pick({ stripeId: true })
      .or(z.null()),
  });
type UserData = z.infer<typeof userDataSchema>;
const validateAndExtract = (
  data: UserData | undefined
): CreateStripeAccountParams => {
  // we must do these defensive checks because of legacy data...
  const {
    id,
    email,
    phone,
    provider: {
      app_user_id: userId,
      firstname,
      lastname,
      email: providerEmail,
      phone: providerPhone,
    },
    stripeAccount,
  } = userDataSchema.parse(data);
  assert.ok(id === userId, `Provider app_user_id mismatch!`);
  if (providerEmail)
    assert.ok(email === providerEmail, `Provider email mismatch!`);
  assert.ok(phone === providerPhone, `Provider phone mismatch!`);
  return {
    userId,
    firstname,
    lastname,
    businessName: `${firstname} ${lastname}`,
    email: email || undefined,
    phone,
    stripeId: stripeAccount?.stripeId,
  };
};

const createStripeAccount = async (params: CreateStripeAccountParams) => {
  const stripeId = await stripe.createAccount(params);
  await db
    .insert(stripeAccounts)
    .values({ createdBy: `${params.userId}`, userId: params.userId, stripeId })
    .execute();
  return stripeId;
};
