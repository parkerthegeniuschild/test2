'use client';

import { useSyncExternalStore } from 'react';

const noop = () => () => {};

export function ClientOnly({ children }: React.PropsWithChildren) {
  const value = useSyncExternalStore(
    noop,
    () => 'client',
    () => 'server'
  );

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return value === 'server' ? null : <>{children}</>;
}
