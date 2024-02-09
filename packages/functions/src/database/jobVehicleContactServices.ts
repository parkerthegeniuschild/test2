import { eq, sql } from 'drizzle-orm';
import {
  JobVehicleContactServicesStatus,
  jobVehicleContactServices as jobVehicleContactServicesSchema,
} from 'db/schema/jobVehicleContactServices';
import { useDb } from 'db/dbClient';
import { getSqlCurrentTimestamp } from '@utils/helpers';
import { TDatabaseOrTransaction } from '@utils/dbTransaction';
import { jobVehicleContacts as jobVehicleContactsSchema } from 'db/schema/jobVehicleContacts';
import { services as servicesSchema } from 'db/schema/services';

interface IUpdateServiceStatusInput {
  id: number;
  status: JobVehicleContactServicesStatus;
  author: string;
  dbInstance?: TDatabaseOrTransaction;
}

export const updateServiceStatus = async ({
  id,
  status,
  author,
  dbInstance = useDb(),
}: IUpdateServiceStatusInput) => {
  return await dbInstance
    .update(jobVehicleContactServicesSchema)
    .set({
      status,
      updated_by: author,
      updated_at: getSqlCurrentTimestamp(),
    })
    .where(eq(jobVehicleContactServicesSchema.id, id))
    .returning();
};

interface IGetHighestServiceMinimumHoursByJobIdInput {
  jobId: number;
  dbInstance?: TDatabaseOrTransaction;
}

export const getHighestServiceMinimumHoursByJobId = async ({
  jobId,
  dbInstance = useDb(),
}: IGetHighestServiceMinimumHoursByJobIdInput) => {
  const [result] = await dbInstance
    .select({
      max: sql`MAX(${servicesSchema.min_hours})`,
    })
    .from(jobVehicleContactServicesSchema)
    .innerJoin(
      jobVehicleContactsSchema,
      eq(
        jobVehicleContactsSchema.id,
        jobVehicleContactServicesSchema.job_vehicle_contact_id
      )
    )
    .innerJoin(
      servicesSchema,
      eq(servicesSchema.id, jobVehicleContactServicesSchema.service_id)
    )
    .where(eq(jobVehicleContactsSchema.job_id, jobId));

  return (result?.max as number) || 0;
};
