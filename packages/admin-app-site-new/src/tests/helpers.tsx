/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import { useState } from 'react';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import { addCleanup } from '@testing-library/react-hooks';
import { QueryParamProvider } from 'use-query-params';
import { WindowHistoryAdapter } from 'use-query-params/adapters/window';

function AllTheProviders({ children }: React.PropsWithChildren) {
  const mutationCache = new MutationCache();
  const queryCache = new QueryCache();
  const [queryClient] = useState(
    new QueryClient({
      queryCache,
      mutationCache,
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
      logger: {
        log: console.log,
        warn: console.warn,
        error: () => {},
      },
    })
  );

  addCleanup(() => {
    mutationCache.clear();
    queryCache.clear();
  });

  return (
    <QueryParamProvider adapter={WindowHistoryAdapter}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </QueryParamProvider>
  );
}

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

export const MOCKED_NEXT_PUBLIC_API_URL = 'http://localhost:3333';
