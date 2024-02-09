import { getJobAndPhoto } from '@core/jobs';
import { useAuth, userIsAgent, userIsProvider } from 'clients/auth';
import { storage } from 'clients/storage';
import TupApiHandler from 'handlers/TupApiHandler';
import { TruckupForbiddenError, TruckupNotFoundError } from 'src/errors';
import { usePathParams } from 'sst/node/api';
import { Bucket } from 'sst/node/bucket';
import { JobPhotos } from '@core/jobPhotos';
import { notEmpty } from '@utils/typeGuards';

const deletePathParams = JobPhotos.itemPathParams;

export const handler = TupApiHandler(
  async () => {
    const { jobId, vehicleId, photoId } = deletePathParams.parse(
      usePathParams()
    );

    const { userId, providerId } = useAuth();
    const isAgent = userIsAgent();
    const isProvider = !isAgent && userIsProvider() && !!providerId;
    if (!(isAgent || isProvider)) throw new TruckupForbiddenError();

    const { job, photo } = await getJobAndPhoto({ jobId, photoId });

    if (
      !job ||
      !photo ||
      (isProvider &&
        (job.provider_id !== providerId || photo.userId !== userId))
    )
      throw new TruckupNotFoundError();

    if (photo.vehicleId !== vehicleId) throw new TruckupNotFoundError();

    await JobPhotos.del(photoId);

    const filesToDelete = [photo.path, photo.sourcePath].filter(notEmpty);
    await Promise.all(
      filesToDelete.map((e) =>
        storage.del({ bucket: Bucket.UploadsBucket.bucketName, key: e })
      )
    );
  },
  { method: 'DELETE' }
);
