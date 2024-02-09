/* eslint-disable */
/* This legacy file has linting disabled. We should remove this file, or should fix the lint if we decide to keep it */
import { EventBridgeEvent } from 'aws-lambda/trigger/eventbridge';
import { flatten } from 'lodash';
import * as mime from 'mime-types';
import { Bucket } from 'sst/node/bucket';

import { Logger } from '@aws-lambda-powertools/logger';
import {
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { initRingCentral } from '../../../lib/externals/ringCentral';
import {
  getCallLog,
  getCallRecording,
  getExtensionIds,
} from '../../../lib/externals/ringCentral/request';

const logger = new Logger();
const s3client = new S3Client({});

export const handler = async (
  event: EventBridgeEvent<'Scheduled Event', any>
) => {
  logger.info(`Event: ${JSON.stringify(event, null, 2)}`);
  const platform = await initRingCentral();

  const extensionIds = await getExtensionIds(platform);
  const callLogs = await Promise.allSettled(
    extensionIds.map((extensionId) => getCallLog(platform, extensionId))
  );

  // @ts-ignore
  const calls = flatten(
    callLogs
      .filter(({ status }) => status === 'fulfilled')
      .map(({ value: { records } }) => records)
  );
  const recordings = calls
    .filter(({ recording }: any) => !!recording)
    .map(({ recording: { id } }: any) => id);
  const recordingsData = await Promise.all(
    recordings.map((recordingId: string) =>
      getCallRecording(platform, recordingId)
    )
  );

  await _recordingDataS3Put(recordingsData);

  return {
    body: JSON.stringify({ recordingsData, recordings }),
  };

  // TODO: Database actions for saving call log objects
};

async function _recordingDataS3Put(
  recordingsData: {
    data: ArrayBuffer;
    recordingId: string;
    contentType: string | undefined;
  }[]
) {
  await Promise.all(
    recordingsData.map(({ data, recordingId, contentType }) => {
      const extension = mime.extension(contentType || 'audio/mpeg');
      const command = new PutObjectCommand({
        Bucket: Bucket['ring-central-call-recordings'].bucketName,
        Key: `${recordingId}.${extension}`,
        ContentType: contentType,
        Body: data,
      });
      return s3client.send(command);
    })
  );
}
