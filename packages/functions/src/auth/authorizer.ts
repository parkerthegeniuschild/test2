import assert from 'node:assert/strict';
import { AUTH, ROLE, type Role } from '@utils/constants';
import { APIGatewayEvent } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';
import { Config } from 'sst/node/config';
import { createVerifier } from 'fast-jwt';
import logger from 'src/logger';

export interface IAuthorizerUnauthorized {
  isAuthorized: false;
  context?: undefined;
}
export interface IAuthorizerV0Context {
  username: string;
  roles: Role[];
}
export interface IAuthorizerV1Context {
  username: string;
  roles: Role[];
  role: Role;
  userId: number;
  providerId?: number;
}
export type IAuthorizerContext = IAuthorizerV0Context | IAuthorizerV1Context;

export type IAuthorizerResponse<
  T extends IAuthorizerContext = IAuthorizerContext
> =
  | {
      isAuthorized: true;
      context: T;
    }
  | IAuthorizerUnauthorized;

const UNAUTHORIZED: IAuthorizerUnauthorized = { isAuthorized: false };

export const handlerV0 = async (
  _evt: APIGatewayEvent
): Promise<IAuthorizerResponse<IAuthorizerV0Context>> => {
  const authHeader = _evt.headers?.authorization;

  let decoded;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'NOT SET');

    return {
      isAuthorized:
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        /* @ts-ignore */
        decoded.roles.includes('ROLE_AGENT'),
      context: {
        /* @ts-ignore */
        username: decoded.sub,
        /* @ts-ignore */
        roles: decoded.roles,
        /* eslint-enable @typescript-eslint/ban-ts-comment */
      },
    };
  }

  return {
    isAuthorized: false,
  };
};

export const handlerV1 = async (
  event: APIGatewayEvent
): Promise<IAuthorizerResponse> => {
  const {
    headers: {
      // SST lower cases all the headers
      authorization,
      [AUTH.VERSION_HEADER.toLowerCase()]: version = '0',
    },
  } = event;
  if (!authorization) return UNAUTHORIZED;
  try {
    switch (version) {
      case AUTH.AUTH_VERSION:
        return verifyV1(authorization);
      case '0':
        return await handlerV0(event);
      default:
        logger.error(`Bad auth version: ${version}!`);
        return UNAUTHORIZED;
    }
  } catch (e) {
    return UNAUTHORIZED;
  }
};

const ENABLED_ROLES: Role[] = [ROLE.PROVIDER, ROLE.AGENT];
const verifyV1 = (input: string): IAuthorizerResponse<IAuthorizerV1Context> => {
  try {
    const [bearer, token] = input.split(' ');
    assert.ok(bearer === 'Bearer', `Malformed JWT!`);
    const verifier = useVerifier();
    const context = verifier(token);
    const { role, kid, v } = context;
    assert.ok(ENABLED_ROLES.includes(role), `Bad role!`);
    assert.ok(kid === AUTH.JWT_KID, `Bad KID!`);
    assert.ok(v === AUTH.JWT_VERSION);
    return { isAuthorized: true, context };
  } catch (e) {
    logger.error(JSON.stringify(e));
  }

  return UNAUTHORIZED;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _verifier: ((token: string | Buffer) => any) | null;
const useVerifier = () => {
  if (!_verifier) {
    _verifier = createVerifier({
      key: Config.AUTH_PUBLIC_KEY,
      algorithms: [AUTH.JWT_ALGO],
      cache: true,
    });
  }
  return _verifier;
};
