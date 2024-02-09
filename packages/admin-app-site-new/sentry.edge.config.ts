// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://729910cde7fcd5623c9a9fe4e17bef65@o533220.ingest.sentry.io/4506474950623232',
    environment: process.env.NEXT_PUBLIC_STAGE_NAME,

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,
  });
}
