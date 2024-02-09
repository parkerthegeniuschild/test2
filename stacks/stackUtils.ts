import assert from 'node:assert/strict';
import { Queue, QueueProps, StackContext, Topic } from 'sst/constructs';
import * as cw from 'aws-cdk-lib/aws-cloudwatch';
import * as cwactions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as snssubs from 'aws-cdk-lib/aws-sns-subscriptions';
import { Duration } from 'aws-cdk-lib';
import { defaultsDeep } from 'lodash';

const PROD_ALERT_EMAIL = 'admin@truckup.com';

// This utility helps us create a paired Queue with DLQ, along with global defaults
export const makeQueuePair = (
  stack: StackContext['stack'],
  id: string,
  {
    handlerSrc,
    queueProps = {},
    DLQProps = {},
    topic,
  }: {
    /** shorthand to create a default consumer function without props */
    handlerSrc?: string;
    /** props for the main Queue */
    queueProps?: QueueProps;
    /** props for the DLQ */
    DLQProps?: QueueProps;
    /** provide a topic to enable email alerts */
    topic?: Topic;
  } = {}
): [queue: Queue, DLQ: Queue, outputs: Record<string, string>] => {
  const DLQDefaultProps: QueueProps = {
    cdk: {
      queue: {
        enforceSSL: true,
        retentionPeriod: Duration.days(14),
      },
    },
  };
  const DLQ = new Queue(
    stack,
    `${id}DLQ`,
    defaultsDeep(DLQProps, DLQDefaultProps)
  );

  const defaultProps: QueueProps = {
    consumer: {
      function: handlerSrc
        ? {
            memorySize: 1024,
            handler: handlerSrc,
          }
        : undefined,
      cdk: {
        eventSource: {
          batchSize: 1,
          maxConcurrency: 5,
        },
      },
    },
    cdk: {
      queue: {
        enforceSSL: true,
        deadLetterQueue: {
          queue: DLQ.cdk.queue,
          maxReceiveCount: 3,
        },
      },
    },
  };
  const queue = new Queue(stack, id, defaultsDeep(queueProps, defaultProps));

  // We will send alerts to the configured email, or fallback to admin email for prod
  // configure via `AwsAlertEmail` in .env.local
  const isProd = stack.stage === 'prod';
  const alertEmail = process.env.AwsAlertEmail || (isProd && PROD_ALERT_EMAIL);
  const configureAlerts = topic && alertEmail;
  if (isProd)
    assert.ok(configureAlerts, `Queue pair alerts must be enabled for prod!`);

  if (configureAlerts) {
    const queueAlarm = new cw.Alarm(stack, `${id}Alarm`, {
      alarmDescription: `Alarm for ${id} SQS message age`,
      metric: queue.cdk.queue.metricApproximateAgeOfOldestMessage(),
      threshold: 300,
      evaluationPeriods: 1,
      comparisonOperator:
        cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cw.TreatMissingData.IGNORE,
    });
    const DLQAlarm = new cw.Alarm(stack, `${id}DLQAlarm`, {
      alarmDescription: `Alarm for ${id}DLQ message count`,
      metric: DLQ.cdk.queue.metricApproximateNumberOfMessagesVisible(),
      threshold: 0,
      evaluationPeriods: 1,
      comparisonOperator: cw.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cw.TreatMissingData.IGNORE,
    });

    const topic = new Topic(stack, `${id}AlarmTopic`);
    topic.cdk.topic.addSubscription(new snssubs.EmailSubscription(alertEmail));
    const snsAction = new cwactions.SnsAction(topic.cdk.topic);

    queueAlarm.addAlarmAction(snsAction);
    queueAlarm.addOkAction(snsAction);

    DLQAlarm.addAlarmAction(snsAction);
    DLQAlarm.addOkAction(snsAction);
  }

  const outputs = {
    [`${id}Url`]: queue.queueUrl,
    [`${id}Arn`]: queue.queueArn,
    [`${id}DLQUrl`]: DLQ.queueUrl,
    [`${id}DLQArn`]: DLQ.queueArn,
    [`${id}AlarmsConfigured`]: configureAlerts ? 'TRUE' : '',
  };
  return [queue, DLQ, outputs];
};
