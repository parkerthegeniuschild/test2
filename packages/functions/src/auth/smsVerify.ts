import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createSigner } from 'fast-jwt';
import { response } from '@utils/response';
import { useDb } from 'db/dbClient';
import { users } from 'db/schema/users';
import { and, eq, isNull, lte, ne, or, sql } from 'drizzle-orm';
import { ApiHandler, useJsonBody } from 'sst/node/api';
import { z } from 'zod';
import { userOtps, userOtpsRelations } from 'db/schema/userOtps';
import { AUTH, ROLE } from '@utils/constants';
import { IdScalar, PhoneScalar } from '@utils/schema';
import { providers } from 'db/schema/providers';
import { Config } from 'sst/node/config';
import logger from 'src/logger';

const db = useDb({ users, userOtps, userOtpsRelations });

const bodySchema = z.object({
  phone: PhoneScalar,
  code: z.number(),
  challenge: z.string(),
  deviceId: z.string(),
});
export type Body = z.infer<typeof bodySchema>;

// For now, this login route only supports Providers
export const handler = ApiHandler(async () => {
  const { phone, code, challenge } = bodySchema.parse(useJsonBody());
  const user = await getUserByPhone(phone);
  if (!user) return response.forbidden();
  const { userId } = user;

  try {
    await attemptOtp({ userId, code, challenge });
  } catch (e) {
    logger.error('attemptOtp error:');
    logger.error(JSON.stringify(e));
    return response.forbidden();
  }

  try {
    await clearOtp({ userId });
  } catch (e) {
    logger.error('clearOtp error:');
    logger.error(JSON.stringify(e));
    return response.failure();
  }

  return response.success({ token: signToken(user) });
});

const getUserByPhone = async (
  phone: string
): Promise<UserParams | undefined> => {
  const [res = undefined] = await db
    .select({
      userId: users.id,
      username: users.username,
      role: users.app_role,
      providerId: providers.id,
    })
    .from(users)
    .where(eq(users.phone, phone))
    .leftJoin(providers, eq(providers.app_user_id, users.id));
  return res && userParams.parse(res);
};

const attemptOtp = async ({
  userId,
  code,
  challenge,
}: {
  userId: number;
  code: number;
  challenge: string;
}) => {
  const [{ hash, challengeHash, strikes, modified }] = await db
    .update(userOtps)
    .set({ strikes: sql`${userOtps.strikes} + 1`, lastAttempt: code })
    .where(
      and(
        eq(userOtps.userId, userId),
        lte(userOtps.strikes, AUTH.MAX_STRIKES),
        or(isNull(userOtps.lastAttempt), ne(userOtps.lastAttempt, code))
      )
    )
    .returning({
      hash: userOtps.hash,
      challengeHash: userOtps.challengeHash,
      strikes: userOtps.strikes,
      modified: userOtps.modified,
    });
  assert.ok(strikes <= AUTH.MAX_STRIKES, `Too many strikes!`);
  assert.ok(
    modified.valueOf() + AUTH.OTP_EXPIRATION >= Date.now(),
    `OTP is expired!`
  );
  validateHash(hash, code);
  validateHash(challengeHash, challenge);
};

const clearOtp = async ({ userId }: { userId: number }) => {
  return await db.delete(userOtps).where(eq(userOtps.userId, userId));
};

const validateHash = (hash: string, code: number | string) => {
  assert.ok(hash && code, `Bad input to validateHash!`);
  const check = crypto
    .createHash(AUTH.ALGO)
    .update(`${code}`)
    .digest(AUTH.ENCODING);
  const isValid = check === hash;
  assert.ok(isValid, `Invalid code!`);
  return isValid;
};

const userParamsBase = z.object({
  userId: IdScalar,
  username: z.string(),
  role: z.enum([ROLE.AGENT, ROLE.PROVIDER]),
  providerId: IdScalar.nullable(),
});
const agentParams = userParamsBase.extend({
  role: z.literal(ROLE.AGENT),
  providerId: z.null(),
});
const providerParams = userParamsBase.extend({
  role: z.literal(ROLE.PROVIDER),
  providerId: IdScalar,
});
export const userParams = z.union([agentParams, providerParams]);
type AgentParams = z.infer<typeof agentParams>;
type ProviderParams = z.infer<typeof providerParams>;
type UserParams = z.infer<typeof userParams>;
export const signToken = (params: UserParams) => {
  const signer = useSigner();
  const user = userParams.parse(params);
  const baseCredentials = createCredentials(user);
  const credentials = {
    ...baseCredentials,
    v: AUTH.JWT_VERSION,
    kid: AUTH.JWT_KID,
    nonce: 1,
  };
  return signer(credentials);
};

const createCredentials = (params: UserParams) => {
  switch (params.role) {
    case ROLE.AGENT: {
      return createAgentCredentials(params);
    }
    case ROLE.PROVIDER: {
      return createProviderCredentials(params);
    }
    default: {
      throw new Error(
        // @ts-expect-error invariant
        `Could not find credential generator for role: ${params.role}`
      );
    }
  }
};

const createAgentCredentials = ({ role, userId, username }: AgentParams) => ({
  role,
  roles: [role],
  userId,
  username,
});

const createProviderCredentials = ({
  role,
  userId,
  username,
  providerId,
}: ProviderParams) => ({ role, roles: [role], userId, username, providerId });

let _signer: // eslint-disable-next-line @typescript-eslint/no-explicit-any
((payload: string | Buffer | Record<string, any>) => string) | null = null;

const useSigner = () => {
  if (!_signer) {
    _signer = createSigner({
      key: Config.AUTH_PRIVATE_KEY,
      expiresIn: AUTH.JWT_EXPIRATION,
      algorithm: AUTH.JWT_ALGO,
    });
  }
  return _signer;
};
