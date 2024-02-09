import assert from 'node:assert/strict';
import axios, { CreateAxiosDefaults, type AxiosRequestConfig } from 'axios';
import { Api } from 'sst/node/api';
import { expect } from 'vitest';
import { AnyZodObject, z } from 'zod';
import type { PaginatedResponse } from '@utils/helpers';
import { AUTH, LEGACY_API_URL, NODE_ENV, ROLE, Role } from '@utils/constants';
import { Config } from 'sst/node/config';

export interface ApiParams {
  joins?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  size?: number;
  page?: number;
}

export const IDS = {
  /* eslint-disable @typescript-eslint/naming-convention */
  JOB: parseInt(process.env.TEST_JOB_ID || '4555', 10),
  JOB_SECOND: parseInt(process.env.TEST_JOB2_ID || '1', 10),
  PROVIDER: parseInt(process.env.TEST_PROVIDER_ID || '138', 10),
  PROVIDER_UNAPPROVED: parseInt(
    process.env.TEST_PROVIDER_ID_UNAPPROVED || '442',
    10
  ),
  USER: parseInt(process.env.TEST_USER_ID || '2', 10),
};

export const PHONES = {
  PROVIDER_UNAPPROVED:
    process.env.TEST_PROVIDER_PHONE_UNAPPROVED || '16147355569',
};

export const USERNAMES = {
  AGENT: 'admin',
  /* eslint-enable @typescript-eslint/naming-convention */
};

export const fetchAuthHeader = async (role: Role) => {
  if (role === ROLE.PROVIDER)
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${await fetchV1Token(role)}`,
      [AUTH.VERSION_HEADER]: AUTH.AUTH_VERSION,
    };

  if (role === ROLE.AGENT)
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${await fetchV1Token(role)}`,
      [AUTH.VERSION_HEADER]: AUTH.AUTH_VERSION,
    };

  throw new Error('Unsupported role');
};

const oldTransformRequest = (() => {
  const {
    defaults: { transformRequest },
  } = axios;
  if (Array.isArray(transformRequest)) return transformRequest;
  if (transformRequest) return [transformRequest];
  return [];
})();
export const removeAuth: AxiosRequestConfig['transformRequest'] = [
  (data, headers) => {
    // eslint-disable-next-line no-param-reassign
    delete headers.Authorization;
    return data;
  },
  ...oldTransformRequest,
];

export const validationStatusCode = (
  status: number,
  expectedStatus: number = 200
) => {
  expect(status).toBe(expectedStatus);
};

export const validateList = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  key: string = 'data'
) => {
  expect(data).toHaveProperty(key);
  expect(Array.isArray(data[key])).toBeTruthy();
};

export const validateSchema = <T extends AnyZodObject>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
  schema: T,
  strict = false
) => {
  const verifier = strict ? schema.strict() : schema;
  const parsed = verifier.parse(object);
  expect(parsed.id).toEqual(object.id);
  return parsed as z.infer<T>;
};

export const validatePaginationData = (
  data: PaginatedResponse,
  params?: ApiParams
) => {
  expect(data).toHaveProperty('page');

  const paginationData = data.page;

  expect(typeof paginationData.size).toBe('number');
  expect(typeof paginationData.page).toBe('number');
  expect(typeof paginationData.totalElements).toBe('number');
  expect(paginationData.totalElements).toBeGreaterThanOrEqual(0);
  expect(typeof paginationData.number).toBe('number');
  expect(paginationData.number).toBeGreaterThanOrEqual(0);

  if (params?.size) {
    expect(paginationData.size).toBe(params.size);
    expect(paginationData.number).toBeLessThanOrEqual(params.size);
  } else {
    expect(paginationData.size).toBeGreaterThanOrEqual(0);
  }

  if (params?.page) {
    expect(paginationData.page).toBe(params.page);
  } else {
    expect(paginationData.page).toBeGreaterThanOrEqual(0);
  }
};

export const validateSort = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: any[],
  sortKey: string,
  order: string
) => {
  if (list.length <= 1) return;

  let threshold =
    order === 'desc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

  list.forEach((row) => {
    if (order === 'desc') {
      expect(row[sortKey]).toBeLessThanOrEqual(threshold);
    } else {
      expect(row[sortKey]).toBeGreaterThanOrEqual(threshold);
    }
    threshold = row[sortKey];
  });
};

export type PathBuilder = (slug: string | number) => string;

export const makePath = (
  builder: PathBuilder,
  variableName: string,
  value: string | number
): [path: string, description: string] => [
  builder(value),
  builder(`{${variableName}}`),
];

const partsIndex = {
  header: 0,
  payload: 1,
  sig: 2,
};
type Part = keyof typeof partsIndex;
// should test this function
export const modifyJwt = (token: string, part: Part) => {
  const idx = partsIndex[part];
  assert.ok(typeof idx === 'number', `Bad token part to modify!`);
  const parts = token.split('.');
  parts[idx] = changeRandomCharacter(parts[idx]);
  return parts.join('.');
};

