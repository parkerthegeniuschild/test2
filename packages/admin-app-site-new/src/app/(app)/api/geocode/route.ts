import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { objectToQueryParams } from '@/app/(app)/_utils';
import { serverEnv } from '@/env';

const searchParamsSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const parsedSearchParamsSchema = searchParamsSchema.safeParse({
    lat: Number.parseFloat(searchParams.get('lat') ?? ''),
    lng: Number.parseFloat(searchParams.get('lng') ?? ''),
  });

  if (!parsedSearchParamsSchema.success) {
    return NextResponse.json(
      { error: 'Invalid search params' },
      { status: 400 }
    );
  }

  const { lat, lng } = parsedSearchParamsSchema.data;

  const geocodeSearchParams = objectToQueryParams({
    key: serverEnv.NEXT_PUBLIC_GOOGLE_API_KEY,
    language: 'en',
    latlng: `${lat},${lng}`,
  });

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?${geocodeSearchParams}`,
    { cache: 'force-cache' }
  );
  const data = (await response.json()) as { results: unknown[] };

  return NextResponse.json({ data: data.results[0] });
}
