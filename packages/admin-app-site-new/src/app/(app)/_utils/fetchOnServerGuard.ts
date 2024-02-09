import { cookies as nextCookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { DEFAULT_PAGE_SIZE } from '../_constants';

export async function fetchOnServerGuard(
  searchParams: Record<string, string>,
  fn: () => Promise<void>
) {
  const headersList = headers();

  const referer = headersList.get('referer');
  const xNextPathname = headersList.get('x-next-pathname');

  const isNaturalRequest = referer === null;
  const isComingFromDifferentPath =
    referer && new URL(referer).pathname !== xNextPathname;

  const cookies = nextCookies();
  const pageSize = cookies.get('page-size')?.value;

  if (searchParams.size === undefined) {
    return redirect(
      `${xNextPathname}?${new URLSearchParams({
        ...searchParams,
        size: pageSize ?? String(DEFAULT_PAGE_SIZE),
      }).toString()}`
    );
  }

  if (isNaturalRequest || isComingFromDifferentPath) {
    await fn();
  }

  return { cookies };
}
