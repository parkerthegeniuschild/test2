import { changeJobStatusId } from '@db/jobs';
import { createTimer, stopActiveTimer } from '@db/serviceTimers';
import { JobStatuses } from '@utils/constants';
import { TDatabaseOrTransaction, TTransaction } from '@utils/dbTransaction';
import { SelectJobSchema } from 'db/schema/jobs';
import {
  TruckupCannotCompleteJobWithOnGoingServiceError,
  TruckupInvalidNextStatusError,
  TruckupInvalidPreviousStatusError,
  TruckupNotFoundError,
} from 'src/errors';
import { JobVehicleContactServicesStatus } from 'db/schema/jobVehicleContactServices';
import { updateServiceStatus } from '@db/jobVehicleContactServices';
import { useDb } from 'db/dbClient';
import { getJobById } from './jobs';

export type JobStatusEnum = (typeof JobStatuses)[keyof typeof JobStatuses];

interface IChangeJobStatusToInput {
  job: SelectJobSchema;
  author: string;
  dbInstance?: TDatabaseOrTransaction;
}

interface IChangeJobStatusInput extends IChangeJobStatusToInput {
  newStatus: JobStatusEnum;
}

async function validateCompletedJob(
  jobId: number,
  tx: TTransaction
): Promise<boolean> {
  const job = await getJobById(jobId, tx);

  if (!job) throw new TruckupNotFoundError();

  job.jobVehicles.forEach((vehicle) => {
    vehicle.jobServices.forEach((service) => {
      if (service.status !== JobVehicleContactServicesStatus.COMPLETED)
        throw new TruckupCannotCompleteJobWithOnGoingServiceError();
    });
  });

  return true;
}

export async function changeJobStatusAction({
  job,
  author,
  newStatus,
}: IChangeJobStatusInput) {
  switch (newStatus) {
    case JobStatuses.IN_PROGRESS:
      return await changeJobStatusToInProgress({ job, author });
    case JobStatuses.PAUSE:
      return await changeJobStatusToPause({ job, author });
    case JobStatuses.COMPLETED_PENDING_REVIEW:
      return await changeJobStatusToCompletedPendingReview({ job, author });
    case JobStatuses.CANCELED_PENDING_REVIEW:
      return await changeJobStatusToCanceledPendingReview({ job, author });
    case JobStatuses.COMPLETED:
      return await changeJobStatusToCompleted({ job, author });
    case JobStatuses.CANCELED:
      return await changeJobStatusToCanceled({ job, author });
    default:
      throw new TruckupInvalidNextStatusError();
  }
}

async function changeJobStatusToInProgress({
  job,
  author,
}: IChangeJobStatusToInput) {
  if (!job.status_id || !job.provider_id) throw new TruckupNotFoundError();

  if (
    ![JobStatuses.ACCEPTED.valueOf(), JobStatuses.PAUSE.valueOf()].includes(
      job.status_id
    )
  )
    throw new TruckupInvalidPreviousStatusError();

  await useDb().transaction(async (dbInstance) => {
    await changeJobStatusId({
      jobId: job.id,
      newStatus: JobStatuses.IN_PROGRESS,
      author,
      dbInstance,
    });

    await createTimer({
      body: {
        jobId: job.id,
        providerId: job.provider_id as number,
        createdBy: author,
      },
      dbInstance,
    });
  });
}

async function changeJobStatusToPause({
  job,
  author,
}: IChangeJobStatusToInput) {
  const { status_id: oldStatus, provider_id: providerId } = job;
  if (!oldStatus || !providerId) throw new TruckupNotFoundError();

  if (![JobStatuses.IN_PROGRESS.valueOf()].includes(oldStatus))
    throw new TruckupInvalidPreviousStatusError();

  await useDb().transaction(async (dbInstance) => {
    await changeJobStatusId({
      jobId: job.id,
      newStatus: JobStatuses.PAUSE,
      author,
      dbInstance,
    });

    const timer = await stopActiveTimer({
      author,
      jobId: job.id,
      providerId,
      dbInstance,
    });

    if (timer?.jobVehicleContactServiceId) {
      await updateServiceStatus({
        id: timer?.jobVehicleContactServiceId as number,
        author,
        status: JobVehicleContactServicesStatus.PAUSED,
        dbInstance,
      });
    }
  });
}

