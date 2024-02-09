import { useEffect, useState } from 'react';

import { isClient } from '@/environments';

function isApple() {
  if (!isClient()) {
    return false;
  }

  return /mac|iphone|ipad|ipod/i.test(navigator.platform);
}

export function usePlatform() {
  const [platform, setPlatform] = useState<'mac' | 'pc' | null>(null);

  useEffect(() => {
    setPlatform(isApple() ? 'mac' : 'pc');
  }, []);

  return platform;
}
