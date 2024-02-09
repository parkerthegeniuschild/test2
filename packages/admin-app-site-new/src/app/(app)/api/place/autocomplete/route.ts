import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { objectToQueryParams } from '@/app/(app)/_utils';
import { serverEnv } from '@/env';

const searchParamsSchema = z.object({
  query: z.string(),
  sessionToken: z.string().nullable(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const parsedSearchParamsSchema = searchParamsSchema.safeParse({
    query: searchParams.get('query'),
    sessionToken: searchParams.get('sessionToken'),
  });

  if (!parsedSearchParamsSchema.success) {
    return NextResponse.json(
      { error: 'Invalid search params' },
      { status: 400 }
    );
  }

  const { query, sessionToken } = parsedSearchParamsSchema.data;

  const autocompleteSearchParams = objectToQueryParams({
    key: serverEnv.NEXT_PUBLIC_GOOGLE_API_KEY,
    sessiontoken: sessionToken ?? 'tup',
    input: encodeURIComponent(query),
    components: 'country:us|country:ca',
    language: 'en',
  });

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?${autocompleteSearchParams}`,
    { cache: 'force-cache' }
  );
  const data = (await response.json()) as { predictions: unknown[] };

  return NextResponse.json({ data: data.predictions });
}
