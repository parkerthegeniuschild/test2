import { request, validateSchema, validationStatusCode } from '@tests/helpers';
import { z } from 'zod';

describe('GET /tz', () => {
  it("should return 401 code when doesn't have auth token", async () => {
    const { status } = await request.get('/tz', {
      transformRequest: (data, headers) => {
        // eslint-disable-next-line no-param-reassign
        delete headers.Authorization;
        return data;
      },
    });
    validationStatusCode(status, 401);
  });

  it('should return 400 when latitude is not passed', async () => {
    const { status } = await request.get('/tz', { params: { lng: 0 } });
    validationStatusCode(status, 400);
  });

  it('should return 400 when longitude is not passed', async () => {
    const { status } = await request.get('/tz', { params: { lat: 0 } });
    validationStatusCode(status, 400);
  });

  it('should return 400 when latitude is not a number', async () => {
    const { status } = await request.get('/tz', {
      params: { lat: 'a', lng: 0 },
    });
    validationStatusCode(status, 400);
  });

  it('should return 400 when longitude is not a number', async () => {
    const { status } = await request.get('/tz', {
      params: { lat: 0, lng: 'a' },
    });
    validationStatusCode(status, 400);
  });

  it('should return 400 when latitude is out of range', async () => {
    const { status } = await request.get('/tz', {
      params: { lat: 91, lng: 0 },
    });
    validationStatusCode(status, 400);
  });

  it('should return 400 when longitude is out of range', async () => {
    const { status } = await request.get('/tz', {
      params: { lat: 0, lng: 181 },
    });
    validationStatusCode(status, 400);
  });

  it('should successfully return the correct timezone', async () => {
    const vegasCoords = { lat: 36.078142, lng: -115.299175 };
    const responseSchema = z.object({ tz: z.string() });

    const { status, data } = await request.get('/tz', { params: vegasCoords });

    validationStatusCode(status);
    validateSchema(data, responseSchema);
    expect(data).toEqual({ tz: 'America/Los_Angeles' });
  });
});
