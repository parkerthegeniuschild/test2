import { useState } from 'react';
import { parseCookies } from 'nookies';

import { DEFAULT_PAGE_SIZE } from '@/app/(app)/_constants';

export function useGetPageSize() {
  const [pageSize] = useState(() => {
    const cookies = parseCookies();

    return cookies['page-size'] ?? DEFAULT_PAGE_SIZE;
  });

  return pageSize;
}
