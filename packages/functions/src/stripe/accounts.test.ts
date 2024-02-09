import {
  IDS,
  fetchAuthHeader,
  makePath,
  removeAuth,
  testRequester,
  validateList,
  validatePaginationData,
  validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { ROLE } from '@utils/constants';
import { AxiosInstance } from 'axios';
import { accountBankSchema, accountCardSchema } from 'clients/stripe';
import { beforeAll, describe, expect, it } from 'vitest';
import { z } from 'zod';

const makeFetchAccountsPath = (userId: string | number) =>
  `/users/${userId}/stripe/accounts`;
const [PATH, PATH_DESCRIPTION] = makePath(
  makeFetchAccountsPath,
  'userId',
  IDS.USER
);

describe(`GET ${PATH_DESCRIPTION}`, () => {
  let fetchAccounts: AxiosInstance;
  beforeAll(async () => {
    fetchAccounts = testRequester({
      headers: await fetchAuthHeader(ROLE.PROVIDER),
    });
  });

  it(`should return 401 without auth token`, async () => {
    const { status } = await fetchAccounts(PATH, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it(`should return the correct payload`, async () => {
    const { status, data } = await fetchAccounts(PATH);
    validationStatusCode(status);
    validateList(data);
    validatePaginationData(data);
    validateSchema(
      data.data[0],
      z.union([accountBankSchema, accountCardSchema])
    );
  });

  it(`should return 403 when trying to access the wrong user`, async () => {
    const { status, data } = await fetchAccounts(
      makeFetchAccountsPath(IDS.USER + 1)
    );
    validationStatusCode(status, 403);
    expect(data).toBeFalsy();
  });
});
