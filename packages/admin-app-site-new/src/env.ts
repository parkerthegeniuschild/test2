import { z } from 'zod';

import { isServer } from './environments';

const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_GOOGLE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_MAPS_ID: z.string().optional(),
});

const prodSchema = z.object({
  NEXT_PUBLIC_STAGE_NAME: z.string().min(1),
  NEXT_PUBLIC_GOOGLE_API_KEY: z.string().min(10),
  NEXT_PUBLIC_GOOGLE_MAPS_ID: z.string().min(10),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(10),
});

const envSchema = z.discriminatedUnion('NODE_ENV', [
  baseSchema
    .extend({ NODE_ENV: z.enum(['development', 'test']) })
    .merge(prodSchema.partial()),
  baseSchema.extend({ NODE_ENV: z.literal('production') }).merge(prodSchema),
]);

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_STAGE_NAME: process.env.NEXT_PUBLIC_STAGE_NAME,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  NEXT_PUBLIC_GOOGLE_MAPS_ID: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
});

const serverBaseSchema = z
  .object({
    NEXTAUTH_SECRET: z.string(),
  })
  .merge(baseSchema);

const serverProdSchema = z
  .object({
    NEXTAUTH_URL: z.string().url(),
  })
  .merge(prodSchema);

const serverEnvSchema = z.discriminatedUnion('NODE_ENV', [
  serverBaseSchema
    .extend({ NODE_ENV: z.enum(['development', 'test']) })
    .merge(serverProdSchema.partial()),
  serverBaseSchema
    .extend({ NODE_ENV: z.literal('production') })
    .merge(serverProdSchema),
]);

export const serverEnv = isServer()
  ? serverEnvSchema.parse(process.env)
  : ({} as z.infer<typeof serverEnvSchema>);
