import { useState } from 'react';
import { useMount } from 'react-use';

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useMount(() => setIsMounted(true));

  return isMounted;
}
