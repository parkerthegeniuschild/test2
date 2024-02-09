'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

import { Error } from './_components';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en-US">
      <body>
        <Error />
      </body>
    </html>
  );
}
