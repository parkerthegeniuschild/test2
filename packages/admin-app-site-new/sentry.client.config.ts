// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://729910cde7fcd5623c9a9fe4e17bef65@o533220.ingest.sentry.io/4506474950623232',
    environment: process.env.NEXT_PUBLIC_STAGE_NAME,

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,

    replaysOnErrorSampleRate: 1.0,

    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,

    // You can remove this option if you're not planning to use the Sentry Session Replay feature:
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
        block: ['.StripeElement'],
      }),
    ],
  });
}