async function changeJobStatusToCompletedPendingReview({
  job,
  author,
}: IChangeJobStatusToInput) {
  const { status_id: oldStatus, provider_id: providerId } = job;
  if (!oldStatus || !providerId) throw new TruckupNotFoundError();
  if (
    ![
      JobStatuses.ACCEPTED.valueOf(),
      JobStatuses.IN_PROGRESS.valueOf(),
      JobStatuses.PAUSE.valueOf(),
      JobStatuses.CANCELED_PENDING_REVIEW.valueOf(),
      JobStatuses.COMPLETED.valueOf(),
    ].includes(oldStatus)
  )
    throw new TruckupInvalidPreviousStatusError();

  await useDb().transaction(async (dbInstance) => {
    await validateCompletedJob(job.id, dbInstance);

    await changeJobStatusId({
      jobId: job.id,
      newStatus: JobStatuses.COMPLETED_PENDING_REVIEW,
      author,
      dbInstance,
    });

    await stopActiveTimer({
      author,
      jobId: job.id,
      providerId,
      dbInstance,
    });
  });
}

async function changeJobStatusToCanceledPendingReview({
  job,
  author,
}: IChangeJobStatusToInput) {
  const { status_id: oldStatus, provider_id: providerId } = job;
  if (!oldStatus) throw new TruckupNotFoundError();

  if (
    ![
      JobStatuses.UNASSIGNED.valueOf(),
      JobStatuses.NOTIFYING.valueOf(),
      JobStatuses.ACCEPTED.valueOf(),
      JobStatuses.IN_PROGRESS.valueOf(),
      JobStatuses.PAUSE.valueOf(),
      JobStatuses.COMPLETED_PENDING_REVIEW.valueOf(),
      JobStatuses.CANCELED.valueOf(),
    ].includes(oldStatus)
  )
    throw new TruckupInvalidPreviousStatusError();

  await useDb().transaction(async (dbInstance) => {
    await changeJobStatusId({
      jobId: job.id,
      newStatus: JobStatuses.CANCELED_PENDING_REVIEW,
      author,
      dbInstance,
    });

    if (providerId) {
      await stopActiveTimer({
        author,
        jobId: job.id,
        providerId,
        dbInstance,
      });
    }
  });
}

async function changeJobStatusToCompleted({
  job,
  author,
}: IChangeJobStatusToInput) {
  if (!job.status_id || !job.provider_id) throw new TruckupNotFoundError();

  if (![JobStatuses.COMPLETED_PENDING_REVIEW.valueOf()].includes(job.status_id))
    throw new TruckupInvalidPreviousStatusError();

  await useDb().transaction(async (dbInstance) => {
    await validateCompletedJob(job.id, dbInstance);

    await changeJobStatusId({
      jobId: job.id,
      newStatus: JobStatuses.COMPLETED,
      author,
      dbInstance,
    });
  });
}

async function changeJobStatusToCanceled({
  job,
  author,
}: IChangeJobStatusToInput) {
  if (!job.status_id || !job.provider_id) throw new TruckupNotFoundError();

  if (![JobStatuses.CANCELED_PENDING_REVIEW.valueOf()].includes(job.status_id))
    throw new TruckupInvalidPreviousStatusError();

  await useDb().transaction(async (dbInstance) => {
    await changeJobStatusId({
      jobId: job.id,
      newStatus: JobStatuses.CANCELED,
      author,
      dbInstance,
    });
  });
}
