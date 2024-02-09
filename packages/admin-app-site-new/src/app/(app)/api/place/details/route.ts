import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { objectToQueryParams } from '@/app/(app)/_utils';
import { serverEnv } from '@/env';

const searchParamsSchema = z.object({
  place_id: z.string(),
  fields: z.string().nullable(),
  sessionToken: z.string().nullable(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const parsedSearchParamsSchema = searchParamsSchema.safeParse({
    place_id: searchParams.get('place_id'),
    fields: searchParams.get('fields'),
    sessionToken: searchParams.get('sessionToken'),
  });

  if (!parsedSearchParamsSchema.success) {
    return NextResponse.json(
      { error: 'Invalid search params' },
      { status: 400 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { fields, place_id, sessionToken } = parsedSearchParamsSchema.data;

  const detailsSearchParams = objectToQueryParams({
    key: serverEnv.NEXT_PUBLIC_GOOGLE_API_KEY,
    sessiontoken: sessionToken ?? 'tup',
    place_id,
    fields,
    language: 'en',
  });

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?${detailsSearchParams}`,
    { cache: 'force-cache' }
  );
  const data = (await response.json()) as { result: unknown };

  return NextResponse.json({ data: data.result });
}
