// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
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
