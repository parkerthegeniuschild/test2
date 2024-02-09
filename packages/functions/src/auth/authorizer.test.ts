import assert from 'node:assert/strict';
import type { APIGatewayEvent } from 'aws-lambda';
import { USERNAMES, fetchV1Token, modifyJwt, request } from '@tests/helpers';
import { invoke } from 'clients/lambda';
import { Function } from 'sst/node/function';
import { beforeAll, describe, expect, expectTypeOf, it } from 'vitest';
import { Config } from 'sst/node/config';
import { AUTH, ROLE, ROLE_NAMES } from '@utils/constants';
import { IAuthorizerV1Context, type IAuthorizerResponse } from './authorizer';

describe(`API Authorizer`, () => {
  const legacy = { token: process.env.ApiTestJWT || 'NOT_SET', version: '0' };
  const current = { token: '', version: AUTH.AUTH_VERSION };
  const agent = { token: '', version: AUTH.AUTH_VERSION };

  beforeAll(async () => {
    [current.token, agent.token] = await Promise.all([
      fetchV1Token(),
      fetchAgentToken(),
    ]);
  });

  describe(`authV0`, () => {
    const authorizer = createAuthorizer(Function.AuthorizerV0.functionName);

    it(`should work with the legacy token`, async () => {
      const res = await authorizer({
        token: legacy.token,
      });
      expectValidV0(res);
    });

    it(`should work for legacy token with any version header`, async () => {
      const res = await authorizer({
        token: legacy.token,
        version: current.version,
      });
      expectValidV0(res);
    });

    it(`should fail with the V1 token`, async () => {
      // v1 currently throws due to incompatibility, rather than return inAuthorized: false
      await expect(() =>
        authorizer({ token: current.token })
      ).rejects.toThrowError();
    });

    it(`should fail for V1 Agent token`, async () => {
      await expect(() =>
        authorizer({ token: agent.token })
      ).rejects.toThrowError();
    });

    it(`should fail for token with modified header`, async () => {
      await expect(() =>
        authorizer({ token: modifyJwt(legacy.token, 'header') })
      ).rejects.toThrowError();
    });

    it(`should fail for token with modified payload`, async () => {
      await expect(() =>
        authorizer({ token: modifyJwt(legacy.token, 'payload') })
      ).rejects.toThrowError();
    });

    it(`should fail for token with modified signature`, async () => {
      await expect(() =>
        authorizer({ token: modifyJwt(legacy.token, 'sig') })
      ).rejects.toThrowError();
    });
  });

  describe(`authV1`, () => {
    const authorizer = createAuthorizer(Function.AuthorizerV1.functionName);

    describe(`should succeed for v1 token`, () => {
      let context: IAuthorizerV1Context;
      beforeAll(async () => {
        const res = await authorizer(current);
        context = expectValidV1(res);
      });

      it(`with valid v1 auth context`, async () => {
        const res = await authorizer(current);
        expectValidV1(res);
      });

      it(`with the correct username`, () => {
        expect(context.username).toEqual('test_provider');
      });
    });

    describe(`should succed for V1 Agent token`, () => {
      let context: IAuthorizerV1Context;
      beforeAll(async () => {
        const res = await authorizer(agent);
        context = expectValidV1(res);
      });

      it(`with valid v1 auth context`, async () => {
        const res = await authorizer(agent);
        expectValidV1(res);
      });

      it(`with the correct username`, async () => {
        expect(context.username).toEqual(USERNAMES.AGENT);
      });
    });

    it(`should fail for token with modified header`, async () => {
      const res = await authorizer({
        token: modifyJwt(current.token, 'header'),
        version: current.version,
      });
      expectInvalid(res);
    });

    it(`should fail for token with modified payload`, async () => {
      const res = await authorizer({
        token: modifyJwt(current.token, 'payload'),
        version: current.version,
      });
      expectInvalid(res);
    });

    it(`should fail for token with modified signature`, async () => {
      const res = await authorizer({
        token: modifyJwt(current.token, 'sig'),
        version: current.version,
      });
      expectInvalid(res);
    });

    it(`should fail for the legacy token with V1 header`, async () => {
      const res = await authorizer({
        token: legacy.token,
        version: current.version,
      });
      expectInvalid(res);
    });

    it(`should succeed for legacy token if no header is set`, async () => {
      const res = await authorizer({
        token: legacy.token,
      });
      expectValidV0(res);
    });

    it(`should succeed for legacy token with V0 header`, async () => {
      const res = await authorizer(legacy);
      expectValidV0(res);
    });

    it(`should fail for legacy token with other version`, async () => {
      const res = await authorizer({ token: legacy.token, version: '2' });
      expectInvalid(res);
    });

    it(`should fail for V1 token with V0 header`, async () => {
      const res = await authorizer({
        token: current.token,
        version: legacy.version,
      });
      expectInvalid(res);
    });
  });
});

const fetchAgentToken = async () => {
  const {
    data: { token },
  } = await request.post(`/auth/password`, {
    username: USERNAMES.AGENT,
    password: Config.TEST_AGENT_PASSWORD,
  });
  assert.ok(typeof token === 'string', `Failed to fetch agent token!`);
  return token;
};

interface IAuthorizerParams {
  token?: string;
  version?: string;
}

const createAuthorizer =
  (functionName: string) =>
  async ({ token, version }: IAuthorizerParams = {}) => {
    return await invoke<Pick<APIGatewayEvent, 'headers'>, IAuthorizerResponse>({
      functionName,
      payload: {
        headers: {
          authorization: token && `Bearer ${token}`,
          [AUTH.VERSION_HEADER.toLowerCase()]: version,
        },
      },
    });
  };

const expectInvalid = (res: IAuthorizerResponse) => {
  expect(res.isAuthorized).toBe(false);
  expect(res.context).toEqual(undefined);
};

const expectValidV0 = (res: IAuthorizerResponse) => {
  expect(res.isAuthorized).toEqual(true);
  assert.ok(res.isAuthorized);
  expect(res.context).toBeTypeOf('object');
  const {
    context: { username, roles },
  } = res;
  expectTypeOf(username).toBeString();
  expectTypeOf(roles).toBeArray();
  roles.forEach((role) => expect(ROLE_NAMES).toContain(role));
  expect(roles).toHaveLength(1);
};

const expectValidV1 = (res: IAuthorizerResponse) => {
  expect(res.isAuthorized).toEqual(true);
  assert.ok(res.isAuthorized);
  const { context } = res;
  expect(context).toBeTypeOf('object');
  expect(context).toHaveProperty('userId');
  expect(context).toHaveProperty('username');
  expect(context).toHaveProperty('roles');
  expect(context).toHaveProperty('role');
  assert.ok('userId' in context);
  const { username, roles, role, userId, providerId } = context;
  expectTypeOf(userId).toBeNumber();
  expectTypeOf(username).toBeString();
  expectTypeOf(roles).toBeArray();
  expect(roles).toHaveLength(1);
  expectTypeOf(role).toBeString();
  expect(role).toEqual(roles[0]);
  switch (role) {
    case ROLE.AGENT: {
      expect(role).toEqual(ROLE.AGENT);
      expect(providerId).toEqual(undefined);
      break;
    }
    case ROLE.PROVIDER: {
      expect(role).toEqual(ROLE.PROVIDER);
      expect(providerId).toBeTypeOf('number');
      break;
    }
    default: {
      throw new Error(`BAD ROLE: ${role}`);
    }
  }
  return context;
};
