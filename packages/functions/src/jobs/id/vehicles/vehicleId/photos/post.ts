import { getJobAndVehicle } from '@core/jobs';
import { useAuth, userIsAgent, userIsProvider } from 'clients/auth';
import { storage } from 'clients/storage';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupBadRequestError, TruckupForbiddenError } from 'src/errors';
import { useBody, useHeaders, usePathParams } from 'sst/node/api';
import { z } from 'zod';
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  colors,
  NumberDictionary,
} from 'unique-names-generator';
import { Bucket } from 'sst/node/bucket';
import { JobPhotos } from '@core/jobPhotos';

const createPathParams = JobPhotos.collectionPathParams;

export const handler = TupApiHandler(
  async () => {
    const { jobId, vehicleId } = createPathParams.parse(usePathParams());
    const headers = useHeaders();
    const { 'content-type': contentType, 'content-encoding': contentEncoding } =
      JobPhotos.createHeaders.parse(headers);
    const _body = useBody();
    if (!_body) throw new TruckupBadRequestError('Missing body');
    const body = Buffer.from(_body, contentEncoding);

    const { providerId, userId, username } = useAuth();
    const isAgent = userIsAgent();
    const isProvider = !isAgent && userIsProvider() && !!providerId;
    if (!(isAgent || isProvider)) throw new TruckupForbiddenError();

    const { job, vehicle } = await getJobAndVehicle({ jobId, vehicleId });

    if (!job || !vehicle || (isProvider && job.provider_id !== providerId))
      throw new TruckupForbiddenError();

    const file = createFileData({ jobId, vehicleId, contentType });

    await storage.put({
      bucket: Bucket.UploadsBucket.bucketName,
      key: file.path,
      body,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      sdk: { ContentType: contentType, ContentEncoding: contentEncoding },
    });

    const inserted = await JobPhotos.create({
      createdBy: username,
      contentType,
      contentEncoding,
      jobId,
      vehicleId,
      userId,
      sourcePath: file.path,
      filename: file.filename,
    });
    return await JobPhotos.formatUrl(inserted);
  },
  { method: 'POST' }
);

const createFileData = ({
  jobId,
  vehicleId,
  contentType,
}: {
  jobId: number;
  vehicleId: number;
  contentType: z.infer<typeof JobPhotos.contentTypeSchema>;
}) => {
  const slug = uniqueNamesGenerator({
    length: 4,
    style: 'lowerCase',
    separator: '-',
    dictionaries: [
      adjectives,
      colors,
      animals,
      NumberDictionary.generate({ min: 100, max: 999 }),
    ],
  });
  const extension = JobPhotos.contentTypeSchema
    .parse(contentType)
    .replace('image/', '');
  const filename = `${slug}.${extension}`;
  return {
    path: `source/jobs/${jobId}/vehicles/${vehicleId}/${filename}`,
    filename,
    type: extension,
  };
};
