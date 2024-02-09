import assert from 'node:assert/strict';
import { createSigner } from 'fast-jwt';
/**
 * NOTE: we probably would prefer to use `bcrypt` instead of `bcryptjs`, but we were having dependency issues
 * https://github.com/kelektiv/node.bcrypt.js/issues/964
 * https://github.com/mapbox/node-pre-gyp/issues/661
 */
import bcrypt from 'bcryptjs';
import { response } from '@utils/response';
import { useDb } from 'db/dbClient';
import { users } from 'db/schema/users';
import { eq, sql } from 'drizzle-orm';
import { ApiHandler, useJsonBody } from 'sst/node/api';
import { z } from 'zod';
import { AUTH, ROLE } from '@utils/constants';
import { Config } from 'sst/node/config';
import { IdScalar } from '@utils/schema';

const db = useDb({ users });

const SQL_NOW = sql`CURRENT_TIMESTAMP`;

const bodySchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type Body = z.infer<typeof bodySchema>;

export const handler = ApiHandler(async () => {
  const { username, password } = bodySchema.parse(useJsonBody());
  const user = await getUserByUsername(username);
  if (!user) return response.forbidden();

  try {
    await checkPassword(user, password);
    checkRole(user);
  } catch (e) {
    return response.forbidden();
  }

  try {
    await updateUser(user);
  } catch (e) {
    return response.failure();
  }

  return response.success({ token: signToken(user) });
});

const getUserByUsername = async (username: string) => {
  assert.ok(username, `Need username!`);
  const [res = undefined] = await db
    .select({
      userId: users.id,
      username: users.username,
      role: users.app_role,
      email: users.email,
      passwordHash: users.password,
    })
    .from(users)
    .where(eq(users.username, username));
  return res && userParams.parse(res);
};

const updateUser = async ({ userId }: UserParams) => {
  const [res] = await db
    .update(users)
    .set({ last_login_at: SQL_NOW, updated_by: 'auth', updated_at: SQL_NOW })
    .where(eq(users.id, userId))
    .returning({ updatedAt: users.updated_at });
  assert.ok(res, `Failed to update`);
};

const checkPassword = async (user: UserParams, password: string) => {
  const { passwordHash } = user;
  assert.ok(!!(password && passwordHash), `Missing password or hash!`);
  assert.ok(await bcrypt.compare(password, passwordHash), `Bad password!`);
};

const checkRole = ({ role }: UserParams) => {
  assert.equal(role, ROLE.AGENT, `Bad role: ${role}`);
};

const agentParams = z.object({
  userId: IdScalar,
  username: z.string(),
  role: z.literal(ROLE.AGENT),
  providerId: z.null().optional(),
});
const userParams = z.object({
  userId: IdScalar,
  username: z.string(),
  role: z.literal(ROLE.AGENT),
  email: z.string(),
  passwordHash: z.string(),
});
type AgentParams = z.infer<typeof agentParams>;
type UserParams = z.infer<typeof userParams>;
const signToken = (params: UserParams) => {
  const signer = useSigner();
  const user = userParams.parse(params);
  const baseCredentials = createAgentCredentials(user);
  const credentials = {
    ...baseCredentials,
    v: AUTH.JWT_VERSION,
    kid: AUTH.JWT_KID,
    nonce: 1,
  };
  return signer(credentials);
};

const createAgentCredentials = ({ role, userId, username }: AgentParams) => ({
  roles: [role],
  role,
  userId,
  username,
});

let _signer: // eslint-disable-next-line @typescript-eslint/no-explicit-any
((payload: string | Buffer | Record<string, any>) => string) | null = null;

const useSigner = () => {
  if (!_signer) {
    _signer = createSigner({
      key: Config.AUTH_PRIVATE_KEY,
      expiresIn: AUTH.JWT_EXPIRATION_AGENT,
      algorithm: AUTH.JWT_ALGO,
    });
  }
  return _signer;
};
