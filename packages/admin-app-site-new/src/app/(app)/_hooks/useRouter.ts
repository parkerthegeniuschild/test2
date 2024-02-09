import { useRouter as _useRouter } from 'next/navigation';

import { TopLoader } from '@/app/_components';

export function useRouter() {
  const router = _useRouter();

  return {
    ...router,
    push(...params: Parameters<typeof router.push>) {
      TopLoader.start();
      router.push(...params);
    },
  };
}
