'use client';

import { Provider as JotaiProvider } from 'jotai';

export function Providers({ children }: React.PropsWithChildren) {
  return <JotaiProvider>{children}</JotaiProvider>;
}
