import {
  fetchV1Token,
  removeAuth,
  request,
  validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { PARTS_DEFAULT_MARKUP } from '@utils/config';
import { PARTS_MARKUP_DENOMINATOR, ROLE } from '@utils/constants';
import { AxiosResponse } from 'axios';
import { describe } from 'vitest';
import { z } from 'zod';

const PATH = `/default-markup`;

describe(`GET ${PATH}`, () => {
  it(`should return 401 when missing auth token`, async () => {
    const { status } = await request.get(PATH, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it(`should return the correct markup when requested as a provider`, async () => {
    await validateResponse(request.get(PATH));
  });

  it(`should return the correct response when request as an agent`, async () => {
    await validateResponse(
      request.get(PATH, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { Authorization: `Bearer ${await fetchV1Token(ROLE.AGENT)}` },
      })
    );
  });
});

const responseSchema = z.object({
  markup: z.literal(PARTS_DEFAULT_MARKUP),
  denominator: z.literal(PARTS_MARKUP_DENOMINATOR),
});

const validateResponse = async (res: Promise<AxiosResponse>) => {
  const { status, data } = await res;
  validationStatusCode(status);
  validateSchema(data, responseSchema, true);
};