// should test this function
export function changeRandomCharacter(input: string): string {
  if (input.length === 0) {
    throw new Error('Input string cannot be empty.');
  }

  const randomIndex = Math.floor(Math.random() * input.length);
  const originalChar = input.charAt(randomIndex);

  let newChar;
  do {
    newChar = String.fromCharCode(Math.floor(Math.random() * (127 - 32)) + 32);
  } while (newChar === originalChar);

  return `${input.substring(0, randomIndex)}${newChar}${input.substring(
    randomIndex + 1
  )}`;
}

const v1Token: Record<Role, string | null> = {
  [ROLE.AGENT]: null,
  [ROLE.PROVIDER]: null,
};
let _v1Fetching: boolean = false;
export const fetchV1Token = async (role: Role = ROLE.PROVIDER) => {
  assertTestEnv();
  if (!v1Token[role]) {
    switch (role) {
      case ROLE.AGENT: {
        v1Token[role] = await fetchV1TokenAgent();
        break;
      }
      case ROLE.PROVIDER: {
        v1Token[role] = await fetchV1TokenProvider();
        break;
      }
      default: {
        throw new Error(`Bad role: ${role}`);
      }
    }
  }
  return v1Token[role];
};

const fetchV1TokenAgent = async () => {
  const {
    data: { token },
  } = await axios.post(`${Api.api.url}/auth/password`, {
    username: USERNAMES.AGENT,
    password: Config.TEST_AGENT_PASSWORD,
  });
  assert.ok(typeof token === 'string', `Failed to fetch token!`);
  return token;
};

const fetchV1TokenProvider = async () => {
  // we have to handle the race condition of multiple token requests
  while (_v1Fetching) {
    // eslint-disable-next-line no-await-in-loop
    await sleep(1000);
  }
  _v1Fetching = true;
  const { status } = await axios.get(
    `${Api.api.url}/auth/sms?phone=${AUTH.MOCK_PHONE}`
  );
  assert.ok(status === 200, `Failed to request token!`);
  const {
    data: { token },
  } = await axios.post(`${Api.api.url}/auth/sms`, {
    phone: AUTH.MOCK_PHONE,
    challenge: AUTH.MOCK_CHALLENGE,
    code: AUTH.MOCK_OTP,
    deviceId: '123',
  });
  assert.ok(typeof token === 'string', `Failed to fetch token!`);
  _v1Fetching = false;
  return token;
};

const legacyToken: Record<Role, string | null> = {
  [ROLE.AGENT]: null,
  [ROLE.PROVIDER]: null,
};
export const fetchLegacyToken = async (role: Role = ROLE.PROVIDER) => {
  assertTestEnv();
  if (!legacyToken[role]) {
    switch (role) {
      case ROLE.AGENT: {
        legacyToken[role] = await fetchLegacyTokenAgent();
        break;
      }
      case ROLE.PROVIDER: {
        legacyToken[role] = await fetchLegacyTokenProvider();
        break;
      }
      default: {
        throw new Error(`Bad role: ${role}`);
      }
    }
  }
  return legacyToken[role];
};
const fetchLegacyTokenAgent = async () => {
  const {
    data: { access_token: token },
  } = await axios.postForm(`${LEGACY_API_URL}/auth/login`, {
    username: USERNAMES.AGENT,
    password: Config.TEST_AGENT_PASSWORD,
  });
  assert.ok(typeof token === 'string', `Failed to fetch legacy agent token!`);
  return token;
};

const fetchLegacyTokenProvider = async () => {
  await axios.get(`${LEGACY_API_URL}/auth/code/sms?phone=${AUTH.MOCK_PHONE}`);
  const {
    data: { access_token: token },
  } = await axios.post(
    `${LEGACY_API_URL}/auth/login/phone?smsCode=${AUTH.MOCK_OTP}&phone=${AUTH.MOCK_PHONE}`
  );
  assert.ok(
    typeof token === 'string',
    `Failed to fetch legacy provider token!`
  );
  return token;
};

export const sleep = (ms: number) =>
  new Promise((res) => {
    setTimeout(res, ms);
  });

const assertTestEnv = () =>
  assert.ok(
    process.env.NODE_ENV === NODE_ENV.TEST,
    `Bad NODE_ENV: ${process.env.NODE_ENV}!`
  );

export const authHeader = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Authorization: `Bearer ${await fetchV1Token()}`,
  [AUTH.VERSION_HEADER]: AUTH.AUTH_VERSION,
};

export const testRequester = ({
  headers = {},
  ...options
}: CreateAxiosDefaults = {}) =>
  axios.create({
    baseURL: Api.api.url,
    timeout: 10000,
    validateStatus: () => true,
    headers: {
      ...authHeader,
      ...headers,
    },
    ...options,
  });

export const request = testRequester();
