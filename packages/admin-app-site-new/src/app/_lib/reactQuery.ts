import type { QueryClientConfig } from '@tanstack/react-query';

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      keepPreviousData: true,
    },
  },
};
