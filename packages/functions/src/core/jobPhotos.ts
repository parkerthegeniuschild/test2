import { PathIdScalar } from '@utils/schema';
import { storage } from 'clients/storage';
import { useDb } from 'db/dbClient';
import {
  createJobPhotoSchema,
  dbJobPhotos,
  selectJobPhotoSchema,
} from 'db/schema/jobPhotos';
import { eq, sql } from 'drizzle-orm';
import { TruckupInternalServerErrorError } from 'src/errors';
import { Bucket } from 'sst/node/bucket';
import { z } from 'zod';

// eslint-disable-next-line import/no-self-import
export * as JobPhotos from './jobPhotos';

export const collectionPathParams = z.object({
  jobId: PathIdScalar,
  vehicleId: PathIdScalar,
});

export const itemPathParams = collectionPathParams.extend({
  photoId: PathIdScalar,
});

export const contentTypeSchema = z.union([
  z.literal('image/jpeg'),
  z.literal('image/jpg'),
  z.literal('image/png'),
]);

export const createHeaders = z.object({
  /* eslint-disable @typescript-eslint/naming-convention */
  'content-type': contentTypeSchema,
  'content-encoding': z.literal('base64'),
  /* eslint-enable @typescript-eslint/naming-convention */
});

// this is a function so that it lazy loads the Bucket name
// this is in this file instead of the schema file due to the Bucket import making the drizzle migration generation step fail
export const coalesceJobPhotoUrl = () =>
  sql<string>`COALESCE(${dbJobPhotos.url}, CONCAT(${Bucket.UploadsBucket.bucketName}, ${dbJobPhotos.path}), CONCAT(${Bucket.UploadsBucket.bucketName}, ${dbJobPhotos.sourcePath}))`;

/**
 * @dev Note that this method causes an uninformative error to happen
 * if called from a function that does not have the bucket bound
 */
export const formatUrl = async (
  photo: z.infer<typeof selectJobPhotoSchema>
) => ({
  ...photo,
  url: await calculateUrl(photo),
});

const calculateUrl = async ({
  url,
  path,
  sourcePath,
}: z.infer<typeof selectJobPhotoSchema>) => {
  if (url) return url;
  const key = path || sourcePath;
  if (!key) return null;
  return await storage.createReadUrl({
    bucket: Bucket.UploadsBucket.bucketName,
    key,
  });
};

export const createSchema = createJobPhotoSchema.pick({
  createdBy: true,
  contentType: true,
  contentEncoding: true,
  sourcePath: true,
  filename: true,
  jobId: true,
  vehicleId: true,
  userId: true,
});
export type ICreateParams = z.infer<typeof createSchema>;
export const create = async (params: ICreateParams) => {
  const values = createSchema.parse(params);
  const [inserted] = await useDb()
    .insert(dbJobPhotos)
    .values(values)
    .returning();
  if (!inserted) throw new TruckupInternalServerErrorError();
  return inserted;
};

export const del = async (photoId: number) => {
  const [deleted] = await useDb()
    .delete(dbJobPhotos)
    .where(eq(dbJobPhotos.id, photoId))
    .returning();
  if (!deleted) throw new TruckupInternalServerErrorError();
};
