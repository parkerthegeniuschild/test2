import 'vitest';
import {
  removeAuth,
  request,
  validateSchema,
  validationStatusCode,
} from '@tests/helpers';
import { z } from 'zod';

const listSelectSchema = z.object({
  manufacturer: z.string(),
});

const urlManufacturers = '/vehicles/manufacturers';

describe(`GET ${urlManufacturers}`, () => {
  it("should return 401 code when doesn't have auth token", async () => {
    const { status } = await request.get(urlManufacturers, {
      transformRequest: removeAuth,
    });
    validationStatusCode(status, 401);
  });

  it('should return a list of manufacturers with success', async () => {
    const { status, data } = await request.get(urlManufacturers);
    validationStatusCode(status);
    expect(Array.isArray(data)).toBeTruthy();
    validateSchema(data[0], listSelectSchema);
  });

  it('should return a list of manufacturers limited and filtered  with success', async () => {
    const size = 2;
    const query = 'o';

    const { status, data } = await request.get(urlManufacturers, {
      params: {
        size,
        manufacturer: `ilike:%${query}%`,
      },
    });

    validationStatusCode(status);
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeLessThanOrEqual(size);
    validateSchema(data[0], listSelectSchema);
  });
});
