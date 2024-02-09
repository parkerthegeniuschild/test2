import { useDb } from 'db/dbClient';
import { ROLE } from '@utils/constants';
import { type TDatabaseOrTransaction } from '@utils/dbTransaction';
import { z } from 'zod';
import { users as usersSchema } from 'db/schema/users';
import { PathIdScalar, PhoneScalar } from '@utils/schema';
import { createInsertSchema } from 'drizzle-zod';
import { SQL, eq } from 'drizzle-orm';
import { TruckupNotFoundError } from 'src/errors';

// eslint-disable-next-line import/no-self-import
export * as AppUser from './appUser';

export const pathParams = z.object({ userId: PathIdScalar });

const publicSelectShape = {
  id: usersSchema.id,
  createdBy: usersSchema.created_by,
  createdAt: usersSchema.created_at,
  updatedBy: usersSchema.updated_by,
  updatedAt: usersSchema.updated_at,
  username: usersSchema.username,
  email: usersSchema.email,
  phone: usersSchema.phone,
  lastLoginAt: usersSchema.last_login_at,
  appRole: usersSchema.app_role,
  fcmToken: usersSchema.fcm_token,
};

const createSchema = z.object({
  created_by: z.string().nonempty(),
  username: z.string().nonempty().optional(),
  // password: z.string().nonempty().optional(),
  email: z.string().email().toLowerCase(),
  phone: PhoneScalar,
  app_role: z.literal(ROLE.PROVIDER),
});
export type TCreateParams = z.infer<typeof createSchema>;
export const create = async (
  params: TCreateParams,
  db: TDatabaseOrTransaction = useDb(),
  skipParse: boolean = false
) => {
  const { username, email, ...rest } = !skipParse
    ? createSchema.parse(params)
    : params;

  const [user] = await db
    .insert(usersSchema)
    .values({ ...rest, email, username: username || email })
    .returning();

  return user;
};

export const updateSchema = createInsertSchema(usersSchema, {
  updated_at: z.instanceof(SQL),
})
  .pick({ id: true, updated_by: true, updated_at: true, fcm_token: true })
  .required({
    id: true,
    updated_by: true,
    updated_at: true,
  });
export type TUpdateParams = z.infer<typeof updateSchema>;
export const update = async (
  params: TUpdateParams,
  db: TDatabaseOrTransaction = useDb()
) => {
  const { id, ...values } = updateSchema.parse(params);
  const [res] = await db
    .update(usersSchema)
    .set(values)
    .where(eq(usersSchema.id, id))
    .returning(publicSelectShape);
  if (!res) throw new TruckupNotFoundError();
  return res;
};
