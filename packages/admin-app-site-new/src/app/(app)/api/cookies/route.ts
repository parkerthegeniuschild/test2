import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  name: z.string(),
  value: z.any().refine(v => v !== undefined),
});

export async function PUT(request: Request) {
  const res = (await request.json()) as z.infer<typeof requestSchema>;

  const schema = requestSchema.safeParse(res);

  if (!schema.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  cookies().set({
    name: schema.data.name,
    value: JSON.stringify(schema.data.value),
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return NextResponse.json({ ok: true });
}
