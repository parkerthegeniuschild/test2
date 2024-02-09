import { match } from 'ts-pattern';

export function providerFlagsToStatus(provider: {
  is_blocked: boolean;
  is_onjob: boolean;
  is_online: boolean;
}) {
  const STATUS_TO_TEXT = {
    unapproved: 'Unapproved',
    onJob: 'On a job',
    online: 'Online',
    offline: 'Offline',
  } as const;

  const status = match({
    isBlocked: provider.is_blocked,
    isOnJob: provider.is_onjob,
    isOnline: provider.is_online,
  })
    .with({ isOnJob: true }, () => 'onJob' as const)
    .with({ isBlocked: true }, () => 'unapproved' as const)
    .with({ isOnline: true }, () => 'online' as const)
    .otherwise(() => 'offline' as const);
  const statusText = STATUS_TO_TEXT[status];

  return { status, statusText };
}
