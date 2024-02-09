import { JobStatusEnum } from '@core/jobsStatus';
import { TDatabaseOrTransaction } from '@utils/dbTransaction';
import { getSqlCurrentTimestamp } from '@utils/helpers';
import { useDb } from 'db/dbClient';
import { jobs as jobsSchema } from 'db/schema/jobs';
import { eq } from 'drizzle-orm';

export const db = useDb({
  jobs: jobsSchema,
});

interface IChangeJobStatusInput {
  jobId: number;
  newStatus: JobStatusEnum;
  author: string;
  dbInstance?: TDatabaseOrTransaction;
}

export const changeJobStatusId = async ({
  jobId,
  newStatus,
  author,
  dbInstance = db,
}: IChangeJobStatusInput) => {
  return await dbInstance
    .update(jobsSchema)
    .set({
      status_id: newStatus,
      updated_by: author,
      updated_at: getSqlCurrentTimestamp(),
    })
    .where(eq(jobsSchema.id, jobId))
    .execute();
};
