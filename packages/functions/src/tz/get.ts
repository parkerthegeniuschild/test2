import { ApiHandler } from 'sst/node/api';
import { response } from '@utils/response';
import { find as findTimezone } from 'geo-tz';
import { z } from 'zod';

const queryParamsSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const handler = ApiHandler(async (_evt) => {
  const parsedQueryParams = queryParamsSchema.safeParse({
    lat: parseFloat(_evt.queryStringParameters?.lat ?? ''),
    lng: parseFloat(_evt.queryStringParameters?.lng ?? ''),
  });

  if (!parsedQueryParams.success) {
    return response.error(parsedQueryParams.error.message);
  }

  const { lat, lng } = parsedQueryParams.data;

  try {
    const [timezone] = findTimezone(lat, lng);

    return response.success({ tz: timezone });
  } catch {
    return response.failure({ message: 'Error while getting timezone' });
  }
});
