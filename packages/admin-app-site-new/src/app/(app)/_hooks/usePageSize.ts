import { DEFAULT_PAGE_SIZE } from '../_constants';

import { useQueryParam } from './useQueryParam';
import { setServerCookie } from './useServerCookie';

export function usePageSize(initialValue = DEFAULT_PAGE_SIZE) {
  const [pageSize, setPageSize] = useQueryParam('size', initialValue, {
    removeDefaultsFromUrl: false,
  });

  function updatePageSize(newPageSize: number) {
    setPageSize(newPageSize);
    setServerCookie('page-size', newPageSize);
  }

  return [pageSize, updatePageSize] as const;
}
