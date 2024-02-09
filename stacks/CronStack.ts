import { Cron, Function, StackContext, use } from 'sst/constructs';

import { StorageStack } from './StorageStack';

export function CronStack({ stack }: StackContext) {
  const { ringCentralRecordingBucket } = use(StorageStack);

  const callLogFunction = new Function(stack, 'callLogFunction', {
    handler: 'packages/functions/src/crons/callLog.handler',
    environment: {
      RingcentralClientId: process.env.RingcentralClientId || 'NOT SET',
      RingcentralClientSecret: process.env.RingcentralClientSecret || 'NOT SET',
      RingcentralUsername: process.env.RingcentralUsername || 'NOT SET',
      RingcentralExtension: process.env.RingcentralExtension || 'NOT SET',
      RingcentralPassword: process.env.RingcentralPassword || 'NOT SET',
      RingcentralJWT: process.env.RingcentralJWT || 'NOT SET',
    },
  });

  const cron = new Cron(stack, 'callLogCron', {
    schedule: 'rate(5 days)',
    job: callLogFunction,
  });

  cron.bind([ringCentralRecordingBucket]);
  cron.attachPermissions([ringCentralRecordingBucket]);
}
