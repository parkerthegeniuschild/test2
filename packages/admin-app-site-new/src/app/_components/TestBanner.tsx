import { match, P } from 'ts-pattern';

import { TestBanner as DSTestBanner } from '@/components';
import { env } from '@/env';

export function TestBanner() {
  const badgeText = match({
    env: env.NODE_ENV,
    stage: env.NEXT_PUBLIC_STAGE_NAME,
  })
    .with({ env: 'development' }, () => 'local')
    .with({ stage: 'dev' }, () => 'development')
    .with({ stage: 'prod' }, () => null)
    .with({ stage: P.string.minLength(1).select() }, stage => stage)
    .otherwise(() => null);

  if (!badgeText) {
    return null;
  }

  return <DSTestBanner>{badgeText}</DSTestBanner>;
}
