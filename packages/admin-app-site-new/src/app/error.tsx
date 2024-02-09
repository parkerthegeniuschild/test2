'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

import { Error } from './_components';

export default function GeneralError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return <Error onTryAgain={reset} />;
}
