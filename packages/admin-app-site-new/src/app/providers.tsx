'use client';

import './_lib/axeCore';

import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import NextAdapterApp from 'next-query-params/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryParamProvider } from 'use-query-params';

import { Toaster } from '@/components';

import { queryClientConfig } from './_lib/reactQuery';

export function Providers({ children }: React.PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <QueryClientProvider client={queryClient}>
      <QueryParamProvider adapter={NextAdapterApp}>
        <SessionProvider>{children}</SessionProvider>
      </QueryParamProvider>

      <Toaster />

      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  );
}
