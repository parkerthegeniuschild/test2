/* eslint-disable @typescript-eslint/naming-convention */

import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { TruckupInternalServerErrorError } from 'src/errors';
import { Config } from 'sst/node/config';

// eslint-disable-next-line import/no-self-import
export * as storage from './storage';

let _storage: S3Client | null = null;
export const useStorage = () => {
  if (!_storage) _storage = new S3Client({ region: Config.REGION });
  return _storage;
};

export const createReadUrl = async ({
  bucket,
  key,
  expiresIn = 60 * 10,
  sdk = {},
}: {
  bucket: string;
  key: string;
  expiresIn?: number;
  sdk?: Partial<GetObjectCommandInput>;
}) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key, ...sdk });
  return await getSignedUrl(useStorage(), command, { expiresIn });
};

export const createUploadUrl = async ({
  bucket,
  key,
  expiresIn = 60 * 10,
}: {
  bucket: string;
  key: string;
  expiresIn?: number;
}) => {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return await getSignedUrl(useStorage(), command, { expiresIn });
};

export const createSignedUpload = async ({
  bucket,
  key,
  body,
  contentType,
  expiresIn = 60 * 10,
}: {
  bucket: string;
  key: string;
  body: PutObjectCommandInput['Body'];
  contentType?: string;
  expiresIn?: number;
}) => {
  const { ETag } = await put({
    bucket,
    key,
    body,
    contentType,
  });

  if (!ETag) throw new TruckupInternalServerErrorError('Failed to upload file');

  return await createReadUrl({
    bucket,
    key,
    expiresIn,
  });
};

export const put = async ({
  bucket,
  key,
  body,
  contentType,
  sdk = {},
}: {
  bucket: string;
  key: string;
  contentType?: string;
  body: PutObjectCommandInput['Body'];
  sdk?: Partial<PutObjectCommandInput>;
}) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    ...sdk,
  });

  return await useStorage().send(command);
};

export const del = async ({
  bucket,
  key,
  sdk = {},
}: {
  bucket: string;
  key: string;
  sdk?: Partial<DeleteObjectCommandInput>;
}) => {
  const command = new DeleteObjectCommand({ Bucket: bucket, Key: key, ...sdk });
  await useStorage().send(command);
};
