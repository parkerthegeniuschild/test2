import crypto from 'node:crypto';
import { response } from '@utils/response';
import sms from 'clients/sms';
import { useDb } from 'db/dbClient';
import { users } from 'db/schema/users';
import { eq } from 'drizzle-orm';
import { ApiHandler } from 'sst/node/api';
import { z } from 'zod';
import { userOtps, userOtpsRelations } from 'db/schema/userOtps';
import logger from 'src/logger';
import { AUTH, ERROR, ROLE } from '@utils/constants';
import { providers } from 'db/schema/providers';
import { PhoneScalar } from '@utils/schema';

const db = useDb({ users, userOtps, userOtpsRelations });

const queryParamsSchema = z.object({
  phone: PhoneScalar,
});
export type QueryParams = z.infer<typeof queryParamsSchema>;

// For now, this login route only supports Providers
export const handler = ApiHandler(async (event) => {
  const { phone } = queryParamsSchema.parse(event.queryStringParameters);
  const user = await getUser(phone);
  const { otp, hash, challenge, challengeHash } = generateOtp(phone);
  const res = { challenge, timeout: AUTH.REQUEST_TIMEOUT_SECONDS };

  if (!user) {
    return response.notFound();
  }

  const { userId, role, lastRequested, strikes, isBlocked, isUnapproved } =
    user;
  if (strikes && strikes >= AUTH.MAX_STRIKES) {
    logger.error(`[AUTH] User locked out!! phone: ${phone}`);
    return response.error(undefined, { statusCode: 418 });
  }

  if (role !== ROLE.PROVIDER) {
    // We should maybe log the activity or something here, but again we do not
    // want to reveal to the user whether or not the number exists in the system
    return response.success(res);
  }

  if (
    lastRequested &&
    Date.now() - lastRequested.valueOf() < AUTH.REQUEST_TIMEOUT
  ) {
    return response.rateLimit();
  }

  if (isBlocked) {
    // this is the previous legacy behavior
    return response.error({ code: ERROR.notApproved });
  }

  if (isUnapproved) {
    return response.notFound();
  }

  try {
    await storeOtp({ userId, hash, challengeHash, lastRequested });
    await sendOtp({ phone, otp });
  } catch (e) {
    logger.error(JSON.stringify(e));
    return response.failure(
      `Please wait ${AUTH.REQUEST_TIMEOUT_SECONDS} seconds and try again.`
    );
  }

  // handle send errors?
  return response.success(res);
});

const getUser = async (phone: QueryParams['phone']) => {
  const [data = undefined] = await db
    .select({
      userId: users.id,
      phone: users.phone,
      role: users.app_role,
      lastRequested: userOtps.modified,
      strikes: userOtps.strikes,
      isBlocked: providers.is_blocked,
      isUnapproved: providers.is_unapproved,
    })
    .from(users)
    .where(eq(users.phone, phone))
    .leftJoin(userOtps, eq(userOtps.userId, users.id))
    .leftJoin(providers, eq(providers.app_user_id, users.id))
    .limit(1)
    .execute();
  return data;
};

const generateOtp = (phone: string) => {
  if (sms.isMagicNumber(phone))
    return {
      otp: AUTH.MOCK_OTP,
      hash: AUTH.MOCK_OTP_HASH,
      challenge: AUTH.MOCK_CHALLENGE,
      challengeHash: AUTH.MOCK_CHALLENGE_HASH,
    };
  const rng = crypto.randomBytes(AUTH.TOTAL_BYTES);
  const otp = rng.subarray(0, AUTH.OTP_BYTES).readUIntBE(0, 3) % 1_000_000;
  const challenge = rng.subarray(AUTH.OTP_BYTES).toString(AUTH.ENCODING);
  return { otp, hash: hash(otp), challenge, challengeHash: hash(challenge) };
};

const storeOtp = async ({
  userId,
  hash,
  challengeHash,
  lastRequested,
}: {
  userId: number;
  hash: string;
  challengeHash: string;
  lastRequested: Date | null;
}) => {
  const modified = new Date();
  if (lastRequested) {
    const [res] = await db
      .update(userOtps)
      .set({
        hash,
        challengeHash,
        modified,
        lastAttempt: null,
      })
      .where(eq(userOtps.userId, userId))
      .returning({ userId: userOtps.userId });
    if (!res) throw new Error('Failed to update OTP!');
  } else {
    const [res] = await db
      .insert(userOtps)
      .values({ userId, hash, challengeHash, createdBy: 'auth', modified })
      .returning({ userId: userOtps.userId });
    if (!res) throw new Error('Failed to store OTP!');
  }
};

const sendOtp = ({ otp, phone }: { otp: number; phone: string }) =>
  sms.send({
    body: `Your Truckup code is: ${padOtp(otp)}. Do NOT share it with anyone!`,
    to: phone,
  });

const OTP_LENGTH = AUTH.OTP_BYTES * 2;
const padOtp = (otp: number) => otp.toString().padStart(OTP_LENGTH, '0');

const hash = (input: string | number) =>
  crypto.createHash(AUTH.ALGO).update(`${input}`).digest(AUTH.ENCODING);
